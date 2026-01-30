"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import type {
    IAgoraRTCClient,
    ICameraVideoTrack,
    IMicrophoneAudioTrack,
    IAgoraRTCRemoteUser,
} from "agora-rtc-sdk-ng";
import { useAuth } from "../lib/auth";
import type { Call, CallType, CallStatus, CallParticipant, CallSignal } from "../lib/types";
import { authRequest } from "../lib/api";

const AGORA_APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || "";

type CallState = {
    call: Call | null;
    status: CallStatus;
    isMuted: boolean;
    isVideoEnabled: boolean;
    duration: number;
    localVideoTrack: ICameraVideoTrack | null;
    remoteUsers: IAgoraRTCRemoteUser[];
    isPermissionNeeded: boolean;
};

const initialState: CallState = {
    call: null,
    status: "idle",
    isMuted: false,
    isVideoEnabled: true,
    duration: 0,
    localVideoTrack: null,
    remoteUsers: [],
    isPermissionNeeded: false,
};

type CallContextType = CallState & {
    formattedDuration: string;
    startCall: (roomId: number, callee: CallParticipant, callType: CallType) => Promise<void>;
    answerCall: () => Promise<void>;
    rejectCall: () => Promise<void>;
    endCall: () => Promise<void>;
    toggleMute: () => Promise<void>;
    toggleVideo: () => Promise<void>;
    // Method to inject incoming call signal from external sources (like WebSocket)
    handleIncomingCallSignal: (signal: CallSignal) => void;
    joinCall: () => Promise<void>; // Manual join trigger
};

const CallContext = createContext<CallContextType | null>(null);

export function useCall() {
    const context = useContext(CallContext);
    if (!context) {
        throw new Error("useCall must be used within a CallProvider");
    }
    return context;
}

