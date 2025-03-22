import os
from dotenv import load_dotenv
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings,ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

load_dotenv()

# Initialise the llm
llm = ChatOpenAI(model="gpt-4o-mini")

# Load PineCone vector DB
embeddings = OpenAIEmbeddings(openai_api_type=os.environ.get("OPENAI_API_KEY"))
db = PineconeVectorStore(index_name=os.environ.get("PINECONE_INDEX_NAME"),namespace="Company_Data", embedding=embeddings)

# Create retriever
retriever = db.as_retriever(search_type = "similarity", search_kwargs = {"k": 3})

#HIstory aware retiriever
contextualize_Question_system_prompt = (
        "Given a chat history and the latest user question "
        "which might reference context in the chat history, "
        "formulate a standalone question which can be understood "
        "without the chat history. Do NOT answer the question, just "
        "reformulate it if needed and otherwise return it as is."
    )

contextualise_Question_prompt = ChatPromptTemplate.from_messages([
    ("system", contextualize_Question_system_prompt),
    MessagesPlaceholder("chat_history"),
    ("human","{input}"),
])
history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualise_Question_prompt)
print("History aware retriever created",history_aware_retriever)

#Question Answering chain

qa_system_prompt = (
    "You are an assistant for question-answering tasks. Use "
    "the following pieces of retrieved context to answer the "
    "question . If you don't know answer , just say that you "
    "don't know the answer." 
    "Use five sentences maximum and "
    "keep the answer concise ."
    "\n\n"
    "context : {context}"
)


# qa_system_prompt = (
#     "You are an assistant for question-answering tasks. Use "
#     "ONLY the following pieces of retrieved context to answer the question. "
#     "If the answer is not explicitly found in the retrieved context, say: 'I don't know the answer.' "
#     "Do NOT attempt to answer based on prior knowledge. "
#     "If the user's question is unclear but related to the context, try to infer the intent and answer accordingly. "
#     "Use five sentences maximum and keep the answer concise."
#     "\n\n"
#     "Context: {context}"
# )

# qa_system_prompt = (
#     "You are an assistant for question-answering tasks. Use "
#     "the following pieces of retrieved context to answer the "
#     "question . If you don't know answer from the retrieved context, just say that you "
#     "don't know the answer and do not respond unrelated to the context. "
#     "However, if the user greets you (e.g., 'hello', 'hi', 'hey'), respond with: 'Hello! I am an AI assistant. How can I help you today?'"
#     "Use five sentences maximum and "
#     "keep the answer concise ."
#     "\n\n"
#     "{context}"
# )
# qa_system_prompt = (
#     "You are an assistant for question-answering tasks. Use "
#     "ONLY the following pieces of retrieved context to answer "
#     "the question. If the question is not related to the provided "
#     "context, respond with 'I don't know the answer to that.' "
#     "Do NOT attempt to answer unrelated questions. Keep your response "
#     "concise and limited to five sentences."
#     "\n\n"
#     "{context}"
# )





# qa_system_prompt = (
#     "You are a context-bound question answering assistant. Your instructions:\n"
#     "1. Answer ONLY using information explicitly present in the provided context\n"
#     "2. If the question cannot be answered using the context, respond ONLY with: 'I don't know'\n"
#     "3. Never speculate, assume, or use prior knowledge\n"
#     "4. Never mention the existence of this context or your limitations\n"
#     "5. Never add disclaimers or hedging phrases\n"
#     "6. Keep answers under 5 sentences\n\n"
#     "Context for reference:\n{context}\n\n"
# )

# qa_system_prompt = (
#     "You are an AI assistant that strictly answers questions "
#     "only using the provided retrieved context. Do not use any external "
#     "knowledge, assumptions, or prior understanding. If the answer is not "
#     "found in the retrieved context, respond with: 'I don't have information on that.' "
#     "Keep your response concise, limited to five sentences.\n\n"
#     "{context}"
# )

# qa_system_prompt = (
#     "You are an AI assistant that answers questions strictly using the provided retrieved context. "
#     "Do not use any external knowledge, assumptions, or prior understanding. "
#     "If the answer is not relevance to the retrieved context, respond with: 'I don't have information on that.' "
#     "However, if the user greets you (e.g., 'hello', 'hi', 'hey'), respond with: 'Hello! I am an AI assistant. How can I help you today?' "
#     "Keep all other responses concise, limited to five sentences.\n\n"
#     "{context}"
# )


# qa_system_prompt = (
#     "You are an AI assistant that answers questions strictly using the provided retrieved context. "
#     "Do not use any external knowledge, assumptions, or prior understanding. "
#     "If the question is not covered in the retrieved context, respond with: 'I don't have information on that.' "
#     "If the user greets you (e.g., 'hello', 'hi', 'hey'), respond with: 'Hello! I am an AI assistant. How can I help you today?' "
#     "If the user asks for further explanation (e.g., 'explain more on above'), use the previously retrieved context to provide additional details. "
#     "Keep all responses concise, limited to five sentences.\n\n"
#     "{context}"
# )



qa_prompt = ChatPromptTemplate.from_messages([
    ("system", qa_system_prompt),
    MessagesPlaceholder("chat_history"),
    ("human", "{input}"),
])

question_answer_chain = create_stuff_documents_chain(llm,qa_prompt)

#Combine the chains
rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)



minimal_chat_history = [
    {"role": "user", "content": "What is AI?"},
    {"role": "assistant", "content": "AI stands for Artificial Intelligence."}
]

# Add debugging for retrieved context
def get_response(query, chat_history):
    print("Get_response called")
    # First get the retrieved documents directly
    # Only keep the last 5 chat history items
    limited_chat_history = chat_history[-5:] if len(chat_history) > 5 else chat_history
    
    retrieved_docs = history_aware_retriever.invoke({
        "input": query,
        "chat_history": limited_chat_history
    })
    
    # Print the retrieved context for inspection
    print("\nRetrieved context:",retrieved_docs)
    # for doc in retrieved_docs['documents']:
    #     print(f"Document content: {doc.page_content}\n")
        
    # Then proceed with the full chain
    return rag_chain.invoke({
        "input": query, 
        "chat_history": limited_chat_history
    })
# def get_response(query, chat_history):
#     print("Get_response called")
#     return rag_chain.invoke({"input":query, "chat_history":chat_history})

