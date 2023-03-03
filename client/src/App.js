import icon from './icon.png';
import pig from './pig.png';
import './App.css';
import './normal.css';
import { useState } from 'react';
import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function App() {
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    console.log('submit: ' + input);
    setChatLog((chatLog) => [...chatLog, { user: 'me', message: input }]);
    setInput('');
    const response = await fetch('http://localhost:3001/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: input,
      }),
    });
    const data = await response.json();

    setChatLog((chatLog) => [...chatLog, { user: 'gpt', message: data.data }]);
  }

  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="sidemenu-button">
          <span>+</span>New Chat
        </div>
      </aside>
      <section className="chatbox">
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className="query-input">
          <form id="ask" onSubmit={handleSubmit}>
            {/* <textarea
              form="ask"
              className="query-input-textarea"
              rows="10"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            ></textarea>
            <input type="submit"></input> */}
            <input
              className="query-input-textarea"
              rows="10"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            ></input>
          </form>
        </div>
      </section>
    </div>
  );
}

const ChatMessage = ({ message }) => {
  const str = message.message;
  // console.log('str: ' + str);

  // Find all occurrences of code blocks and split the response string
  const matches = str.match(/```([\s\S]*?)```/g);
  const parts = str.split(/```([\s\S]*?)```/g);

  return (
    <div className={`chat-message ${message.user === 'gpt' && 'chatgpt'}`}>
      <div className="chat-message-center">
        <img
          src={message.user === 'gpt' ? icon : pig}
          alt="icon"
          className={`avatar ${message.user === 'gpt' && 'chatgpt'}`}
        />
        <div className="message">
          {parts.map((part, index) => {
            if (matches && matches.includes(`\`\`\`${part}\`\`\``)) {
              // Render code block using SyntaxHighlighter
              return (
                <SyntaxHighlighter
                  language="javascript"
                  style={dracula}
                  key={index}
                >
                  {part.trim()}
                </SyntaxHighlighter>
              );
            } else {
              // Render plain text
              return <span key={index}>{part}</span>;
            }
          })}
        </div>
      </div>
    </div>
  );
};
export default App;
