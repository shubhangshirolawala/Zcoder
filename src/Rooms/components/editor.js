import React, { useRef } from 'react'
import { useEffect } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/mdn-like.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';


const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  useEffect(() => {
      async function init() {
          editorRef.current = Codemirror.fromTextArea(
              document.getElementById('realtimeEditor'),
              {
                  mode: { name: 'javascript', json: true },
                  theme: 'mdn-like',
                  autoCloseTags: true,
                  autoCloseBrackets: true,
                  lineNumbers: true,
              }
          );

          
          editorRef.current.on('change', (instance, changes) => {
              const { origin } = changes;
              const code = instance.getValue();
              onCodeChange(code);
              if (origin !== 'setValue') {
                  socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                      roomId,
                      code,
                  });
              }
          });
      }
      init();
  }, []);

  useEffect(() => {
      if (socketRef.current) {
          socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
              if (code !== null) {
                  editorRef.current.setValue(code);
              }
          });
      }

      return () => {
        if(socketRef.current){
          socketRef.current.off(ACTIONS.CODE_CHANGE);
        }
      };
  }, [socketRef.current]);

    // Output state
    const [output, setOutput] = React.useState('');

    // Dummy compile handler (replace with real backend call)
    // const handleCompile = () => {
        
    //     setOutput('// Output will appear here.\nYou pressed Compile!');
    //     // TODO: Call backend to actually compile and run code
    // };
    const  compileCode = async () => {
            // console.log(codeRef.current);
            const code = editorRef.current.getValue();
            const submit = await fetch("https://ce.judge0.com/submissions?base64_encoded=false&wait=false", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_code: code,
        language_id: 71, // Python 3
        stdin: "input text here"
      })
    });
    const { token } = await submit.json();
    console.log(token);
    // Poll until finished  
    const res = await fetch(`https://ce.judge0.com/submissions/${token}?base64_encoded=false`);
    const data = await res.json();
    console.log(data);
    const output=data.stdout || data.stderr;
    setOutput(output);
    console.log(output);
        };

return (
  <div style={{ width: "100%", height: "70%" }}>
    <textarea id="realtimeEditor"></textarea>

    <div
      style={{
        height: "60%",          // compiler section takes 30% height of page
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        marginTop: "10px",
      }}
    >
      {/* Compile button at top-right */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          style={{
            background: "green",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "6px 18px",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "8px",
          }}
          onClick={compileCode}
        >
          Compile
        </button>
      </div>

      {/* Output section */}
      <div
        style={{
          flex: 1,
          background: "#181818",
          color: "#fff",
          borderRadius: 8,
          padding: 12,
          fontFamily: "monospace",
          fontSize: 14,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflowY: "auto",   // makes output scrollable
        }}
      >
        {output || "Output will appear here."}
      </div>
    </div>
  </div>
);

}

export default Editor
