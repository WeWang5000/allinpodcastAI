import React, { useState } from 'react';
import './App.css';
import ChatBubble from './ChatBubble';
import { getChatGptResponse } from './chatgpt';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import axios from 'axios';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showSignup, setShowSignup] = useState(false);

  const handleSendMessage = async (message) => {
    const userMessage = { text: message, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const botResponse = await getChatGptResponse(message);

    const botMessage = { text: botResponse, sender: 'bot' };
    setMessages((prevMessages) => [...prevMessages, botMessage]);

    // Convert user message and bot response to JSON string
    const jsonString = JSON.stringify({
      userMessage,
      botMessage,
    });

    try {
      // Send JSON string to the backend
      await axios.post('/api/storeChat', jsonString, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Scroll to the bottom of the chat messages container
      const chatContainer = document.querySelector('.chat-messages');
      chatContainer.scrollTop = chatContainer.scrollHeight;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const input = e.target.value;
      if (input.trim() !== '') {
        handleSendMessage(input);
        e.target.value = ''; // Empty the input
      }
    }
  };

  const handleLogin = (username, password) => {
    // Perform login authentication
    // If successful, update the state and log the user in
    setLoggedIn(true);
    setUsername(username);
  };

  const handleSignup = (username, password) => {
    // Perform signup logic
    // After successful signup, navigate to the registration page
    setLoggedIn(false); // Reset the login status
    setShowSignup(false); // Hide the signup form
  };

  const handleLogout = () => {
    // Perform logout logic
    // Update the state to log the user out
    setLoggedIn(false);
    setUsername('');
  };

  const handleSwitchToSignup = () => {
    // Show the signup form
    setShowSignup(true);
  };

  const handleSwitchToLogin = () => {
    // Hide the signup form
    setShowSignup(false);
  };

  return (
    <div>
      {!loggedIn && !showSignup && (
        <Login handleLogin={handleLogin} handleSwitchToSignup={handleSwitchToSignup} />
      )}
      {!loggedIn && showSignup && (
        <Signup handleSignup={handleSignup} handleSwitchToLogin={handleSwitchToLogin} />
      )}
      {loggedIn && (
        <div className="chat-container">
          <div className="chat-header">All In Podcast Crew</div>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <ChatBubble
                key={index}
                text={message.text}
                sender={message.sender}
              />
            ))}
          </div>
          <div className="chat-input">
            <input type="text" placeholder="Type a message..." onKeyPress={handleKeyPress} />
            <button onClick={() => (document.querySelector('input').value = '')}>Send</button>
          </div>
        </div>
      )}
      {loggedIn && <Dashboard username={username} handleLogout={handleLogout} />}
    </div>
  );
};

export default App;
