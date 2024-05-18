import React from 'react'
import { useEffect } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/mdn-like.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';


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
    
  return (
    <textarea id="realtimeEditor"></textarea>
  )
}

export default Editor
