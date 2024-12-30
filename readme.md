# LogiChat: RAG-Based Chatbot with Document Uploads

LogiChat is a Retrieval-Augmented Generation (RAG) based chatbot application powered by Large Language Models (LLMs). It enables users to upload their documents and have intelligent, context-aware conversations derived exclusively from their provided data.

## Key Features
- **Document Uploads**: Users can upload documents in various formats.
- **Intelligent Conversations**: The chatbot generates contextually accurate responses based on user-provided data.
- **Powered by LLMs**: Leverages advanced LLMs for natural language understanding and generation.
- **Secure and Private**: Your documents are used solely for generating responses and are stored securely.

## Tech Stack
- **Backend**: Flask, LangChain, PineConeVector, OpenAI API
- **Frontend**: Next.js
- **Database**: PineConeVector for vectorized document storage

## Architecture
LogiChat uses Retrieval-Augmented Generation (RAG) to combine LLM capabilities with document retrieval. The steps include:
1. **Document Vectorization**: Uploaded documents are converted into embeddings and stored in a vector database.
2. **History-Aware Retrieval**: Queries are reformulated contextually using chat history.
3. **Response Generation**: Retrieved data and user queries are processed by the LLM to generate responses.

## Installation and Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- An OpenAI API key
- A `.env` file with the following keys:
  ```dotenv
  OPENAI_API_KEY=your_openai_api_key
  ```

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/LogiChat.git
   cd LogiChat/backend
   ```

2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Run the Flask backend:
   ```bash
   python app.py
   ```

### client Setup
1. Navigate to the `client` directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage
1. Start the backend and client servers.
2. Open your browser and navigate to the Next.js client (typically at `http://localhost:3000`).
3. Upload a document to begin a conversation.
4. Interact with the chatbot using natural language queries.

## File Structure
```plaintext
LogiChat/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt       # Backend dependencies
│   └── .env                   # Environment variables
├── client/
│   ├── pages/                 # Next.js pages
│   ├── components/            # Reusable UI components
│   ├── public/                # Static assets
│   └── package.json           # Frontend dependencies
└── README.md                  # Project documentation
```

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your proposed changes.


