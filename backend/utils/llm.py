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
db = PineconeVectorStore(index_name=os.environ.get("PINECONE_INDEX_NAME"), embedding=embeddings)

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
    "question . If you don't know answer, just say that you "
    "don't know the answer. Use five sentences maximum and "
    "keep the answer concise ."
    "\n\n"
    "{context}"
)

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

def get_response(query, chat_history):
    print("Get_response called")
    return rag_chain.invoke({"input":query, "chat_history":chat_history})

