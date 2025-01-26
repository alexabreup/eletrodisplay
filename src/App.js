import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import './App.css';
import './globals.css';
import { 
  UpdateIcon, 
  LoopIcon,
  HamburgerMenuIcon,
  Cross1Icon,
  MixerHorizontalIcon,
  SunIcon,
  PlayIcon,
  StopIcon
} from '@radix-ui/react-icons';
import Accordion from './components/ui/accordion';
import { ThemeProvider } from './components/theme-provider';
import { ThemeToggle } from './components/theme-toggle';
import { ReactComponent as LogoSvg } from './assets/trace.svg';

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [playlist, setPlaylist] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isPlaylistLooping, setIsPlaylistLooping] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [width, setWidth] = useState(360);
  const [height, setHeight] = useState(640);
  const [dimensionMode, setDimensionMode] = useState('free'); // 'free' or 'preset'
  const [isPlaying, setIsPlaying] = useState(true);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const playerRef = useRef(null);

  const presetDimensions = {
    'iPhone SE': { width: 375, height: 667 },
    'iPhone 12/13': { width: 390, height: 844 },
    'iPhone 12/13 Pro Max': { width: 428, height: 926 },
    'Samsung Galaxy S20': { width: 360, height: 800 },
    'iPad Mini': { width: 768, height: 1024 },
    'iPad Pro': { width: 1024, height: 1366 }
  };

  const formatTime = (seconds) => {
    const pad = (num) => (`0${Math.floor(num)}`).slice(-2);
    const hours = seconds / 3600;
    const minutes = (seconds % 3600) / 60;
    const secs = seconds % 60;
    
    if (hours >= 1) {
      return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    }
    return `${pad(minutes)}:${pad(secs)}`;
  };

  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played);
      // Update progress bar custom property for gradient
      const progressBar = document.querySelector('.progress-bar');
      if (progressBar) {
        progressBar.style.setProperty('--progress', `${state.played * 100}%`);
      }
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e) => {
    const value = parseFloat(e.target.value);
    setPlayed(value);
    // Update progress bar custom property for gradient
    const progressBar = e.target;
    progressBar.style.setProperty('--progress', `${value * 100}%`);
  };

  const handleSeekMouseUp = (e) => {
    setSeeking(false);
    const value = parseFloat(e.target.value);
    playerRef.current.seekTo(value);
  };

  const handlePresetChange = (preset) => {
    const dimensions = presetDimensions[preset];
    if (dimensions) {
      setWidth(dimensions.width);
      setHeight(dimensions.height);
    }
  };

  const handleWidthChange = (newWidth) => {
    const numWidth = parseInt(newWidth);
    if (!isNaN(numWidth)) {
      setWidth(numWidth);
    }
  };

  const handleHeightChange = (newHeight) => {
    const numHeight = parseInt(newHeight);
    if (!isNaN(numHeight)) {
      setHeight(numHeight);
    }
  };

  const handleFileSelection = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setPlaylist([url]);
      setCurrentVideo(0);
    }
  };

  const handlePlaylistSelection = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const urls = files.map(file => URL.createObjectURL(file));
      setPlaylist(urls);
      setVideoUrl(urls[0]);
      setCurrentVideo(0);
    }
  };

  const handleVideoEnd = () => {
    if (isPlaylistLooping) {
      if (currentVideo < playlist.length - 1) {
        setCurrentVideo(prev => prev + 1);
        setVideoUrl(playlist[currentVideo + 1]);
      } else {
        setCurrentVideo(0);
        setVideoUrl(playlist[0]);
      }
    } else if (!isLooping && currentVideo < playlist.length - 1) {
      setCurrentVideo(prev => prev + 1);
      setVideoUrl(playlist[currentVideo + 1]);
    }
  };

  const toggleLoop = () => {
    if (isPlaylistLooping) {
      setIsPlaylistLooping(false);
    }
    setIsLooping(!isLooping);
  };

  const togglePlaylistLoop = () => {
    if (isLooping) {
      setIsLooping(false);
    }
    setIsPlaylistLooping(!isPlaylistLooping);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="app-theme">
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-50 w-full border-b backdrop-blur">
            <div className="container flex h-14 max-w-screen-2xl items-center">
              <div className="mr-4 flex">
                <button
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <Cross1Icon className="h-4 w-4" /> : <HamburgerMenuIcon className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="flex-1">
            <div className="app-container">
              <div 
                className="video-section"
                style={{
                  filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                  width: `${width}px`,
                  height: `${height}px`
                }}
              >
                <div className={`player-wrapper ${videoUrl ? 'has-video' : ''}`}>
                  <div className="empty-display-text">TELA DE LED 16:9</div>
                  {videoUrl && (
                    <>
                      <ReactPlayer
                        ref={playerRef}
                        url={videoUrl}
                        className="react-player"
                        playing={isPlaying}
                        loop={isLooping}
                        onEnded={handleVideoEnd}
                        onProgress={handleProgress}
                        onDuration={handleDuration}
                        width="100%"
                        height="100%"
                      />
                      <div className="video-controls">
                        <button
                          className="video-control-button"
                          onClick={() => setIsPlaying(!isPlaying)}
                          title={isPlaying ? "Stop" : "Play"}
                        >
                          {isPlaying ? <StopIcon /> : <PlayIcon />}
                        </button>
                        <div className="time-display">
                          <span>{formatTime(duration * played)}</span>
                          <span>/</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                        <div className="progress-bar-container">
                          <input
                            type="range"
                            min={0}
                            max={1}
                            step="any"
                            value={played}
                            onMouseDown={handleSeekMouseDown}
                            onChange={handleSeekChange}
                            onMouseUp={handleSeekMouseUp}
                            className="progress-bar"
                            style={{ '--progress': `${played * 100}%` }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="controls">
                <button
                  className="menu-toggle"
                  onClick={toggleMobileMenu}
                  style={{
                    position: 'fixed',
                    top: '1rem',
                    right: '1rem',
                    zIndex: 1000,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'white',
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isMobileMenuOpen ? <Cross1Icon /> : <HamburgerMenuIcon />}
                </button>

                <div className={`menu ${isMobileMenuOpen ? 'open' : ''}`}>
                  <div className="menu-header">
                    <div className="brand-container">
                      <LogoSvg className="logo" />
                      <h1>ELETROLED DISPLAY</h1>
                    </div>
                  </div>

                  <div className="menu-grid">
                    <div className="menu-card">
                      <h3>Select Video</h3>
                      <div className="video-input">
                        <input
                          type="text"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="Enter video URL"
                        />
                        <button onClick={() => setVideoUrl('')}>Clear</button>
                      </div>
                    </div>

                    <div className="menu-card">
                      <h3>Select Playlist</h3>
                      <input
                        type="file"
                        accept=".txt"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              const urls = e.target.result.split('\n').filter(url => url.trim());
                              setPlaylist(urls);
                              if (urls.length > 0) {
                                setVideoUrl(urls[0]);
                                setCurrentVideo(0);
                              }
                            };
                            reader.readAsText(file);
                          }
                        }}
                      />
                      <div className="playlist-buttons">
                        <button
                          className={`loop-button ${isPlaylistLooping ? 'active' : ''}`}
                          onClick={() => setIsPlaylistLooping(!isPlaylistLooping)}
                        >
                          <UpdateIcon /> Loop Playlist
                        </button>
                        <button
                          className={`loop-button ${isLooping ? 'active' : ''}`}
                          onClick={() => setIsLooping(!isLooping)}
                        >
                          <LoopIcon /> Loop Video
                        </button>
                      </div>
                    </div>

                    <div className="menu-card">
                      <h3>Display Settings</h3>
                      <div className="control-group">
                        <label>Brightness</label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={brightness}
                          onChange={(e) => setBrightness(e.target.value)}
                          className="slider"
                        />
                        <span>{brightness}%</span>
                      </div>
                      <div className="control-group">
                        <label>Contrast</label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={contrast}
                          onChange={(e) => setContrast(e.target.value)}
                          className="slider"
                        />
                        <span>{contrast}%</span>
                      </div>
                    </div>

                    <div className="menu-card">
                      <h3>Dimensions</h3>
                      <div className="dimension-mode">
                        <label>
                          <input
                            type="radio"
                            value="free"
                            checked={dimensionMode === 'free'}
                            onChange={(e) => setDimensionMode(e.target.value)}
                          />
                          <span>Custom</span>
                        </label>
                        <label>
                          <input
                            type="radio"
                            value="preset"
                            checked={dimensionMode === 'preset'}
                            onChange={(e) => setDimensionMode(e.target.value)}
                          />
                          <span>Preset</span>
                        </label>
                      </div>

                      {dimensionMode === 'free' ? (
                        <div className="dimension-inputs">
                          <div className="control-group">
                            <label>Width</label>
                            <input
                              type="number"
                              value={width}
                              onChange={(e) => handleWidthChange(e.target.value)}
                            />
                          </div>
                          <div className="control-group">
                            <label>Height</label>
                            <input
                              type="number"
                              value={height}
                              onChange={(e) => setHeight(e.target.value)}
                            />
                          </div>
                        </div>
                      ) : (
                        <select
                          onChange={(e) => handlePresetChange(e.target.value)}
                          className="preset-select"
                        >
                          <option value="">Select a preset</option>
                          {Object.keys(presetDimensions).map((preset) => (
                            <option key={preset} value={preset}>
                              {preset}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
