"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../lib/i18n";

interface Snowflake {
    id: number;
    x: number;
    size: number;
    duration: number;
    delay: number;
    opacity: number;
    char: string;
    swingDuration: number;
}

const SNOW_CHARS = ["❄", "❅", "❆", "✦", "•"];

export default function SnowEffect() {
    const [isSnowing, setIsSnowing] = useState(false);
    const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
    const { t } = useLanguage();

    // Check localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("letItSnow");
        if (saved === "true") {
            setIsSnowing(true);
        }
    }, []);

    // Generate snowflakes when snowing
    useEffect(() => {
        if (isSnowing) {
            const flakes: Snowflake[] = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                size: Math.random() * 10 + 6,
                duration: Math.random() * 5 + 5,
                delay: Math.random() * 5,
                opacity: Math.random() * 0.5 + 0.4,
                char: SNOW_CHARS[Math.floor(Math.random() * SNOW_CHARS.length)],
                swingDuration: Math.random() * 3 + 2,
            }));
            setSnowflakes(flakes);
        } else {
            setSnowflakes([]);
        }
    }, [isSnowing]);

    const toggleSnow = () => {
        const newState = !isSnowing;
        setIsSnowing(newState);
        localStorage.setItem("letItSnow", String(newState));
    };

    return (
        <>
            {/* Snow Toggle Button */}
            <button
                onClick={toggleSnow}
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-lg transition-all hover:scale-105 active:scale-95"
                style={{
                    background: isSnowing
                        ? "linear-gradient(135deg, #38bdf8, #0ea5e9)"
                        : "linear-gradient(135deg, #64748b, #475569)",
                    color: "white",
                }}
            >
                <span className="text-lg">❄️</span>
                <span>
                    {isSnowing
                        ? (t("profile.stopSnow") || "Stop Snow")
                        : (t("profile.letItSnow") || "Let it Snow!")}
                </span>
            </button>

            {/* Snowflakes Container */}
            {isSnowing && (
                <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
                    {snowflakes.map((flake) => (
                        <div
                            key={flake.id}
                            className="absolute"
                            style={{
                                left: `${flake.x}%`,
                                top: "-20px",
                                fontSize: `${flake.size}px`,
                                opacity: flake.opacity,
                                animation: `snowFall ${flake.duration}s linear ${flake.delay}s infinite, snowSwing ${flake.swingDuration}s ease-in-out ${flake.delay}s infinite`,
                                color: "#fff",
                                textShadow: "0 0 4px rgba(200,220,255,0.9)",
                            }}
                        >
                            {flake.char}
                        </div>
                    ))}
                </div>
            )}

            {/* Keyframes Style */}
            <style jsx global>{`
                @keyframes snowFall {
                    0% {
                        transform: translateY(-20px);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh);
                        opacity: 0.3;
                    }
                }
                @keyframes snowSwing {
                    0%, 100% {
                        margin-left: 0px;
                    }
                    50% {
                        margin-left: 30px;
                    }
                }
            `}</style>
        </>
    );
}
