import React, { useState, useRef, useEffect } from 'react';
import './MusicPlayer.css';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({
    title: 'Now Playing',
    artist: 'Unknown Artist'
  });
  const gifRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const animationFrameRef = useRef(null);
  const pausedFrameRef = useRef(null);
  const isPlayingRef = useRef(isPlaying);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    isPlayingRef.current = !isPlaying;
  };

  // Update ref when isPlaying changes
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Capture frame when pausing
  useEffect(() => {
    if (!isPlaying) {
      const canvas = canvasRef.current;
      const img = imgRef.current;
      
      if (canvas && img && img.complete) {
        const ctx = canvas.getContext('2d');
        canvas.width = 48;
        canvas.height = 48;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    }
  }, [isPlaying]);

  const handlePrevious = () => {
    // Previous track logic
    console.log('Previous track');
  };

  const handleNext = () => {
    // Next track logic
    console.log('Next track');
  };

  return (
    <div className="music-player-container">
      <div className="music-player-glass">
        <div className="music-player-header">
          {/* Hidden image for loading the GIF */}
          <img 
            ref={imgRef}
            src={require('../assets/giphy.gif')} 
            alt="Music Player" 
            style={{ display: 'none' }}
            onLoad={() => {
              // When image loads and we're paused, capture frame to canvas
              if (!isPlaying && canvasRef.current && imgRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                canvasRef.current.width = 48;
                canvasRef.current.height = 48;
                ctx.clearRect(0, 0, 48, 48);
                ctx.drawImage(imgRef.current, 0, 0, 48, 48);
              }
            }}
          />
          
          {/* Show animated GIF when playing, frozen canvas when paused */}
          {isPlaying ? (
            <img 
              src={require('../assets/giphy.gif')} 
              alt="Music Player" 
              className="music-player-icon playing"
              key="playing-gif"
            />
          ) : (
            <canvas 
              ref={canvasRef}
              className="music-player-icon paused"
              width="48"
              height="48"
            />
          )}
          {/* <div className="music-player-icon">🎵</div>
          <div className="music-player-title">Music Player</div> */}
        </div>
        
        <div className="music-player-info">
          <div className="music-track-title">{currentTrack.title}</div>
          <div className="music-track-artist">{currentTrack.artist}</div>
        </div>

        <div className="music-player-controls">
          <button 
            className="music-control-btn music-prev-btn"
            onClick={handlePrevious}
            aria-label="Previous"
          >
            ⏮
          </button>
          <button 
            className="music-control-btn music-play-btn"
            onClick={handlePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button 
            className="music-control-btn music-next-btn"
            onClick={handleNext}
            aria-label="Next"
          >
            ⏭
          </button>
        </div>

        {/* <div className="music-player-progress">
          <div className="music-progress-bar">
            <div className="music-progress-fill"></div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default MusicPlayer;

