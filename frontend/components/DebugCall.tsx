"use client";

import { useCall } from "../hooks/useCall";
import { useEffect, useState } from "react";

export default function DebugCall() {
    const { status, call, remoteUsers } = useCall();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[100000] bg-black/90 text-green-400 p-4 rounded border border-green-500 font-mono text-xs max-w-xs shadow-2xl opacity-90 pointer-events-none">
            <h3 className="font-bold underline mb-2">DEBUG OVERLAY</h3>
            <p>Status: <span className="text-white">{status}</span></p>
            <p>Call ID: <span className="text-white">{call?.id || "null"}</span></p>
            <p>Remote Users: <span className="text-white">{remoteUsers?.length || 0}</span></p>
            <p>Timestamp: <span className="text-white">{new Date().toLocaleTimeString()}</span></p>
            <div className="mt-2 text-[10px] text-gray-400">
                If Status is "connected" but Modal is missing, check Console for CSS errors.
            </div>
        </div>
    );
}
