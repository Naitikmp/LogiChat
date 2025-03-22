import requests
import os
from dotenv import load_dotenv

load_dotenv()

class WhatsAppClient:
    def __init__(self):
        self.api_version = "v17.0"  # Current WhatsApp Business API version
        self.phone_number_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
        self.access_token = os.getenv("WHATSAPP_ACCESS_TOKEN")
        self.base_url = f"https://graph.facebook.com/{self.api_version}/{self.phone_number_id}"
        
    def send_message(self, to_phone_number, message):
        """Send a message to a WhatsApp number"""
        try:
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            
            data = {
                "messaging_product": "whatsapp",
                "to": to_phone_number,
                "type": "text",
                "text": {"body": message}
            }
            
            response = requests.post(
                f"{self.base_url}/messages",
                headers=headers,
                json=data
            )
            
            if response.status_code == 200:
                return True, response.json()
            return False, response.json()
            
        except Exception as e:
            return False, str(e)
    
    def verify_webhook(self, mode, token, challenge):
        """Verify webhook endpoint for WhatsApp"""
        verify_token = os.getenv("WHATSAPP_VERIFY_TOKEN")
        
        if mode and token:
            if mode == "subscribe" and token == verify_token:
                return True, challenge
            return False, "Invalid verify token"
        return False, "Invalid parameters"

# Create a global instance
whatsapp_client = WhatsAppClient() 