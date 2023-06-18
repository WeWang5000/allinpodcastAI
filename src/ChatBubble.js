import React from 'react';
import './ChatBubble.css';

const ChatBubble = ({ text, sender }) => {
  const bubbleClass = sender === 'user' ? 'user-bubble' : 'bot-bubble';
  const showProfilePicture = sender !== 'user';
  const alignClass = sender === 'user' ? 'align-right' : 'align-left';

  return (
    <div className={`chat-bubble-container ${alignClass}`}>
      {showProfilePicture && <div className="profile-picture" />}
      <div className={`chat-bubble ${bubbleClass}`}>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default ChatBubble;
