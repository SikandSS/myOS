import React, { useState, useEffect, useRef } from 'react';
import './RetroBrowser.css';
import initialYouTubeData from '../data/youtubeData.json';

const RetroBrowser = ({ title, onClose, onMinimize, onMaximize }) => {
  const FULL_QUERY = 'who is sikand sandhu?';
  const [query, setQuery] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showYouTube, setShowYouTube] = useState(false);
  const [showCV, setShowCV] = useState(false);
  const [youtubeData, setYoutubeData] = useState(initialYouTubeData);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState({});
  const hasIncrementedViews = useRef(false);

  const handleKeystrokeProgression = () => {
    setCharIndex(prevIndex => {
      const nextIndex = Math.min(prevIndex + 1, FULL_QUERY.length);
      const nextQuery = FULL_QUERY.substring(0, nextIndex);
      setQuery(nextQuery);
      return nextIndex;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalQuery = query.trim() ? query : FULL_QUERY;
    setQuery(finalQuery);
    setCharIndex(FULL_QUERY.length);
    
    // Check if query contains youtube
    if (finalQuery.toLowerCase().includes('youtube') || finalQuery.toLowerCase().includes('youtu.be')) {
      setShowYouTube(true);
    } else {
    setShowResults(true);
    }
  };

  const handleBackToSearch = () => {
    setShowResults(false);
    setShowYouTube(false);
    setShowCV(false);
  };

  const handleYouTubeClick = (e) => {
    e.preventDefault();
    setShowYouTube(true);
  };

  const handleCVClick = (e) => {
    e.preventDefault();
    setShowCV(true);
  };

  // Load YouTube data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('youtubeData');
    if (savedData) {
      try {
        setYoutubeData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading YouTube data:', error);
      }
    }
  }, []);

  // Auto-increment views when YouTube video page is opened/plays
  useEffect(() => {
    if (showYouTube && !hasIncrementedViews.current) {
      // Increment views when the video page is shown (video autoplays)
      setYoutubeData(prev => ({
        ...prev,
        video: {
          ...prev.video,
          views: prev.video.views + 1
        }
      }));
      hasIncrementedViews.current = true;
    } else if (!showYouTube) {
      // Reset when leaving YouTube page so views increment again next time
      hasIncrementedViews.current = false;
    }
  }, [showYouTube]);

  // Save YouTube data to localStorage whenever it changes
  useEffect(() => {
    if (showYouTube) {
      localStorage.setItem('youtubeData', JSON.stringify(youtubeData));
    }
  }, [youtubeData, showYouTube]);

  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Increment like count
  const handleIncrementLikes = () => {
    setYoutubeData(prev => ({
      ...prev,
      video: {
        ...prev.video,
        likes: prev.video.likes + 1
      }
    }));
  };

  // Add new comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      author: 'Anonymous User',
      avatar: 'A',
      text: newComment,
      likes: 0,
      replies: [],
      date: 'just now'
    };

    setYoutubeData(prev => ({
      ...prev,
      comments: [comment, ...prev.comments]
    }));

    setNewComment('');
  };

  // Add reply to comment
  const handleAddReply = (commentId, e) => {
    e.preventDefault();
    const replyTextValue = replyText[commentId];
    if (!replyTextValue || !replyTextValue.trim()) return;

    const reply = {
      id: Date.now(),
      author: 'Anonymous User',
      avatar: 'A',
      text: replyTextValue,
      likes: 0,
      date: 'just now'
    };

    setYoutubeData(prev => ({
      ...prev,
      comments: prev.comments.map(comment =>
        comment.id === commentId
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      )
    }));

    setReplyText(prev => ({ ...prev, [commentId]: '' }));
    setReplyingTo(null);
  };

  // Like a comment
  const handleLikeComment = (commentId) => {
    setYoutubeData(prev => ({
      ...prev,
      comments: prev.comments.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    }));
  };

  // Like a reply
  const handleLikeReply = (commentId, replyId) => {
    setYoutubeData(prev => ({
      ...prev,
      comments: prev.comments.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === replyId
                  ? { ...reply, likes: reply.likes + 1 }
                  : reply
              )
            }
          : comment
      )
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (charIndex < FULL_QUERY.length) {
        setQuery(FULL_QUERY);
        setCharIndex(FULL_QUERY.length);
      }
      return;
    }

    if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Space') {
      e.preventDefault();
      handleKeystrokeProgression();
    }
  };

  const handleLucky = () => {
    setQuery(FULL_QUERY);
    setCharIndex(FULL_QUERY.length);
  };

  return (
    <div className="retro-browser-window">
      <div className="retro-browser-titlebar">
        <div className="retro-browser-title">
          <span className="retro-browser-icon">🌍</span>
          {title || 'Internet Explorer'}
        </div>
        <div className="retro-browser-controls">
          <button className="retro-browser-btn" onClick={onMinimize}>_</button>
          <button className="retro-browser-btn" onClick={onMaximize}>□</button>
          <button className="retro-browser-btn retro-browser-close" onClick={onClose}>×</button>
        </div>
      </div>

      <div className="retro-browser-toolbar">
        <div className="retro-browser-nav">
          <button className="retro-toolbar-btn">
            <span className="retro-toolbar-icon">◀</span>
            Back
          </button>
          <button className="retro-toolbar-btn">
            <span className="retro-toolbar-icon">▶</span>
            Forward
          </button>
          <button className="retro-toolbar-btn">
            <span className="retro-toolbar-icon">⟳</span>
            Refresh
          </button>
          <button className="retro-toolbar-btn" onClick={handleBackToSearch}>
            <span className="retro-toolbar-icon">⛶</span>
            Home
          </button>
        </div>
        <div className="retro-browser-address">
          <label className="retro-address-label">Address</label>
          <input
            className="retro-address-input"
            type="text"
            value={showCV ? "https://www.sikandsandhu.com/resume" : showYouTube ? "http://www.youtube.com/watch?v=dQw4w9WgXcQ" : showResults ? `http://www.google.com/search?q=${encodeURIComponent(query)}` : "http://www.sikandsandhu.com"}
            readOnly
          />
        </div>
      </div>

      <div className="retro-browser-content">
        {showCV ? (
          <div className="retro-cv-page">
            <iframe
              src="/SIKAND RESUME.pdf#toolbar=0&navpanes=0&scrollbar=0"
              title="Sikand Sandhu Resume"
              className="retro-cv-pdf"
              type="application/pdf"
            ></iframe>
          </div>
        ) : showYouTube ? (
          <div className="retro-youtube-page">
            <div className="retro-youtube-header">
              <div className="retro-youtube-logo">
                <span className="retro-youtube-logo-text">YouTube</span>
              </div>
              <div className="retro-youtube-nav">
                <a href="#" className="retro-youtube-nav-link">Home</a>
                <a href="#" className="retro-youtube-nav-link">Videos</a>
                <a href="#" className="retro-youtube-nav-link">Channels</a>
                <a href="#" className="retro-youtube-nav-link">Community</a>
              </div>
              <div className="retro-youtube-search-box">
                <input type="text" placeholder="Search..." className="retro-youtube-search-input" />
                <button className="retro-youtube-search-btn">Search</button>
              </div>
            </div>
            
            <div className="retro-youtube-main">
              <div className="retro-youtube-content">
                <div className="retro-youtube-player-container">
                  <div className="retro-youtube-player">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=1"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="YouTube video player"
                    ></iframe>
                  </div>
                  <div className="retro-youtube-video-info">
                    <h2 className="retro-youtube-video-title">{youtubeData.video.title}</h2>
                    <div className="retro-youtube-video-meta">
                      <span className="retro-youtube-views">{formatNumber(youtubeData.video.views)} views</span>
                      <span className="retro-youtube-date">• {youtubeData.video.date}</span>
                    </div>
                    <div className="retro-youtube-actions">
                      <button className="retro-youtube-like-btn" onClick={handleIncrementLikes}>
                        👍 {formatNumber(youtubeData.video.likes)}
                      </button>
                    </div>
                    <div className="retro-youtube-channel">
                      <div className="retro-youtube-channel-avatar">{youtubeData.video.channel.avatar}</div>
                      <div className="retro-youtube-channel-info">
                        <div className="retro-youtube-channel-name">{youtubeData.video.channel.name}</div>
                        <div className="retro-youtube-channel-subs">{youtubeData.video.channel.subscribers}</div>
                      </div>
                      <button className="retro-youtube-subscribe-btn">Subscribe</button>
                    </div>
                  </div>
                </div>

                <div className="retro-youtube-comments">
                  <h3 className="retro-youtube-comments-title">Comments ({youtubeData.comments.length})</h3>
                  
                  {/* Add Comment Form */}
                  <div className="retro-youtube-add-comment">
                    <form onSubmit={handleAddComment}>
                      <textarea
                        className="retro-youtube-comment-input"
                        placeholder="Add a public comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows="3"
                      />
                      <div className="retro-youtube-comment-form-actions">
                        <button type="button" className="retro-youtube-cancel-btn" onClick={() => setNewComment('')}>
                          Cancel
                        </button>
                        <button type="submit" className="retro-youtube-comment-submit-btn">
                          Comment
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Comments List */}
                  {youtubeData.comments.map((comment) => (
                    <div key={comment.id} className="retro-youtube-comment">
                      <div className="retro-youtube-comment-avatar">{comment.avatar}</div>
                      <div className="retro-youtube-comment-content">
                        <div className="retro-youtube-comment-author">{comment.author}</div>
                        <div className="retro-youtube-comment-text">{comment.text}</div>
                        <div className="retro-youtube-comment-actions">
                          <button 
                            className="retro-youtube-comment-action" 
                            onClick={() => handleLikeComment(comment.id)}
                          >
                            👍 Like ({comment.likes})
                          </button>
                          <button 
                            className="retro-youtube-comment-action" 
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          >
                            Reply
                          </button>
                          <span className="retro-youtube-comment-time">{comment.date}</span>
                        </div>
                        
                        {/* Reply Form */}
                        {replyingTo === comment.id && (
                          <div className="retro-youtube-reply-form">
                            <form onSubmit={(e) => handleAddReply(comment.id, e)}>
                              <textarea
                                className="retro-youtube-reply-input"
                                placeholder="Add a reply..."
                                value={replyText[comment.id] || ''}
                                onChange={(e) => setReplyText({ ...replyText, [comment.id]: e.target.value })}
                                rows="2"
                              />
                              <div className="retro-youtube-reply-form-actions">
                                <button 
                                  type="button" 
                                  className="retro-youtube-cancel-btn"
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyText({ ...replyText, [comment.id]: '' });
                                  }}
                                >
                                  Cancel
                                </button>
                                <button type="submit" className="retro-youtube-reply-submit-btn">
                                  Reply
                                </button>
                              </div>
                            </form>
                          </div>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="retro-youtube-replies">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="retro-youtube-reply">
                                <div className="retro-youtube-comment-avatar">{reply.avatar}</div>
                                <div className="retro-youtube-comment-content">
                                  <div className="retro-youtube-comment-author">{reply.author}</div>
                                  <div className="retro-youtube-comment-text">{reply.text}</div>
                                  <div className="retro-youtube-comment-actions">
                                    <button 
                                      className="retro-youtube-comment-action"
                                      onClick={() => handleLikeReply(comment.id, reply.id)}
                                    >
                                      👍 Like ({reply.likes})
                                    </button>
                                    <span className="retro-youtube-comment-time">{reply.date}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="retro-youtube-sidebar">
                <h3 className="retro-youtube-sidebar-title">Related Videos</h3>
                {youtubeData.suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="retro-youtube-suggestion">
                    <div className="retro-youtube-suggestion-thumbnail">
                      <div className="retro-youtube-thumbnail-placeholder">▶</div>
                    </div>
                    <div className="retro-youtube-suggestion-info">
                      <div className="retro-youtube-suggestion-title">{suggestion.title}</div>
                      <div className="retro-youtube-suggestion-channel">{suggestion.channel}</div>
                      <div className="retro-youtube-suggestion-views">{suggestion.views}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : !showResults ? (
          <div className="retro-browser-main">
            <div className="retro-google-logo" aria-label="Google 1998 logo">
              <span className="retro-google-letter retro-google-letter--g">G</span>
              <span className="retro-google-letter retro-google-letter--o">o</span>
              <span className="retro-google-letter retro-google-letter--o retro-google-letter--second">o</span>
              <span className="retro-google-letter retro-google-letter--g">g</span>
              <span className="retro-google-letter retro-google-letter--l">l</span>
              <span className="retro-google-letter retro-google-letter--e">e</span>
              <span className="retro-google-letter retro-google-letter--bang">!</span>
            </div>

            <form className="retro-google-search" onSubmit={handleSubmit}>
              <label htmlFor="retro-search-input" className="retro-google-label">
                Search the web using Google!
              </label>
              <input
                id="retro-search-input"
                className="retro-google-input"
                type="text"
                value={query}
                onChange={() => {}}
                onKeyDown={handleKeyDown}
                placeholder="Type your search query here..."
              />
              <div className="retro-google-buttons">
                <button type="submit" className="retro-google-btn">Google Search</button>
                <button
                  type="button"
                  className="retro-google-btn"
                  onClick={handleLucky}
                >
                  I&apos;m Feeling Lucky
                </button>
              </div>
            </form>

            <div className="retro-google-links">
              <a href="https://www.google.com/intl/en/ads/" target="_blank" rel="noopener noreferrer">
                Advertising Programs
              </a>
              <a href="https://www.google.com/services/" target="_blank" rel="noopener noreferrer">
                Business Solutions
              </a>
              <a href="https://www.google.com/intl/en/about/" target="_blank" rel="noopener noreferrer">
                About Google
              </a>
            </div>
          </div>
        ) : (
          <div className="retro-google-results">
            <div className="retro-results-header">
              <div className="retro-google-logo-small" aria-label="Google 1998 logo">
                <span className="retro-google-letter retro-google-letter--g">G</span>
                <span className="retro-google-letter retro-google-letter--o">o</span>
                <span className="retro-google-letter retro-google-letter--o retro-google-letter--second">o</span>
                <span className="retro-google-letter retro-google-letter--g">g</span>
                <span className="retro-google-letter retro-google-letter--l">l</span>
                <span className="retro-google-letter retro-google-letter--e">e</span>
                <span className="retro-google-letter retro-google-letter--bang">!</span>
              </div>
              <form className="retro-results-search" onSubmit={handleSubmit}>
                <input
                  className="retro-google-input"
                  type="text"
                  value={query}
                  readOnly
                />
                <button type="button" className="retro-google-btn" onClick={handleBackToSearch}>
                  New Search
                </button>
              </form>
            </div>
            <div className="retro-results-stats">
              Results 1-3 of about 3 for <strong>&quot;{query}&quot;</strong>
            </div>
            <div className="retro-results-list">
              <div className="retro-result-item">
                <a href="#" onClick={handleYouTubeClick} className="retro-result-title">
                  YouTube - Watch, Share, Create Videos
                </a>
                <div className="retro-result-url">https://www.youtube.com</div>
                <div className="retro-result-description">
                  Watch and share videos from around the world. Discover new content, subscribe to channels, and connect with creators.
                </div>
              </div>
              <div className="retro-result-item">
                <a href="#" onClick={handleCVClick} className="retro-result-title">
                  Sikand Sandhu - CV & Portfolio
                </a>
                <div className="retro-result-url">https://www.sikandsandhu.com</div>
                <div className="retro-result-description">
                  Software Engineer at Map My India. View my portfolio, experience, and projects. 3+ years of experience in mapping and traffic solutions.
                </div>
              </div>
              <div className="retro-result-item">
                <a href="https://sikand.medium.com/optimizing-map-layers-a39a15f236a9" target="_blank" rel="noopener noreferrer" className="retro-result-title">
                  Optimizing Map Layers - Medium Article
                </a>
                <div className="retro-result-url">https://sikand.medium.com/optimizing-map-layers-a39a15f236a9</div>
                <div className="retro-result-description">
                  Technical article about optimizing map layers for better performance. Learn about best practices for map layer management and optimization techniques.
                </div>
              </div>
            </div>
          </div>
        )}

        {!showYouTube && !showCV && (
        <div className="retro-browser-footer">
          <p>©1998 Google Inc.</p>
          <p>All your retro searches, powered by nostalgia.</p>
        </div>
        )}
      </div>

      <div className="retro-browser-statusbar">
        <div className="retro-status-left">Done</div>
        <div className="retro-status-right">The page is secure</div>
      </div>

      <div className="resize-handle"></div>
    </div>
  );
};

export default RetroBrowser;

