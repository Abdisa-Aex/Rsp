"use client";

import { useState, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Download,
} from "lucide-react";

const VideoPlayer = ({ url, theme, thumbnail }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const dur = videoRef.current.duration;
      setCurrentTime(current);
      setDuration(dur);
      setProgress((current / dur) * 100);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    if (videoRef.current && duration) {
      videoRef.current.currentTime = percentage * duration;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
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
    link.download = "video.mp4";
    link.click();
  };

  return (
    <div
      ref={containerRef}
      className="relative group rounded-lg overflow-hidden"
    >
      <video
        ref={videoRef}
        src={url}
        poster={thumbnail}
        className="w-full max-h-64 rounded-lg"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Video Controls Overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
        {/* Top Controls */}
        <div className="flex justify-end gap-2">
          <button
            onClick={handleDownload}
            className="p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
          >
            <Download className="h-4 w-4 text-white" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4 text-white" />
            ) : (
              <Maximize2 className="h-4 w-4 text-white" />
            )}
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="space-y-2">
          {/* Progress Bar */}
          <div
            className="h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 text-white" />
                ) : (
                  <Play className="h-5 w-5 text-white" />
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      if (isMuted) {
                        videoRef.current.volume = volume;
                        setIsMuted(false);
                      } else {
                        videoRef.current.volume = 0;
                        setIsMuted(true);
                      }
                    }
                  }}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 text-white" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-white" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const newVolume = parseFloat(e.target.value);
                    setVolume(newVolume);
                    if (videoRef.current) {
                      videoRef.current.volume = newVolume;
                    }
                    setIsMuted(newVolume === 0);
                  }}
                  className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <span className="text-xs text-white">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
