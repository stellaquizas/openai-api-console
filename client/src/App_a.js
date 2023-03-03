import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const MyComponent = () => {
  const codeSnippet = `function sayHello(name) {
    console.log('Hello, ' + name + '!');
  }

  sayHello('World');`;

  return (
    <div>
      <SyntaxHighlighter language="javascript" style={dracula}>
        {codeSnippet}
      </SyntaxHighlighter>
    </div>
  );
};

export default MyComponent;
