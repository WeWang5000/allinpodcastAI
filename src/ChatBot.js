import axios from 'axios';
import React, { useState } from 'react';

const ChatBot = () => {
  const [userMessage, setUserMessage] = useState('');
  const [botMessage, setBotMessage] = useState('');

  const handleSendMessage = async () => {
    try {
      // Send user message to the backend and receive bot response
      const response = await axios.post('/api/chat', {
        message: userMessage,
      });

      // Extract the bot response from the backend response
      const botResponse = response.data.message;

      // Set the bot response in the state
      setBotMessage(botResponse);

      // Convert user message and bot response to JSON string
      const jsonString = JSON.stringify({
        userMessage,
        botMessage: botResponse,
      });

      // Send JSON string to the backend
      await axios.post('/api/storeChat', jsonString, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Clear the user input
      setUserMessage('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div className="chat-container">
        {/* Display chat messages */}
        <div className="message">{userMessage}</div>
        <div className="message">{botMessage}</div>
      </div>
      <input
        type="text"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatBot;