export function CallProvider({ children }: { children: React.ReactNode }) {
    const { user, apiFetch } = useAuth();
    const [state, setState] = useState<CallState>(initialState);

    // Refs
    const clientRef = useRef<IAgoraRTCClient | null>(null);
    const localAudioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
    const localVideoTrackRef = useRef<ICameraVideoTrack | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const agoraSdkRef = useRef<any>(null); // Store SDK module to avoid async import during gesture

    // Track when client is ready
    const [clientReady, setClientReady] = useState(false);

    // Initialize Agora Client
    useEffect(() => {
        if (typeof window !== "undefined") {
            (async () => {
                const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
                agoraSdkRef.current = AgoraRTC;
                // Use h264 codec for better mobile compatibility
                clientRef.current = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });
                console.log("[Agora] Client created with h264 codec");
                setClientReady(true);
            })();
        }
    }, []);

    // Check for active call on mount (Persistence)
    useEffect(() => {
        if (!user || state.call) return; // Already have state or no user

        const checkActiveCall = async () => {
            try {
                const activeCall = await apiFetch<Call & { agora_token?: string }>("/calls/active/");
                if (activeCall && activeCall.status !== "ended") {
                    console.log("[CallContext] Found active call:", activeCall.id);

                    // Restore call state
                    setState((prev) => ({
                        ...prev,
                        call: activeCall,
                        status: activeCall.status,
                        // If we are refreshing, we assume video was enabled if it was a video call
                        isVideoEnabled: activeCall.call_type === "video",
                    }));
                }
            } catch (error) {
                // No active call or error
            }
        };

        checkActiveCall();
    }, [user, apiFetch]);

    // Effect to join channel when we have call state restored but not joined yet
    useEffect(() => {
        const joinRestoredCall = async () => {
            if (!clientReady || !clientRef.current || !state.call) return;

            // If we have a call object but no local tracks, it means we just restored state
            // and need to rejoin the channel
            if ((state.status === "connected" || state.status === "ringing" || state.status === "calling") && !localAudioTrackRef.current) {
                console.log("[CallContext] Rejoining restored call...");
                const { call } = state;

                try {
                    const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;

                    // Create tracks again
                    const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
                    localAudioTrackRef.current = audioTrack;

                    let videoTrack: ICameraVideoTrack | null = null;
                    if (call.call_type === "video") {
                        videoTrack = await AgoraRTC.createCameraVideoTrack();
                        localVideoTrackRef.current = videoTrack;
                        setState((prev) => ({ ...prev, localVideoTrack: videoTrack }));
                    }

                    // Join using stored token (or fresh one from API if we refetched)
                    if (call.agora_channel && call.agora_token) {
                        try {
                            await clientRef.current.join(AGORA_APP_ID, call.agora_channel, call.agora_token, user!.id);

                            if (videoTrack) {
                                await clientRef.current.publish([audioTrack, videoTrack]);
                            } else {
                                await clientRef.current.publish([audioTrack]);
                            }
                            console.log("[CallContext] Rejoined successfully");
                        } catch (joinError: any) {
                            if (joinError.code === "UID_CONFLICT") {
                                console.log("Already in channel, ignoring");
                            } else {
                                throw joinError;
                            }
                        }
                    }
                } catch (e) {
                    console.error("Failed to rejoin restored call:", e);
                }
            }
        };
        joinRestoredCall();
    }, [clientReady, state.status, state.call?.id]);

    // Check for active call on mount (Persistence)
    useEffect(() => {
        if (!user || state.call) return; // Already have state or no user

        const checkActiveCall = async () => {
            try {
                const activeCall = await apiFetch<Call & { agora_token?: string }>("/calls/active/");
                if (activeCall && activeCall.status !== "ended") {
                    console.log("[CallContext] Found active call:", activeCall.id);

                    // Restore call state
                    setState((prev) => ({
                        ...prev,
                        call: activeCall,
                        status: activeCall.status,
                        // If we are refreshing, we assume video was enabled if it was a video call
                        isVideoEnabled: activeCall.call_type === "video",
                    }));

                    // If connected or ringing, we might need to rejoin Agora
                    if (["connected", "ringing"].includes(activeCall.status) || activeCall.status === "calling") {
                        // We need the token. The endpoint should return it.
                        if (activeCall.agora_channel) {
                            if (!clientRef.current) return; // Wait for client

                            // We need to wait for clientReady before joining
                            // But since client initialized in separate effect, we might race.
                            // Simple retry logic or dependency check
                        }
                    }
                }
            } catch (error) {
                // No active call or error
            }
        };

        checkActiveCall();
    }, [user, apiFetch]);

    // Effect to join channel when we have call state restored but not joined yet
    useEffect(() => {
        const joinRestoredCall = async () => {
            if (!clientReady || !clientRef.current || !state.call) return;

            // Check if already in a channel or connecting to avoid race conditions
            if (clientRef.current.connectionState !== "DISCONNECTED") {
                console.log("[CallContext] Client already in state:", clientRef.current.connectionState);
                // If we are "CONNECTED" but track refs are null (e.g. after hard refresh logic failure), we might need to unpublish?
                // Actually if clientRef persisted (unlikely on refresh), we differ. 
                // On refresh clientRef is new. 
                return;
            }

            // If we have a call object but no local tracks, it means we just restored state
            // and need to rejoin the channel (unless we are waiting for permission)
            if ((state.status === "connected" || state.status === "ringing" || state.status === "calling") && !localAudioTrackRef.current && !state.isPermissionNeeded) {
                console.log("[CallContext] Rejoining restored call...");
                const { call } = state;

                try {
                    const AgoraRTC = agoraSdkRef.current || (await import("agora-rtc-sdk-ng")).default;

                    // Create tracks again if missing
                    if (!localAudioTrackRef.current) {
                        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
                        localAudioTrackRef.current = audioTrack;
                    }

                    let videoTrack: ICameraVideoTrack | null = null;
                    if (call.call_type === "video" && !localVideoTrackRef.current) {
                        videoTrack = await AgoraRTC.createCameraVideoTrack();
                        localVideoTrackRef.current = videoTrack;
                        setState((prev) => ({ ...prev, localVideoTrack: videoTrack }));
                    } else if (localVideoTrackRef.current) {
                        videoTrack = localVideoTrackRef.current;
                    }

                    // Join using stored token (or fresh one from API if we refetched)
                    if (call.agora_channel) {
                        try {
                            const token = call.agora_token || null;
                            await clientRef.current.join(AGORA_APP_ID, call.agora_channel, token, user!.id);

                            // Check published state before publishing to avoid errors
                            const tracksToPublish: (IMicrophoneAudioTrack | ICameraVideoTrack)[] = [localAudioTrackRef.current!];
                            if (videoTrack) tracksToPublish.push(videoTrack);

                            await clientRef.current.publish(tracksToPublish);
                            console.log("[CallContext] Rejoined successfully");
                        } catch (joinError: any) {
                            if (joinError.code === "UID_CONFLICT" || (joinError.name === "AgoraRTCError" && joinError.message.includes("CONNECTING"))) {
                                console.log("Already in channel or connecting, ignoring");
                            } else {
                                throw joinError;
                            }
                        }
                    }
                } catch (e: any) {
                    console.error("Failed to rejoin restored call:", e);
                    if (e.name === "NotAllowedError" || e.code === "PERMISSION_DENIED") {
                        console.log("Permission denied, requesting user interaction...");
                        setState(prev => ({ ...prev, isPermissionNeeded: true }));
                    }
                }
            }
        };
        joinRestoredCall();
    }, [clientReady, state.status, state.call?.id, state.isPermissionNeeded]);

    // Manual join method for when permissions are needed
    const joinCall = useCallback(async () => {
        if (!state.call || !clientReady || !clientRef.current) return;

        try {
            // USE PRELOADED SDK if available to ensure we stay in trusted event context
            // Call createMicrophoneAudioTrack IMMEDIATELY
            const AgoraRTC = agoraSdkRef.current;
            if (!AgoraRTC) {
                console.error("[CallContext] SDK not loaded yet");
                return;
            }

            // 1. Create tracks immediately (using user gesture)
            // This MUST be the first await in the chain if possible
            if (!localAudioTrackRef.current) {
                console.log("[CallContext] Manual join: Creating microphone track...");
                localAudioTrackRef.current = await AgoraRTC.createMicrophoneAudioTrack();
                console.log("[CallContext] Manual join: Microphone track created");
            }

            let videoTrack = localVideoTrackRef.current;
            if (state.call.call_type === "video" && !videoTrack) {
                console.log("[CallContext] Manual join: Creating camera video track...");
                videoTrack = await AgoraRTC.createCameraVideoTrack();
                localVideoTrackRef.current = videoTrack;
                console.log("[CallContext] Manual join: Camera video track created");
            }

            // 2. Join Channel
            const { call } = state;
            if (call.agora_channel) {
                const token = call.agora_token || null;
                // Add safety check for connection state
                if (clientRef.current.connectionState === "DISCONNECTED") {
                    console.log("[CallContext] Manual join: Joining Agora channel...");
                    await clientRef.current.join(AGORA_APP_ID, call.agora_channel, token, user!.id);
                    console.log("[CallContext] Manual join: Joined Agora channel");

                    const tracksToPublish: (IMicrophoneAudioTrack | ICameraVideoTrack)[] = [localAudioTrackRef.current!];
                    if (videoTrack) tracksToPublish.push(videoTrack);
                    console.log("[CallContext] Manual join: Publishing tracks...");
                    await clientRef.current.publish(tracksToPublish);
                    console.log("[CallContext] Manual join: Tracks published");
                } else {
                    console.log("[CallContext] Manual join: Client already connected or connecting, skipping join.");
                }
            }

            // 3. Update state (clean up UI)
            setState(prev => ({
                ...prev,
                isPermissionNeeded: false,
                localVideoTrack: videoTrack || prev.localVideoTrack
            }));

            console.log("[CallContext] Manually joined successfully");

        } catch (e: any) {
            console.error("Manual join failed:", e);
            // Ensure flag remains true if failed
            setState(prev => ({ ...prev, isPermissionNeeded: true }));
            if (e.name === "NotAllowedError" || e.code === "PERMISSION_DENIED") {
                alert("Permission denied. Please reset permissions in your browser address bar.");
            }
        }
    }, [state.call, clientReady, user]);


    // Setup Agora Event Listeners - depends on clientReady
    useEffect(() => {
        if (!clientReady) {
            console.log("[Agora] Client not ready yet, skipping event setup");
            return;
        }

        const client = clientRef.current;
        if (!client) {
            console.log("[Agora] Client ref is null even though clientReady is true");
            return;
        }

        console.log("[Agora] Setting up event listeners");

        const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
            console.log("[Agora] User published:", user.uid, mediaType);
            await client.subscribe(user, mediaType);
            if (mediaType === "video") {
                console.log("[Agora] Adding remote user video to state:", user.uid);
                setState((prev) => ({
                    ...prev,
                    remoteUsers: [...prev.remoteUsers.filter((u) => u.uid !== user.uid), user],
                }));
            }
            if (mediaType === "audio") {
                console.log("[Agora] Playing remote user audio:", user.uid);
                user.audioTrack?.play();
            }
        };

        const handleUserUnpublished = (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
            console.log("[Agora] User unpublished:", user.uid, mediaType);
            if (mediaType === "video") {
                setState((prev) => ({
                    ...prev,
                    remoteUsers: prev.remoteUsers.filter((u) => u.uid !== user.uid),
                }));
            }
        };

        const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
            console.log("[Agora] User left:", user.uid);
            setState((prev) => ({
                ...prev,
                remoteUsers: prev.remoteUsers.filter((u) => u.uid !== user.uid),
            }));
        };

        const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
            console.log("[Agora] User joined:", user.uid);
        };

        client.on("user-published", handleUserPublished);
        client.on("user-unpublished", handleUserUnpublished);
        client.on("user-left", handleUserLeft);
        client.on("user-joined", handleUserJoined);

        return () => {
            client.off("user-published", handleUserPublished);
            client.off("user-unpublished", handleUserUnpublished);
            client.off("user-left", handleUserLeft);
            client.off("user-joined", handleUserJoined);
        };
    }, [clientReady]);

    // Duration Timer
    useEffect(() => {
        if (state.status === "connected") {
            timerRef.current = setInterval(() => {
                setState((prev) => ({ ...prev, duration: prev.duration + 1 }));
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            if (state.status === "idle") {
                setState((prev) => ({ ...prev, duration: 0 }));
            }
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [state.status]);

    // Clean up tracks on unmount
    useEffect(() => {
        return () => {
            localAudioTrackRef.current?.close();
            localVideoTrackRef.current?.close();
            clientRef.current?.leave();
        };
    }, []);

    const startCall = useCallback(async (roomId: number, callee: CallParticipant, callType: CallType) => {
        if (!user || !clientRef.current) return;

        try {
            setState((prev) => ({ ...prev, status: "calling", isVideoEnabled: callType === "video" }));

            // API Call to start
            const response = await apiFetch<{
                call_id: string;
                agora_channel: string;
                agora_token: string;
            }>("/calls/start/", {
                method: "POST",
                body: JSON.stringify({
                    room_id: roomId,
                    callee_id: callee.id,
                    call_type: callType,
                }),
            });

            const newCall: Call = {
                id: response.call_id,
                room_id: roomId,
                caller: { id: user.id, username: user.username, avatar_url: user.avatar_url },
                callee,
                call_type: callType,
                status: "calling",
                agora_channel: response.agora_channel,
                agora_token: response.agora_token,
            };

            setState((prev) => ({ ...prev, call: newCall }));

            // Initialize Local Tracks
            const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
            const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            localAudioTrackRef.current = audioTrack;

            let videoTrack: ICameraVideoTrack | null = null;
            if (callType === "video") {
                videoTrack = await AgoraRTC.createCameraVideoTrack();
                localVideoTrackRef.current = videoTrack;
                setState((prev) => ({ ...prev, localVideoTrack: videoTrack }));
            }

            // Join Channel
            if (response.agora_channel && response.agora_token) {
                await clientRef.current.join(AGORA_APP_ID, response.agora_channel, response.agora_token, user.id);

                if (videoTrack) {
                    await clientRef.current.publish([audioTrack, videoTrack]);
                } else {
                    await clientRef.current.publish([audioTrack]);
                }
            }

        } catch (error) {
            console.error("Failed to start call:", error);
            // Clean up tracks on error
            localAudioTrackRef.current?.close();
            localAudioTrackRef.current = null;
            localVideoTrackRef.current?.close();
            localVideoTrackRef.current = null;
            setState(initialState);
            // Ideally show toast
        }
    }, [user, apiFetch]);

    const answerCall = useCallback(async () => {
        if (!state.call || !user || !clientRef.current) return;

        try {
            const call = state.call;
            setState((prev) => ({ ...prev, status: "connecting" }));

            const response = await apiFetch<Call & { agora_token: string }>(`/calls/${call.id}/answer/`, { method: "POST" });

            // Initialize Tracks
            const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
            const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            localAudioTrackRef.current = audioTrack;

            let videoTrack: ICameraVideoTrack | null = null;
            if (call.call_type === "video") {
                videoTrack = await AgoraRTC.createCameraVideoTrack();
                localVideoTrackRef.current = videoTrack;
                setState((prev) => ({ ...prev, localVideoTrack: videoTrack }));
            }

            // Join Channel with FRESH token for the callee
            if (response.agora_channel && response.agora_token) {
                await clientRef.current.join(AGORA_APP_ID, response.agora_channel, response.agora_token, user.id);

                if (videoTrack) {
                    await clientRef.current.publish([audioTrack, videoTrack]);
                } else {
                    await clientRef.current.publish([audioTrack]);
                }
            }

            setState((prev) => ({ ...prev, status: "connected" }));

        } catch (error) {
            console.error("Failed to answer call", error);
            // Clean up tracks on error
            localAudioTrackRef.current?.close();
            localAudioTrackRef.current = null;
            localVideoTrackRef.current?.close();
            localVideoTrackRef.current = null;
            endCall();
        }
    }, [state.call, user, apiFetch]);

    const rejectCall = useCallback(async () => {
        if (!state.call) return;
        try {
            await apiFetch(`/calls/${state.call.id}/reject/`, { method: "POST" });
        } catch (error) {
            console.error("Failed to reject call", error);
        } finally {
            setState(initialState);
        }
    }, [state.call, apiFetch]);

    const endCall = useCallback(async () => {
        const callId = state.call?.id;

        // Stop Timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        // Leave Agora and clean up tracks properly
        try {
            // Close audio track
            if (localAudioTrackRef.current) {
                localAudioTrackRef.current.close();
                localAudioTrackRef.current = null;
            }

            // Close video track (use ref to avoid stale state)
            if (localVideoTrackRef.current) {
                localVideoTrackRef.current.close();
                localVideoTrackRef.current = null;
            }

            // Leave channel
            if (clientRef.current) {
                await clientRef.current.leave();
            }
        } catch (cleanupError) {
            console.error("Error during Agora cleanup:", cleanupError);
        }

        // Notify Backend
        if (callId) {
            try {
                await apiFetch(`/calls/${callId}/end/`, {
                    method: "POST",
                    body: JSON.stringify({ reason: "ended" })
                });
            } catch (e) {
                console.error("Failed to notify backend end call", e);
            }
        }

        setState(initialState);

    }, [state.call, apiFetch]);

    const toggleMute = useCallback(async () => {
        if (localAudioTrackRef.current) {
            const newMuted = !state.isMuted;
            await localAudioTrackRef.current.setEnabled(!newMuted);
            setState((prev) => ({ ...prev, isMuted: newMuted }));
        }
    }, [state.isMuted]);

    const toggleVideo = useCallback(async () => {
        if (state.localVideoTrack) {
            const newEnabled = !state.isVideoEnabled;
            await state.localVideoTrack.setEnabled(newEnabled);
            setState((prev) => ({ ...prev, isVideoEnabled: newEnabled }));
        }
    }, [state.localVideoTrack, state.isVideoEnabled]);

    const handleIncomingCallSignal = useCallback((signal: CallSignal) => {
        console.log("[CallContext] Received signal:", signal.type, signal);

        if (signal.type === "call_offer" && user && signal.callee_id === user.id) {
            const incomingCall: Call = {
                id: signal.call_id,
                room_id: signal.room_id,
                caller: {
                    id: signal.caller_id,
                    username: signal.caller_username || "Caller",
                    avatar_url: signal.caller_avatar
                },
                callee: {
                    id: user.id,
                    username: user.username,
                    avatar_url: user.avatar_url,
                },
                call_type: signal.call_type,
                status: "ringing",
                agora_channel: signal.agora_channel,
                agora_token: signal.agora_token,
            };
            setState((prev) => ({
                ...prev,
                call: incomingCall,
                status: "ringing",
                isVideoEnabled: signal.call_type === "video"
            }));
        } else if (signal.type === "call_end" || signal.type === "call_reject") {
            // Handle remote end - use setState callback to get current state
            setState((prev) => {
                if (prev.call?.id === signal.call_id) {
                    // Trigger cleanup asynchronously to avoid dependency on endCall
                    setTimeout(() => {
                        // Stop Timer
                        if (timerRef.current) {
                            clearInterval(timerRef.current);
                            timerRef.current = null;
                        }
                        // Clean up tracks
                        if (localAudioTrackRef.current) {
                            localAudioTrackRef.current.close();
                            localAudioTrackRef.current = null;
                        }
                        if (localVideoTrackRef.current) {
                            localVideoTrackRef.current.close();
                            localVideoTrackRef.current = null;
                        }
                        // Leave channel
                        clientRef.current?.leave().catch(console.error);
                    }, 0);
                    return initialState;
                }
                return prev;
            });
        } else if (signal.type === "call_answer") {
            console.log("[CallContext] Processing call_answer signal, updating status to connected");
            setState((prev) => {
                if (prev.call?.id === signal.call_id) {
                    console.log("[CallContext] Status updated to connected for call:", signal.call_id);
                    return { ...prev, status: "connected" };
                }
                console.log("[CallContext] Call ID mismatch. Current:", prev.call?.id, "Signal:", signal.call_id);
                return prev;
            });
        }
    }, [user]);

    // Helper: Format Duration
    const formattedDuration = React.useMemo(() => {
        const mins = Math.floor(state.duration / 60);
        const secs = state.duration % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }, [state.duration]);

    return (
        <CallContext.Provider
            value={{
                ...state,
                formattedDuration,
                startCall,
                answerCall,
                rejectCall,
                endCall,
                toggleMute,
                toggleVideo,
                handleIncomingCallSignal,
                joinCall,
            }}
        >
            {children}
            {/* Helper audio element for remote users */}
            {state.remoteUsers.map((user) => (
                <div key={user.uid} id={`remote-player-${user.uid}`} className="hidden" />
            ))}
        </CallContext.Provider>
    );
};
