"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "../lib/i18n";
import { useCall } from "../hooks/useCall";
import { useAuth } from "../lib/auth";

export default function CallModal() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const {
    call,
    status,
    isMuted,
    isVideoEnabled,
    duration,
    formattedDuration,
    localVideoTrack,
    remoteUsers,
    answerCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo,
    isPermissionNeeded,
    joinCall,
  } = useCall();

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

  // Permission Interruption Overlay
  if (isPermissionNeeded) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 md:p-4">
        <div className="bg-card border border-haze rounded-2xl p-8 max-w-sm w-full text-center">
          <h2 className="text-xl font-semibold text-white mb-4">{t("call.resumeSession")}</h2>
          <p className="text-white/70 mb-6">{t("call.permissionNeeded") || "Click below to resume your call session."}</p>
          <button
            onClick={() => joinCall()}
            className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            {t("call.resume")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 md:p-4">
      <div className="relative w-full h-full md:h-auto md:max-w-4xl bg-background md:rounded-2xl overflow-hidden">
        {/* Video container */}
        {isVideo && status === "connected" ? (
          <div className="relative w-full h-full md:aspect-video bg-gray-900">
            {/* Remote video (full screen) */}
            <div
              id={`remote-video-${remoteUsers[0]?.uid}`}
              ref={setRemoteVideoRef}
              className="absolute inset-0"
            />

            {/* Local video (small overlay) */}
            <div
              id={`local-video-${currentUserId}`}
              ref={setLocalVideoRef}
              className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20"
            />

            {/* No remote video placeholder */}
            {remoteUsers.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl text-white">
                      {otherUser.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-white text-lg">{otherUser.username}</p>
                  <p className="text-white/60 text-sm mt-1">{getStatusText()}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Audio call or waiting UI */
          <div className="bg-card border border-haze rounded-2xl p-8">
            <div className="text-center">
              {/* Avatar */}
              <div className="w-28 h-28 mx-auto bg-black/20 rounded-full flex items-center justify-center mb-6">
                {otherUser.avatar_url ? (
                  <img
                    src={otherUser.avatar_url}
                    alt={otherUser.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-5xl text-white">
                    {otherUser.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Name */}
              <h2 className="text-2xl font-semibold text-white mb-2">
                {otherUser.username}
              </h2>

              {/* Status */}
              <p className="text-white/80 text-lg">
                {isVideo ? t("call.videoCall") : t("call.voiceCall")}
              </p>
              <p className="text-white/60 mt-2">{getStatusText()}</p>

              {/* Pulse animation for calling/ringing */}
              {(status === "calling" || status === "ringing" || status === "connecting") && (
                <div className="flex justify-center mt-6 space-x-2">
                  <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse" />
                  <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse delay-100" />
                  <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse delay-200" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="mt-6 flex justify-center items-center gap-4">
          {/* Incoming call buttons */}
          {isIncoming ? (
            <>
              <button
                onClick={rejectCall}
                className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                title={t("call.reject")}
              >
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button
                onClick={answerCall}
                className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
                title={t("call.answer")}
              >
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </button>
            </>
          ) : (
            /* Active call controls */
            <>
              <button
                onClick={toggleMute}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isMuted ? "bg-red-500 hover:bg-red-600" : "bg-black/30 hover:bg-black/40"
                  }`}
                title={isMuted ? t("call.unmute") : t("call.mute")}
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMuted ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  )}
                </svg>
              </button>

              {isVideo && (
                <button
                  onClick={toggleVideo}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${!isVideoEnabled ? "bg-red-500 hover:bg-red-600" : "bg-black/30 hover:bg-black/40"
                    }`}
                  title={isVideoEnabled ? t("call.videoOff") : t("call.videoOn")}
                >
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isVideoEnabled ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    )}
                  </svg>
                </button>
              )}

              <button
                onClick={endCall}
                className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                title={t("call.endCall")}
              >
                <svg className="w-8 h-8 text-white transform rotate-135" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
