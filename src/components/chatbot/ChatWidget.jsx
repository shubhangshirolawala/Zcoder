import React, { useState } from 'react';
import ChatApp from './ChatApp';
import './ChatApp.css';
import './ChatWidget.css';

const ChatWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="zcoder-chatbot-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chatbot"
      >
        <span role="img" aria-label="chat">💬</span>
      </button>
      {open && (
        <div className="zcoder-chatbot-popup">
          <button className="zcoder-chatbot-close" onClick={() => setOpen(false)}>&times;</button>
          <ChatApp />
        </div>
      )}
    </>
  );
};

export default ChatWidget;
