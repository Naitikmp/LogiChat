from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.llm import get_response


app = Flask(__name__)
CORS(app)

@app.route('/api/chat',methods=['POST'])
def chat():
    data = request.json
    query = data.get('query')
    chat_history = data.get('chat_history',[])
    print(chat_history)

    if not query:
        return jsonify({"error":"query is required"}),400
    
    try:
        response = get_response(query,chat_history)
        return jsonify({"answer":response["answer"]})
    except Exception as e:
        return jsonify({"error":str(e)}),500
    
if __name__ == '__main__':
    app.run(debug=True)