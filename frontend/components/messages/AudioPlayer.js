"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Download } from "lucide-react";

const AudioPlayer = ({ url, theme, onProgress, onEnded }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [waveform, setWaveform] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    // Generate fake waveform for visualization
    const bars = Array.from({ length: 50 }, () => Math.random() * 100);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWaveform(bars);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(current);
      setDuration(dur);
      const newProgress = (current / dur) * 100;
      setProgress(newProgress);
      if (onProgress) onProgress(newProgress);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    if (audioRef.current && duration) {
      const newTime = percentage * duration;
      audioRef.current.currentTime = newTime;
      setProgress(percentage * 100);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "voice-message.webm";
    link.click();
  };

  return (
    <div
      className={`flex flex-col gap-2 p-3 rounded-lg ${
        theme === "dark" ? "bg-gray-700" : "bg-gray-100"
      }`}
    >
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => {
          setIsPlaying(false);
          if (onEnded) onEnded();
        }}
        className="hidden"
      />

      {/* Waveform Visualization */}
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlay}
          className={`p-2 rounded-full ${
            isPlaying ? "bg-red-500" : "bg-green-500"
          } text-white hover:scale-105 transition-transform`}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-0.5 h-8">
            {waveform.slice(0, 40).map((height, i) => (
              <div
                key={i}
                className="w-1 bg-green-500 rounded-full transition-all"
                style={{
                  height: `${Math.max(3, (height / 100) * 24)}px`,
                  opacity: isPlaying ? 1 : 0.5,
                }}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div
            className="h-1.5 bg-gray-300 rounded-full overflow-hidden cursor-pointer mt-1"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleMute}
            className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-gray-500" />
            ) : (
              <Volume2 className="h-4 w-4 text-gray-500" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          />
          <button
            onClick={handleDownload}
            className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="flex justify-between text-xs">
        <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
          Voice message
        </span>
        <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;
