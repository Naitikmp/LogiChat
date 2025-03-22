// components/NexauraChatbot.js
'use client'; // Add this for Next.js 13+ with app directory

import React, { useEffect, useRef } from 'react';
import { sendMessageToAPI } from '@/lib/api/chat';

const NexauraChatbot = ({
    apiEndpoint = 'https://api.example.com/chat',
    apiHeaders = {},
    botName = 'Nexaura Assistant',
    welcomeMessage = 'Hello! How can I help you today?',
    primaryColor = '#4a6cf7'
}) => {
    const chatbotRef = useRef(null);
    const initialized = useRef(false);

    useEffect(() => {
        // Skip if already initialized or running on server-side
        if (initialized.current || typeof window === 'undefined') return;

        const addChatbotStyles = () => {
            const styleEl = document.createElement('style');
            styleEl.innerHTML = `
        :root {
          --primary-color: ${primaryColor};
          --secondary-color: #e9eeff;
          --text-color: #333;
          --light-text: #6b7280;
          --bg-color: #fff;
          --border-radius: 12px;
          --shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s ease;
        }

        .nexaura-chat-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .nexaura-chat-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: var(--primary-color);
          box-shadow: var(--shadow);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .nexaura-chat-button:hover {
          transform: scale(1.05);
        }

        .nexaura-chat-button svg {
          width: 28px;
          height: 28px;
          fill: white;
        }

        .nexaura-chat-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 380px;
          height: 550px;
          background-color: var(--bg-color);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: var(--transition);
          opacity: 0;
          transform: translateY(20px) scale(0.9);
          pointer-events: none;
        }

        .nexaura-chat-window.active {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: all;
        }

        .nexaura-chat-header {
          padding: 16px 20px;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nexaura-chat-title {
          font-weight: 600;
          font-size: 18px;
        }

        .nexaura-close-button {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          padding: 5px;
        }

        .nexaura-chat-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .nexaura-message {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 18px;
          line-height: 1.4;
          position: relative;
          font-size: 14px;
        }

        .nexaura-bot-message {
          background-color: var(--secondary-color);
          color: var(--text-color);
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }

        .nexaura-user-message {
          background-color: var(--primary-color);
          color: white;
          align-self: flex-end;
          border-bottom-right-radius: 4px;
        }

        .nexaura-bot-typing {
          align-self: flex-start;
          padding: 15px 20px;
          background-color: var(--secondary-color);
          border-radius: 18px;
          border-bottom-left-radius: 4px;
          display: none;
        }

        .nexaura-typing-animation {
          display: flex;
          gap: 5px;
        }

        .nexaura-typing-dot {
          width: 8px;
          height: 8px;
          background-color: var(--light-text);
          border-radius: 50%;
          animation: nexauraTypingAnimation 1.4s infinite ease-in-out;
        }

        .nexaura-typing-dot:nth-child(1) {
          animation-delay: 0s;
        }

        .nexaura-typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .nexaura-typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes nexauraTypingAnimation {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .nexaura-chat-input-container {
          padding: 16px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          display: flex;
          gap: 12px;
        }

        .nexaura-chat-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 24px;
          outline: none;
          font-size: 14px;
          transition: var(--transition);
        }

        .nexaura-chat-input:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.2);
        }

        .nexaura-send-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--primary-color);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .nexaura-send-button:hover {
          background-color: #3a5cd8;
        }

        .nexaura-send-button svg {
          width: 18px;
          height: 18px;
          fill: white;
        }

        .nexaura-powered-by {
          text-align: center;
          padding: 10px;
          font-size: 12px;
          color: var(--light-text);
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }

        .nexaura-powered-by a {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 500;
        }

        /* Interactive elements styling */
        .nexaura-link {
          color: var(--primary-color);
          text-decoration: underline;
          font-weight: 500;
          word-break: break-all;
        }
        
        .nexaura-email {
          color: #0078d4;
          text-decoration: underline;
          font-weight: 500;
        }
        
        .nexaura-phone {
          color: #107c10;
          text-decoration: underline;
          font-weight: 500;
        }
        
        .nexaura-reference {
          background-color: rgba(74, 108, 247, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-weight: 600;
          color: var(--primary-color);
        }
        
        /* Content formatters */
        .nexaura-callout {
          background-color: #f8f9fa;
          border-left: 4px solid var(--primary-color);
          padding: 12px;
          margin: 8px 0;
          border-radius: 4px;
        }
        
        .nexaura-list {
          margin-left: 20px;
          list-style-type: disc;
        }
        
        .nexaura-list-item {
          margin-bottom: 4px;
        }

        /* Responsiveness */
        @media (max-width: 480px) {
          .nexaura-chat-window {
            width: calc(100vw - 40px);
            height: 60vh;
          }
        }
      `;
            document.head.appendChild(styleEl);
        };

        const initChatbot = () => {
            if (!chatbotRef.current) return;

            // Create the chatbot container
            const container = chatbotRef.current;

            // Render chatbot HTML
            container.innerHTML = `
        <div class="nexaura-chat-container">
          <div class="nexaura-chat-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 1c-6.627 0-12 4.364-12 9.749 0 3.131 1.817 5.917 4.64 7.7.868 2.167-1.083 4.008-3.142 4.503 2.271.195 6.311-.121 9.374-2.498 7.095.538 13.128-3.185 13.128-9.705 0-5.385-5.373-9.749-12-9.749z"/>
            </svg>
          </div>
          <div class="nexaura-chat-window">
            <div class="nexaura-chat-header">
              <div class="nexaura-chat-title">${botName}</div>
              <button class="nexaura-close-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="nexaura-chat-messages"></div>
            <div class="nexaura-bot-typing">
              <div class="nexaura-typing-animation">
                <div class="nexaura-typing-dot"></div>
                <div class="nexaura-typing-dot"></div>
                <div class="nexaura-typing-dot"></div>
              </div>
            </div>
            <div class="nexaura-chat-input-container">
              <input type="text" class="nexaura-chat-input" placeholder="Type your message...">
              <button class="nexaura-send-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
            <div class="nexaura-powered-by">
              Powered by <a href="https://nexauralabs.com" target="_blank">Nexaura.ai</a>
            </div>
          </div>
        </div>
      `;

            // Setup variables
            const chatWindow = container.querySelector('.nexaura-chat-window');
            const messagesContainer = container.querySelector('.nexaura-chat-messages');
            const inputField = container.querySelector('.nexaura-chat-input');
            const sendButton = container.querySelector('.nexaura-send-button');
            const typingIndicator = container.querySelector('.nexaura-bot-typing');
            const chatButton = container.querySelector('.nexaura-chat-button');
            const closeButton = container.querySelector('.nexaura-close-button');
            let isOpen = false;
            let messageHistory = [];

            // Add event listeners
            chatButton.addEventListener('click', toggleChatWindow);
            closeButton.addEventListener('click', toggleChatWindow);
            sendButton.addEventListener('click', sendMessage);
            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });

            function toggleChatWindow() {
                isOpen = !isOpen;
                if (isOpen) {
                    chatWindow.classList.add('active');
                    inputField.focus();
                } else {
                    chatWindow.classList.remove('active');
                }
            }

            function addUserMessage(text) {
                const messageElement = document.createElement('div');
                messageElement.classList.add('nexaura-message', 'nexaura-user-message');
                messageElement.textContent = text;
                messagesContainer.appendChild(messageElement);
                scrollToBottom();

                // Add to history
                messageHistory.push({
                    role: 'user',
                    content: text
                });
            }

            function addBotMessage(text) {
                const messageElement = document.createElement('div');
                messageElement.classList.add('nexaura-message', 'nexaura-bot-message');
                // messageElement.textContent = text;
                // Process text to make emails, phone numbers, and links interactive
                console.log('Adding bot message:', text);
                const processedText = processMessageText(text);
                messageElement.innerHTML = processedText;
                messagesContainer.appendChild(messageElement);
                scrollToBottom();

                // Add to history (store original text without HTML)
                messageHistory.push({
                    role: 'assistant',
                    content: text
                });
            }

            function processMessageText(text) {
                // Process text to detect and format special content
                console.log('Processing message:', text);
                
                // Make URLs clickable
                let processedText = text.replace(
                    /(https?:\/\/[^\s]+)/g,
                    '<a href="$1" target="_blank" class="nexaura-link">$1</a>'
                );
                console.log('Processed URLs:', processedText);
                
                // Make emails clickable
                processedText = processedText.replace(
                    /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi,
                    '<a href="mailto:$1" class="nexaura-email">$1</a>'
                );

                // Make phone numbers clickable
                processedText = processedText.replace(
                    /(\+\d{1,4}\s?)?(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/g,
                    '<a href="tel:$1$2" class="nexaura-phone">$1$2</a>'
                );

                // Highlight reference numbers/codes
                processedText = processedText.replace(
                    /(Ref|ID|Code|Reference):\s*([A-Z0-9-]{4,})/gi,
                    '$1: <span class="nexaura-reference">$2</span>'
                );

                // Convert line breaks to <br> tags
                processedText = processedText.replace(/\n/g, '<br>');

                return processedText;
            }

            function showTypingIndicator() {
                typingIndicator.style.display = 'block';
                scrollToBottom();
            }

            function hideTypingIndicator() {
                typingIndicator.style.display = 'none';
            }

            function scrollToBottom() {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }

            async function sendMessage() {
                const message = inputField.value.trim();
                if (!message) return;

                // Clear input field
                inputField.value = '';

                // Add user message to chat
                addUserMessage(message);

                // Show typing indicator
                showTypingIndicator();

                try {
                    // Call API endpoint
                    //   const response = await callChatAPI(message);
                    const response = await sendMessageToAPI(message, messageHistory);

                    // Hide typing indicator
                    hideTypingIndicator();

                    // Add bot response to chat
                    addBotMessage(response);
                } catch (error) {
                    console.error('Error sending message:', error);
                    hideTypingIndicator();
                    addBotMessage('Sorry, I encountered an error. Please try again later.');
                }
            }

            function processStructuredResponse(formattedResponse) {
                // Handle structured response format from API
                // This allows your API to return rich content with specific formatting
                if (typeof formattedResponse === 'string') {
                    return formattedResponse;
                }

                let responseHTML = '';

                if (Array.isArray(formattedResponse)) {
                    // Process array of content blocks
                    formattedResponse.forEach(block => {
                        if (block.type === 'text') {
                            responseHTML += block.content;
                        } else if (block.type === 'link') {
                            responseHTML += `<a href="${block.url}" target="_blank" class="nexaura-link">${block.text || block.url}</a>`;
                        } else if (block.type === 'email') {
                            responseHTML += `<a href="mailto:${block.email}" class="nexaura-email">${block.email}</a>`;
                        } else if (block.type === 'phone') {
                            responseHTML += `<a href="tel:${block.number}" class="nexaura-phone">${block.display || block.number}</a>`;
                        } else if (block.type === 'callout') {
                            responseHTML += `<div class="nexaura-callout">${block.content}</div>`;
                        } else if (block.type === 'list') {
                            responseHTML += '<ul class="nexaura-list">';
                            block.items.forEach(item => {
                                responseHTML += `<li class="nexaura-list-item">${item}</li>`;
                            });
                            responseHTML += '</ul>';
                        } else if (block.type === 'reference') {
                            responseHTML += `<span class="nexaura-reference">${block.content}</span>`;
                        }
                    });
                } else if (typeof formattedResponse === 'object') {
                    // Handle single content block
                    responseHTML = formattedResponse.content || '';
                }

                return responseHTML || 'No response content available.';
            }


            // Add welcome message
            setTimeout(() => {
                addBotMessage(welcomeMessage);
            }, 500);
        };

        // Add styles and initialize chatbot
        addChatbotStyles();
        initChatbot();
        initialized.current = true;
    }, [apiEndpoint, apiHeaders, botName, welcomeMessage, primaryColor]);

    return <div ref={chatbotRef} id="nexaura-chatbot"></div>;
};

export default NexauraChatbot;