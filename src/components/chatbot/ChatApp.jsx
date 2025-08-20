import React, { useState } from 'react';
import './ChatApp.css';
import axios from 'axios';

function ChatMessage({ content }) {
  // Simple code block/inline code renderer
  if (!content) return null;
  // Replace triple backtick code blocks
  const codeBlockRegex = /```([a-zA-Z0-9]*)\n([\s\S]*?)```/g;
  let parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{content.slice(lastIndex, match.index)}</span>);
    }
    parts.push(
      <pre key={key++} style={{ background: '#222', color: '#fff', padding: 10, borderRadius: 6, overflowX: 'auto', margin: '8px 0' }}>
        <code>{match[2]}</code>
      </pre>
    );
    lastIndex = codeBlockRegex.lastIndex;
  }
  if (lastIndex < content.length) {
    parts.push(<span key={key++}>{content.slice(lastIndex)}</span>);
  }
  return <>{parts}</>;
}

const ChatApp = () => {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Welcome to Zcoder AI Chat!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      // Exclude system message for backend context
      const history = newMessages.filter(msg => msg.role !== 'system');
      const res = await axios.post('http://localhost:4000/api/v1/chat', { history });
      setMessages((msgs) => [
        ...msgs,
        { role: 'assistant', content: res.data.response }
      ]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { role: 'assistant', content: 'Sorry, something went wrong.' }
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="zcoder-chat-container">
      <div className="zcoder-chat-header">Zcoder AI ChatBot</div>
      <div className="zcoder-chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`zcoder-chat-msg zcoder-chat-msg-${msg.role}` + (msg.role === 'system' ? ' zcoder-chat-msg-system' : '')}
          >
            {msg.role === 'assistant' ? <ChatMessage content={msg.content} /> : msg.content}
          </div>
        ))}
        {loading && <div className="zcoder-chat-msg zcoder-chat-msg-assistant">Thinking...</div>}
      </div>
      <form className="zcoder-chat-form" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>Send</button>
      </form>
    </div>
  );
  }

// // Helper to render markdown/code blocks in assistant messages
// function ChatMessage({ content }) {
//   // Simple code block/inline code renderer
//   if (!content) return null;
//   // Replace triple backtick code blocks
//   const codeBlockRegex = /```([a-zA-Z0-9]*)\n([\s\S]*?)```/g;
//   let parts = [];
//   let lastIndex = 0;
//   let match;
//   let key = 0;
//   while ((match = codeBlockRegex.exec(content)) !== null) {
//     if (match.index > lastIndex) {
//       parts.push(<span key={key++}>{content.slice(lastIndex, match.index)}</span>);
//     }
//     parts.push(
//       <pre key={key++} style={{ background: '#222', color: '#fff', padding: 10, borderRadius: 6, overflowX: 'auto', margin: '8px 0' }}>
//         <code>{match[2]}</code>
//       </pre>
//     );
//     lastIndex = codeBlockRegex.lastIndex;
//   }
//   if (lastIndex < content.length) {
//     parts.push(<span key={key++}>{content.slice(lastIndex)}</span>);
//   }
//   return <>{parts}</>;
// }

//       <form className="zcoder-chat-form" onSubmit={sendMessage}>
//         <input
//           type="text"
//           value={input}
//           onChange={e => setInput(e.target.value)}
//           placeholder="Type your message..."
//           disabled={loading}
//         />
//         <button type="submit" disabled={loading || !input.trim()}>Send</button>
//       </form>
//     </div>
//   );
// }

 export default ChatApp;
