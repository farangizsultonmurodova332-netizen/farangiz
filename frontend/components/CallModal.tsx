"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../lib/i18n";
import { useCall } from "../hooks/useCall";
import { useAuth } from "../lib/auth";

export default function CallModal() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  // existing hooks...
  const {
    call, status, isMuted, isVideoEnabled, duration, formattedDuration,
    localVideoTrack, remoteUsers, answerCall, rejectCall, endCall,
    toggleMute, toggleVideo, isPermissionNeeded, joinCall
  } = useCall();

  useEffect(() => {
    setMounted(true);
  }, []);

  // ... [Keep existing refs and effects as they were] ...

  // Callback ref for local video
  const setLocalVideoRef = (node: HTMLDivElement | null) => {
    if (node && localVideoTrack && isVideoEnabled) {
      localVideoTrack.play(node);
    }
  };

  // Callback ref for remote video
  const setRemoteVideoRef = (node: HTMLDivElement | null) => {
    if (node && remoteUsers.length > 0) {
      const remoteUser = remoteUsers[0];
      if (remoteUser.videoTrack) {
        remoteUser.videoTrack.play(node);
      }
    }
  };

  // Fallback: Re-run play if track arrives AFTER mount and ref wasn't triggered
  useEffect(() => {
    const node = document.getElementById(`local-video-${user?.id}`);
    if (node && localVideoTrack && isVideoEnabled) {
      localVideoTrack.play(node as HTMLDivElement);
    }
  }, [localVideoTrack, isVideoEnabled, user?.id]);

  // Play remote video when remoteUsers changes
  useEffect(() => {
    console.log("[CallModal] remoteUsers changed:", remoteUsers.length, remoteUsers);

    if (remoteUsers.length > 0) {
      const remoteUser = remoteUsers[0];
      console.log("[CallModal] Remote user:", remoteUser.uid, "hasVideoTrack:", !!remoteUser.videoTrack);

      // Use requestAnimationFrame to ensure DOM is ready
      const playVideo = () => {
        const node = document.getElementById(`remote-video-${remoteUser.uid}`);
        console.log("[CallModal] Looking for DOM node:", `remote-video-${remoteUser.uid}`, "found:", !!node);

        if (node && remoteUser.videoTrack) {
          console.log("[CallModal] Playing remote video track");
          remoteUser.videoTrack.play(node as HTMLDivElement);
        } else if (node && !remoteUser.videoTrack) {
          console.log("[CallModal] DOM node found but no videoTrack yet, retrying in 500ms");
          // Retry after a short delay
          setTimeout(playVideo, 500);
        } else if (!node) {
          console.log("[CallModal] DOM node not found, retrying in 100ms");
          setTimeout(playVideo, 100);
        }
      };

      requestAnimationFrame(playVideo);
    }
  }, [remoteUsers]);

  if (!mounted) return null;
  if (!call || status === "idle") return null;

  const currentUserId = user?.id || 0;
  const isIncoming = status === "ringing" && call.callee.id === currentUserId;
  const isVideo = call.call_type === "video";
  const otherUser = call.caller.id === currentUserId ? call.callee : call.caller;

  const getStatusText = () => {
    switch (status) {
      case "calling":
        return t("call.calling");
      case "ringing":
        return isIncoming ? t("call.incomingCall") : t("call.ringing");
      case "connecting":
        return t("call.connecting");
      case "connected":
        return formattedDuration;
      default:
        return "";
    }
  };

  console.log("[CallModal] RENDER. Status:", status, "Mounted:", mounted);

  if (!mounted) return null;
  if (!call || (status as any) === "idle") return null;

  // ... (Permission check omitted for brevity, ensure logic matches)
  if (isPermissionNeeded) {
    return (
      <div className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/90 p-4 border-4 border-yellow-500">
        <h1 className="text-white text-2xl">PERMISSION NEEDED</h1>
        <button onClick={() => joinCall()} className="bg-blue-500 text-white p-4 mt-4">RESUME</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-slate-900/90 md:p-4 border-[10px] border-red-500">
      {/* Debug Header */}
      <div className="absolute top-0 left-0 bg-red-600 text-white p-2 z-50 font-bold">
        CALL MODAL VISIBLE (ID: {call.id})
      </div>

      <div className="relative w-full h-full md:h-auto md:max-w-4xl bg-background md:rounded-2xl overflow-hidden flex flex-col h-[100dvh]">
        {/* Main Content Area */}
        <div className="flex-1 relative overflow-hidden bg-gray-900">
          {isVideo && status === "connected" ? (
            <div className="w-full h-full relative">
              {/* Explicitly showing a placeholder if video is missing */}
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <p className="text-white">Video Area</p>
              </div>

              <div
                id={`remote-video-${remoteUsers[0]?.uid}`}
                ref={setRemoteVideoRef}
                className="absolute inset-0 w-full h-full object-cover z-10"
                style={{ background: 'transparent' }}
              />

              {/* Local Video */}
              <div
                id={`local-video-${currentUserId}`}
                ref={setLocalVideoRef}
                className="absolute top-4 right-4 w-32 h-24 bg-black border-2 border-white z-20"
              />
            </div>
          ) : (
            <div className="text-white text-center p-10">Audio Mode</div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-gray-800 p-4 z-50 flex justify-center gap-4">
          <button onClick={endCall} className="bg-red-600 text-white p-4 rounded-full">End Call</button>
        </div>
      </div>
    </div>
  );
}
