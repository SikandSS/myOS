import React, { useState, useRef, useEffect } from 'react';
import './Notepad.css';

const Notepad = ({ onClose, onMinimize, onMaximize }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="notepad-window">
      <div className="notepad-titlebar">
        <div className="notepad-title">Notepad</div>
        <div className="notepad-controls">
          <button className="notepad-minimize" onClick={onMinimize}>_</button>
          <button className="notepad-maximize" onClick={onMaximize}>□</button>
          <button className="notepad-close" onClick={onClose}>×</button>
        </div>
      </div>
      <div className="notepad-menu">
        <div className="notepad-menu-item">File</div>
        <div className="notepad-menu-item">Edit</div>
        <div className="notepad-menu-item">Search</div>
        <div className="notepad-menu-item">Help</div>
      </div>
      <div className="notepad-content">
        <textarea
          ref={textareaRef}
          className="notepad-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your text here..."
        />
      </div>
      <div className="resize-handle"></div>
    </div>
  );
};

export default Notepad;

