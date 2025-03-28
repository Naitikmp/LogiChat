from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.llm import get_response
from utils.whatsapp_client import whatsapp_client

app = Flask(__name__)
CORS(app)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    query = data.get('query')
    chat_history = data.get('chat_history', [])
    
    if not query:
        return jsonify({"error": "query is required"}), 400
    
    try:
        response = get_response(query, chat_history)
        return jsonify({"answer": response["answer"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/webhook', methods=['GET'])
def verify_webhook():
    """Handle webhook verification from WhatsApp"""
    mode = request.args.get("hub.mode")
    token = request.args.get("hub.verify_token")
    challenge = request.args.get("hub.challenge")
    
    success, response = whatsapp_client.verify_webhook(mode, token, challenge)
    
    if success:
        return str(response)
    return jsonify({"error": response}), 403

@app.route('/webhook', methods=['POST'])
def webhook():
    """Handle incoming messages from WhatsApp"""
    try:
        data = request.json
        
        # Handle only WhatsApp messages
        if data.get("object") == "whatsapp_business_account":
            for entry in data.get("entry", []):
                for change in entry.get("changes", []):
                    if change.get("value", {}).get("messages"):
                        for message in change["value"]["messages"]:
                            if message.get("type") == "text":
                                # Get the message details
                                phone_number = message["from"]
                                message_text = message["text"]["body"]
                                
                                # Get response from LLM
                                response = get_response(message_text, [])
                                
                                # Send response back
                                success, result = whatsapp_client.send_message(
                                    phone_number, 
                                    response["answer"]
                                )
                                
                                if not success:
                                    print(f"Error sending message: {result}")
            
            return "OK", 200
        return "Not a WhatsApp message", 404
        
    except Exception as e:
        print(f"Error in webhook: {str(e)}")
        return str(e), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)