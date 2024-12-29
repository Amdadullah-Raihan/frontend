import React, { useCallback, useEffect, useRef, useState } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import debounce from 'lodash/debounce';

import './VideoPlayer.css';
import axiosInstance from '../../../api/axiosInstance';

const VideoPlayer = ({ src, title, userId }) => {
  const [lastTime, setLastTime] = useState(0);
  const [watchedTime, setWatchedTime] = useState(0);
  const playerRef = useRef(null);

  const isYouTubeLink = (url) => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  };

  // Function to update watch time on the backend
  const updateWatchTime = async (time) => {
    try {
      const response = await axiosInstance.post('/api/watchTime/update', {
        userId,
        watchTime: time * 1000, // Send the actual watched time in milliseconds
      });

      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error updating watch time:', error);
    }
  };

  const debouncedUpdateWatchTime = useCallback(
    debounce((time) => {
      updateWatchTime(time);
      setWatchedTime(0); // Reset watched time after sending the update
    }, 5000),
    []
  );

  const handleTimeUpdate = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime;
      const increment = currentTime - lastTime;

      if (increment > 0) {
        setWatchedTime((prev) => prev + increment);
        setLastTime(currentTime);
        debouncedUpdateWatchTime(watchedTime + increment);
      }
    }
  };

  const handlePause = () => {
    if (playerRef.current) {
      updateWatchTime(watchedTime); // Immediately update watch time on pause
      setWatchedTime(0); // Reset watched time after sending the update
    }
  };

  useEffect(() => {
    const player = playerRef.current;

    if (player) {
      player.addEventListener('timeupdate', handleTimeUpdate);
      player.addEventListener('pause', handlePause);

      return () => {
        player.removeEventListener('timeupdate', handleTimeUpdate);
        player.removeEventListener('pause', handlePause);
      };
    }
  }, [lastTime, watchedTime]);

  const getYouTubeVideoId = (url) => {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get('v') || url.split('/').pop();
  };

  return (
    <div className="overflow-hidden rounded-md">
      {isYouTubeLink(src) ? (
        <div className="relative w-full pb-[56.25%]">
          <iframe
            src={`https://www.youtube.com/embed/${getYouTubeVideoId(src)}`}
            title={title}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <MuxPlayer
          ref={playerRef}
          src={src}
          controls
          preload="metadata"
          width="100%"
          height="auto"
          title={title}
          onError={(e) => console.error('Mux Player error:', e)}
          accentColor="#F79426"
        ></MuxPlayer>
      )}
    </div>
  );
};

export default VideoPlayer;
