import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings , ChatOpenAI
from langchain_pinecone import PineconeVectorStore
from dotenv import load_dotenv

load_dotenv()

print("step : Loading Pdfss")
path = os.path.join(os.path.dirname(__file__), "Hands_On_Machine_Learning_with_Scikit_Learn_and_TensorFlow.pdf")
loader = PyPDFLoader(path)
document = loader.load()
print(f"loaded document with {len(document)} characters")

print("step : Splitting Text into Chunkss")
texts = CharacterTextSplitter(chunk_size=1000, chunk_overlap=100).split_documents(document)
print(f"split document into {len(texts)} chunks")

print("step : Creating Embeddingss")
# embeddings = OpenAIEmbeddings(api_key=os.environ.get("OPENAI_API_KEY"),openai_api_type=)
embeddings = OpenAIEmbeddings(openai_api_type=os.environ.get("OPENAI_API_KEY"))

PineconeVectorStore.from_documents(texts, embeddings,index_name = os.environ.get("PINECONE_INDEX_NAME"))
