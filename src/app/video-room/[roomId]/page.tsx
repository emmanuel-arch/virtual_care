'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  Share2,
  MessageSquare,
} from 'lucide-react';

export default function VideoRoom() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isConnecting, setIsConnecting] = useState(true);
  const [callDuration, setCallDuration] = useState('00:00');
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Initialize local video stream
  useEffect(() => {
    const initializeVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
          };
        }

        setIsConnecting(false);
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initializeVideo();

    return () => {
      // Cleanup: stop all tracks
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // Call duration timer
  useEffect(() => {
    if (!isConnecting) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        setCallDuration(
          `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isConnecting]);

  const toggleMicrophone = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getAudioTracks();
      tracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getVideoTracks();
      tracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        // In production, replace the video track in the peer connection
        setIsScreenSharing(true);
      } else {
        setIsScreenSharing(false);
        // Switch back to camera
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const endCall = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
    // Navigate back or show call summary
    window.location.href = '/dashboard/patient';
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Call Duration Header */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="text-lg font-semibold">Video Consultation</div>
        <div className="text-2xl font-mono font-bold">{callDuration}</div>
      </div>

      {/* Video Container */}
      <div className="flex-1 relative overflow-hidden bg-black">
        {/* Remote Video (Full Screen) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Local Video (Picture in Picture) */}
        <div className="absolute bottom-4 right-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover mirror"
          />
          {!isVideoEnabled && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <div className="text-center">
                <VideoOff className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Camera Off</p>
              </div>
            </div>
          )}
        </div>

        {/* Connecting Status */}
        {isConnecting && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-white text-center">Initializing video call...</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="bg-gray-900 border-t border-gray-700 p-6">
        <div className="flex items-center justify-center gap-4">
          {/* Microphone Toggle */}
          <Button
            size="lg"
            className={`rounded-full w-14 h-14 ${
              isMuted
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={toggleMicrophone}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </Button>

          {/* Video Toggle */}
          <Button
            size="lg"
            className={`rounded-full w-14 h-14 ${
              !isVideoEnabled
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={toggleVideo}
            title={isVideoEnabled ? 'Stop Video' : 'Start Video'}
          >
            {isVideoEnabled ? (
              <Video className="w-6 h-6" />
            ) : (
              <VideoOff className="w-6 h-6" />
            )}
          </Button>

          {/* Screen Share */}
          <Button
            size="lg"
            className={`rounded-full w-14 h-14 ${
              isScreenSharing
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={toggleScreenShare}
            title="Share Screen"
          >
            <Share2 className="w-6 h-6" />
          </Button>

          {/* Chat */}
          <Button
            size="lg"
            className="rounded-full w-14 h-14 bg-gray-700 hover:bg-gray-600"
            title="Open Chat"
          >
            <MessageSquare className="w-6 h-6" />
          </Button>

          {/* End Call */}
          <Button
            size="lg"
            className="rounded-full w-14 h-14 bg-red-600 hover:bg-red-700 ml-4"
            onClick={endCall}
            title="End Call"
          >
            <Phone className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
