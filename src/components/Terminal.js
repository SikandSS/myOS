import React, { useState, useRef, useEffect } from 'react';
import './Terminal.css';

const Terminal = ({ onClose, onMinimize, onMaximize }) => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState([
    'Microsoft Windows 95 [Version 4.00.950]',
    '(C) Copyright Microsoft Corp 1981-1995.',
    'Inspired All Rights Reserved by Microsoft Corp.',
    '',
    'C:\\>'
  ]);
  const [currentPath, setCurrentPath] = useState('C:\\');
  const [snakeGameActive, setSnakeGameActive] = useState(false);
  const [snakeGameState, setSnakeGameState] = useState(null);
  const inputRef = useRef(null);
  const gameIntervalRef = useRef(null);

  useEffect(() => {
    if (inputRef.current && !snakeGameActive) {
      inputRef.current.focus();
    }
  }, [snakeGameActive]);

  // Snake game logic
  const GRID_SIZE = 20;
  const CELL_SIZE = 15;

  const initSnakeGame = () => {
    const initialSnake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    const initialFood = { x: 15, y: 15 };
    
    setSnakeGameState({
      snake: initialSnake,
      food: initialFood,
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      score: 0,
      gameOver: false,
      paused: false
    });
    setSnakeGameActive(true);
  };

  const generateFood = (snake) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  };

  const updateSnakeGame = () => {
    if (!snakeGameState || snakeGameState.gameOver || snakeGameState.paused) return;

    setSnakeGameState(prev => {
      if (!prev) return null;

      const newDirection = prev.nextDirection;
      const head = { ...prev.snake[0] };
      head.x += newDirection.x;
      head.y += newDirection.y;

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        return { ...prev, gameOver: true };
      }

      // Check self collision
      if (prev.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return { ...prev, gameOver: true };
      }

      const newSnake = [head, ...prev.snake];
      let newFood = prev.food;
      let newScore = prev.score;

      // Check food collision
      if (head.x === prev.food.x && head.y === prev.food.y) {
        newFood = generateFood(newSnake);
        newScore += 10;
      } else {
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        direction: newDirection,
        score: newScore
      };
    });
  };

  useEffect(() => {
    if (snakeGameActive && snakeGameState && !snakeGameState.gameOver && !snakeGameState.paused) {
      gameIntervalRef.current = setInterval(updateSnakeGame, 150);
    } else {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
        gameIntervalRef.current = null;
      }
    }
    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
        gameIntervalRef.current = null;
      }
    };
  }, [snakeGameActive, snakeGameState?.gameOver, snakeGameState?.paused]);

  const handleSnakeKeyPress = (e) => {
    if (!snakeGameActive || !snakeGameState) return;

    const key = e.key;

    // Allow quitting at any time (including when game is over)
    if (key === 'q' || key === 'Q') {
      e.preventDefault();
      setSnakeGameActive(false);
      setSnakeGameState(null);
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
      setOutput(prev => [...prev, 'C:\\>']);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    // Don't process other keys if game is over
    if (snakeGameState.gameOver) return;

    let newDirection = { ...snakeGameState.nextDirection };

    switch (key) {
      case 'ArrowUp':
        if (snakeGameState.direction.y === 0) {
          newDirection = { x: 0, y: -1 };
        }
        break;
      case 'ArrowDown':
        if (snakeGameState.direction.y === 0) {
          newDirection = { x: 0, y: 1 };
        }
        break;
      case 'ArrowLeft':
        if (snakeGameState.direction.x === 0) {
          newDirection = { x: -1, y: 0 };
        }
        break;
      case 'ArrowRight':
        if (snakeGameState.direction.x === 0) {
          newDirection = { x: 1, y: 0 };
        }
        break;
      case ' ':
        e.preventDefault();
        setSnakeGameState(prev => prev ? { ...prev, paused: !prev.paused } : null);
        return;
      default:
        return;
    }

    setSnakeGameState(prev => prev ? { ...prev, nextDirection: newDirection } : null);
  };

  useEffect(() => {
    if (snakeGameActive) {
      window.addEventListener('keydown', handleSnakeKeyPress);
      return () => {
        window.removeEventListener('keydown', handleSnakeKeyPress);
      };
    }
  }, [snakeGameActive, snakeGameState]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const newOutput = [...output, `C:\\> ${command}`];
      
      // Process commands
      switch (command.toLowerCase().trim()) {
        case 'help':
          newOutput.push('Available commands:');
          newOutput.push('  help     - Display this help message');
          newOutput.push('  dir      - List directory contents');
          newOutput.push('  cls      - Clear screen');
          newOutput.push('  ver      - Display version information');
          newOutput.push('  date     - Display current date');
          newOutput.push('  time     - Display current time');
          newOutput.push('  echo     - Display text');
          newOutput.push('  about    - Display Information');
          newOutput.push('  snake    - Play Snake game');
          newOutput.push('  exit     - Close terminal');
          break;
        case 'snake':
          initSnakeGame();
          newOutput.push('Snake Game Started!');
          newOutput.push('Use Arrow Keys to move. Press SPACE to pause. Press Q to quit.');
          newOutput.push('');
          break;
        case 'dir':
          newOutput.push(' Volume in drive C is MS-DOS_6');
          newOutput.push(' Volume Serial Number is 1E49-15E2');
          newOutput.push(' Directory of C:\\');
          newOutput.push('');
          newOutput.push('WINDOWS          <DIR>        12-07-95  10:00a');
          newOutput.push('PROGRA~1         <DIR>        12-07-95  10:00a');
          newOutput.push('AUTOEXEC BAT         2,847  12-07-95  10:00a');
          newOutput.push('CONFIG  SYS         1,234  12-07-95  10:00a');
          newOutput.push('COMMAND COM        94,214  12-07-95  10:00a');
          newOutput.push('        5 file(s)      98,295 bytes');
          newOutput.push('        2 dir(s)  12,345,678 bytes free');
          break;
        case 'about':
          // ASCII Art Option 1: Double-line box with Unicode characters
          // newOutput.push('╔════════════════════════════════════════════════╗');
          // newOutput.push('║                                                ║');
          // newOutput.push('║   _____ _ _  __               _                ║');
          // newOutput.push('║  / ____(_) |/ /              | |               ║');
          // newOutput.push('║ | (___  _| \' / ___ _ __   ___| |               ║');
          // newOutput.push('║  \\___ \\| |  < / _ \\ \'_ \\ / _ \\ |               ║');
          // newOutput.push('║  ____) | | . \\  __/ | | |  __/ |               ║');
          // newOutput.push('║ |_____/|_|_|\\_\\___|_| |_|\\___|_|               ║');
          // newOutput.push('║                                                ║');
          // newOutput.push('╚════════════════════════════════════════════════╝');
          
          // ASCII Art Option 2: Single-line box with additional text (commented out)
           newOutput.push('╬════════════════════════════════════════════════╬');
           newOutput.push('║                                               ║');
           newOutput.push('║   _____ _ _  __               _               ║');
           newOutput.push('║  / ____(_) |/ /              | |              ║');
           newOutput.push('║ | (___  _| \' / ___ _ __   ___| |              ║');
           newOutput.push('║  \\___ \\| |  < / _ \\ \'_ \\ / _ \\ |              ║');
           newOutput.push('║  ____) | | . \\  __/ | | |  __/ |              ║');
           newOutput.push('║ |_____/|_|_|\\_\\___|_| |_|\\___|_|    v1.0.0    ║');
           newOutput.push('║                                               ║');
           newOutput.push('║                                  ____   _____ ║');
           newOutput.push('║                                 / __ \\ / ___/ ║');
           newOutput.push('║                                | |  | | \\__ \\ ║');
           newOutput.push('║                                | |  | | ____/ ║');
           newOutput.push('║                                 \\____/ /____/ ║');
           newOutput.push('╬════════════════════════════════════════════════╬');
           newOutput.push('║');
           newOutput.push('║ABOUT SIKAND SANDHU');
           newOutput.push('║====================================================');
           newOutput.push('║  Sikand Sandhu – Software Engineer at Map My India.');
           newOutput.push('║====================================================');
          //  newOutput.push('║');
           newOutput.push('╠=►3 years of experience contributing to impactful mapping and traffic projects.');
          //  newOutput.push('║traffic projects.');
          //  newOutput.push('║');
           newOutput.push('╠=►Worked on Traffic Manager, used by state governments. This project was completely done by a team of two.');
           newOutput.push('║  <a href="https://indianexpress.com/article/technology/tech-news-technology/mapmyindia-g20-regulated-zones-traffic-map-8930388/" target="_blank" style="color: #00ff00; text-decoration: underline;">Indian Express Article →</a>');
           newOutput.push('║  <a href="https://timesofindia.indiatimes.com/technology/tech-news/bengaluru-traffic-police-signs-mou-with-this-desi-google-maps-rival-for-real-time-traffic-updates/articleshow/109497864.cms" target="_blank" style="color: #00ff00; text-decoration: underline;">Times of India Article →</a>');
          //  newOutput.push('https://indianexpress.com/article/technology/tech-news-technology/mapmyindia-g20-regulated-zones-traffic-map-8930388/');
          //  newOutput.push('║');
          //  newOutput.push('Traffic Manager featured during G20 summit: Indian Express');
          //  newOutput.push('║');
           newOutput.push('╠=►Most recently Worked on Real-Time traffic Signal updates Team.:');
          //  newOutput.push('Times of India');
          //  newOutput.push('║');
           newOutput.push('╠=►Responsible for monthly compilation of all Map My India map data andctively work on all core apis of the app.');
           newOutput.push('║  <a href="https://www.mappls.com/" target="_blank" style="color: #00ff00; text-decoration: underline;">Map My India Website →</a>');
          //  newOutput.push('data (places, people, points of interest).');
          //  newOutput.push('║');
           newOutput.push('╠=►Worked on Many Other Projects like: Maruti Suzuki Carpooling app, Bajaj Finance location based Loan app, Hyundai motorcorp etc.');
          //  newOutput.push('for traffic signals: Autocar Pro');
          break;
        case 'ver':
          newOutput.push('Microsoft Windows 95 [Version 4.00.950]');
          break;
        case 'date':
          newOutput.push(new Date().toLocaleDateString());
          break;
        case 'time':
          newOutput.push(new Date().toLocaleTimeString());
          break;
        case 'cls':
          setOutput(['C:\\>']);
          setCommand('');
          return;
        case 'exit':
          onClose();
          return;
        default:
          if (command.toLowerCase().startsWith('echo ')) {
            newOutput.push(command.substring(5));
          } else {
            newOutput.push(`'${command}' is not recognized as an internal or external command,`);
            newOutput.push('operable program or batch file. Enter help for a list of commands.');
          }
      }
      
      newOutput.push('');
      newOutput.push('C:\\>');
      setOutput(newOutput);
      setCommand('');
    }
  };

  const renderSnakeGame = () => {
    if (!snakeGameState) return null;

    const grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnakeHead = snakeGameState.snake[0].x === x && snakeGameState.snake[0].y === y;
        const isSnakeBody = snakeGameState.snake.slice(1).some(segment => segment.x === x && segment.y === y);
        const isFood = snakeGameState.food.x === x && snakeGameState.food.y === y;

        let cell = '·';
        if (isSnakeHead) {
          cell = '●';
        } else if (isSnakeBody) {
          cell = '○';
        } else if (isFood) {
          cell = '★';
        }

        grid.push({ x, y, cell });
      }
    }

    return (
      <div className="snake-game-container">
        <div className="snake-game-header">
          <div className="snake-game-score">Score: {snakeGameState.score}</div>
          {snakeGameState.paused && <div className="snake-game-paused">PAUSED - Press SPACE to resume</div>}
          {snakeGameState.gameOver && (
            <div className="snake-game-over">
              <div>GAME OVER!</div>
              <div>Final Score: {snakeGameState.score}</div>
              <div>Press Q to quit</div>
            </div>
          )}
        </div>
        <div className="snake-game-grid">
          {Array.from({ length: GRID_SIZE }).map((_, y) => (
            <div key={y} className="snake-game-row">
              {Array.from({ length: GRID_SIZE }).map((_, x) => {
                const cell = grid.find(c => c.x === x && c.y === y);
                const isSnakeHead = snakeGameState.snake[0].x === x && snakeGameState.snake[0].y === y;
                const isSnakeBody = snakeGameState.snake.slice(1).some(segment => segment.x === x && segment.y === y);
                const isFood = snakeGameState.food.x === x && snakeGameState.food.y === y;
                
                return (
                  <span
                    key={x}
                    className={`snake-game-cell ${
                      isSnakeHead ? 'snake-head' : 
                      isSnakeBody ? 'snake-body' : 
                      isFood ? 'snake-food' : ''
                    }`}
                  >
                    {isSnakeHead ? '█' : isSnakeBody ? '█' : isFood ? '█' : ''}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
        {!snakeGameState.gameOver && (
          <div className="snake-game-controls">
            Use Arrow Keys to move | SPACE to pause | Q to quit
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="terminal-window">
      <div className="terminal-titlebar">
        <div className="terminal-title">Terminal - Command Prompt</div>
        <div className="terminal-controls">
          <button className="terminal-minimize" onClick={onMinimize}>_</button>
          <button className="terminal-maximize" onClick={onMaximize}>□</button>
          <button className="terminal-close" onClick={onClose}>×</button>
        </div>
      </div>
      <div className="terminal-content">
        {!snakeGameActive ? (
          <>
            <div className="terminal-output">
              {output.map((line, index) => (
                <div key={index} className="terminal-line" dangerouslySetInnerHTML={{ __html: line }} />
              ))}
            </div>
            <div className="terminal-input-line">
              <span className="terminal-prompt">C:\&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyPress={handleCommand}
                className="terminal-input"
                autoFocus
              />
            </div>
          </>
        ) : (
          renderSnakeGame()
        )}
      </div>
      <div className="resize-handle"></div>
    </div>
  );
};

export default Terminal;
