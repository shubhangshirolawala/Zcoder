<<<<<<< HEAD
import React, { useRef } from 'react'
=======
import React from 'react'
>>>>>>> origin/kushal
import { useEffect } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/mdn-like.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
<<<<<<< HEAD
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
          socketRef.current.off(ACTIONS.CODE_CHANGE);
      };
  }, [socketRef.current]);

=======


const Editor = () => {
    useEffect(()=>{
        async function init(){
            Codemirror.fromTextArea(document.getElementById('realtimeEditor'),{
                mode:{name:'javascript', json:true},
                autoCloseBrackets: true,
                theme: 'mdn-like',
                autoCloseTags: true,
                lineNumbers:true,
            })
        }
        init();
    },[]);
    
>>>>>>> origin/kushal
  return (
    <textarea id="realtimeEditor"></textarea>
  )
}

export default Editor
