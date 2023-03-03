import icon from './icon.png';
import pig from './pig.png';
import './App.css';
import './normal.css';
import { useState, useRef, useEffect } from 'react';
import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function App() {
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([]);

  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // A child node has been added or removed
          container.scrollTop = container.scrollHeight - container.clientHeight;
        }
      });
    });
    observer.observe(container, { childList: true });

    // Cleanup function to disconnect the observer when the component unmounts
    return () => observer.disconnect();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    // console.log('submit: ' + input);
    setChatLog((chatLog) => [
      ...chatLog,
      { user: 'me', message: input.trim() },
    ]);
    setInput('');
    resetTextAreaChange(e);
    const response = await fetch('http://localhost:3001/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: input.trim(),
      }),
    });
    const data = await response.json();

    setChatLog((chatLog) => [...chatLog, { user: 'gpt', message: data.data }]);
  }

  // const scrollTop = () => {
  //   let chatLog = document.querySelector('.chat-log');
  //   //scroll to bottom
  //   chatLog.scrollTop = chatLog.scrollHeight + chatLog.clientHeight;
  //   // chatLog.scrollIntoView(false);
  // };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    } else {
      return;
    }
  };

  const resetTextAreaChange = (e) => {
    let textarea = document.querySelector('textarea');
    // console.log('textarea' + textarea.value);
    textarea.style.height = '34px';
  };

  const handleTextAreaChange = (e) => {
    let textarea = document.querySelector('textarea');
    // console.log('textarea' + textarea.value);
    textarea.style.height = calcHeight(textarea.value) + 'px';
  };

  // // Dealing with Textarea Height
  function calcHeight(value) {
    let numberOfLineBreaks = (value.match(/\n/g) || []).length;
    // min-height + lines x line-height + padding + border
    let newHeight = 20 + numberOfLineBreaks * 20 + 12 + 2;
    return newHeight;
  }

  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="sidemenu-button">
          <span>+</span>New Chat
        </div>
      </aside>
      <section className="chatbox">
        <div className="chat-log" ref={containerRef}>
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className="query-input">
          <form>
            <textarea
              className="query-input-textarea"
              rows="2"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                handleTextAreaChange(e);
              }}
              onKeyDown={handleKeyDown}
            ></textarea>
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
