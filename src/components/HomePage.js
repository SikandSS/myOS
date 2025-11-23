import React, { useState } from 'react';
import Terminal from './Terminal';
import RetroBrowser from './RetroBrowser';
import Notepad from './Notepad';
import './HomePage.css';

const HomePage = () => {
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [openWindows, setOpenWindows] = useState([]);
  const [resizing, setResizing] = useState(false);
  const [resizeData, setResizeData] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [dragData, setDragData] = useState(null);

  const desktopIcons = [
    { id: 1, name: 'Internet Explorer', icon: '🌍', x: 50, y: 50 },
    { id: 2, name: 'Notepad', icon: '📝', x: 50, y: 120 },
    { id: 3, name: 'Terminal', icon: '🖥️', x: 50, y: 190 }
  ];

  const startMenuItems = [
    { name: 'Programs', icon: '📂' },
    { name: 'Documents', icon: '📄' },
    { name: 'Settings', icon: '⚙️' },
    { name: 'Find', icon: '🔍' },
    { name: 'Help', icon: '❓' },
    { name: 'Run...', icon: '▶️' },
    { name: 'Shut Down...', icon: '⏻' }
  ];

  const openWindow = (iconName) => {
    let windowType = 'default';
    let defaultWidth = 400;
    let defaultHeight = 300;

    if (iconName === 'Terminal') {
      windowType = 'terminal';
      defaultWidth = 600;
      defaultHeight = 400;
    } else if (iconName === 'Internet Explorer') {
      windowType = 'browser';
      defaultWidth = 700;
      defaultHeight = 500;
    } else if (iconName === 'Notepad') {
      windowType = 'notepad';
      defaultWidth = 500;
      defaultHeight = 400;
    }

    const newWindow = {
      id: Date.now(),
      title: iconName,
      x: 100 + (openWindows.length * 30),
      y: 100 + (openWindows.length * 30),
      width: defaultWidth,
      height: defaultHeight,
      type: windowType
    };
    setOpenWindows([...openWindows, newWindow]);
  };

  const closeWindow = (windowId) => {
    setOpenWindows(openWindows.filter(w => w.id !== windowId));
  };

  const handleMouseDown = (e, windowId) => {
    if (e.target.classList.contains('resize-handle')) {
      e.preventDefault();
      setResizing(true);
      setResizeData({
        windowId,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: e.target.closest('.window').offsetWidth,
        startHeight: e.target.closest('.window').offsetHeight
      });
    } else if (
      e.target.classList.contains('window-titlebar') || e.target.closest('.window-titlebar') ||
      e.target.classList.contains('terminal-titlebar') || e.target.closest('.terminal-titlebar') ||
      e.target.classList.contains('retro-browser-titlebar') || e.target.closest('.retro-browser-titlebar') ||
      e.target.classList.contains('notepad-titlebar') || e.target.closest('.notepad-titlebar')
    ) {
      e.preventDefault();
      setDragging(true);
      setDragData({
        windowId,
        startX: e.clientX,
        startY: e.clientY,
        startWindowX: e.target.closest('.window').offsetLeft,
        startWindowY: e.target.closest('.window').offsetTop
      });
    }
  };

  const handleMouseMove = (e) => {
    if (resizing && resizeData) {
      const deltaX = e.clientX - resizeData.startX;
      const deltaY = e.clientY - resizeData.startY;
      const newWidth = Math.max(200, resizeData.startWidth + deltaX);
      const newHeight = Math.max(150, resizeData.startHeight + deltaY);

      setOpenWindows(openWindows.map(window => 
        window.id === resizeData.windowId 
          ? { ...window, width: newWidth, height: newHeight }
          : window
      ));
    } else if (dragging && dragData) {
      const deltaX = e.clientX - dragData.startX;
      const deltaY = e.clientY - dragData.startY;
      const newX = Math.max(0, Math.min(window.innerWidth - 200, dragData.startWindowX + deltaX));
      const newY = Math.max(0, Math.min(window.innerHeight - 100, dragData.startWindowY + deltaY));

      setOpenWindows(openWindows.map(window => 
        window.id === dragData.windowId 
          ? { ...window, x: newX, y: newY }
          : window
      ));
    }
  };

  const handleMouseUp = () => {
    setResizing(false);
    setResizeData(null);
    setDragging(false);
    setDragData(null);
  };

  // Add event listeners for mouse events
  React.useEffect(() => {
    if (resizing || dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing, resizeData, dragging, dragData, openWindows]);

  return (
    <div className="windows95-desktop">
      {/* Desktop Background */}
      <div className="desktop-background">
        {/* Desktop Icons */}
        {desktopIcons.map(icon => (
          <div
            key={icon.id}
            className="desktop-icon"
            style={{ left: icon.x, top: icon.y }}
            onDoubleClick={() => openWindow(icon.name)}
          >
            <div className="icon-image">{icon.icon}</div>
            <div className="icon-label">{icon.name}</div>
          </div>
        ))}

        {/* Open Windows */}
        {openWindows.map(window => (
          <div
            key={window.id}
            className="window"
            style={{
              left: window.x,
              top: window.y,
              width: window.width,
              height: window.height
            }}
            onMouseDown={(e) => handleMouseDown(e, window.id)}
          >
            {window.type === 'terminal' ? (
              <Terminal
                onClose={() => closeWindow(window.id)}
                onMinimize={() => {/* TODO: Implement minimize */}}
                onMaximize={() => {/* TODO: Implement maximize */}}
              />
            ) : window.type === 'browser' ? (
              <RetroBrowser
                title={window.title}
                onClose={() => closeWindow(window.id)}
                onMinimize={() => {/* TODO: Implement minimize */}}
                onMaximize={() => {/* TODO: Implement maximize */}}
              />
            ) : window.type === 'notepad' ? (
              <Notepad
                onClose={() => closeWindow(window.id)}
                onMinimize={() => {/* TODO: Implement minimize */}}
                onMaximize={() => {/* TODO: Implement maximize */}}
              />
            ) : (
              <>
                <div className="window-titlebar">
                  <div className="window-title">{window.title}</div>
                  <div className="window-controls">
                    <button className="minimize-btn">_</button>
                    <button className="maximize-btn">□</button>
                    <button className="close-btn" onClick={() => closeWindow(window.id)}>×</button>
                  </div>
                </div>
                <div className="window-content">
                  <p>Welcome to {window.title}!</p>
                  <p>This is a Windows 95 style application.</p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Taskbar */}
      <div className="taskbar">
        <button 
          className="start-button"
          onClick={() => setShowStartMenu(!showStartMenu)}
        >
          <span className="start-icon">🪟</span>
          Start
        </button>
        
        <div className="taskbar-items">
          {openWindows.map(window => (
            <button key={window.id} className="taskbar-item">
              {window.title}
            </button>
          ))}
        </div>

        <div className="system-tray">
          <div className="clock">12:34 PM</div>
        </div>
      </div>

      {/* Start Menu */}
      {showStartMenu && (
        <div className="start-menu">
          <div className="start-menu-header">
            <span className="start-menu-title">Windows 95</span>
          </div>
          {startMenuItems.map((item, index) => (
            <div key={index} className="start-menu-item">
              <span className="start-menu-icon">{item.icon}</span>
              <span className="start-menu-text">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
