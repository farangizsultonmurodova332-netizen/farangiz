"use client";

import React from "react";
import { Download, Smartphone, Apple } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../../lib/i18n";

export default function DownloadPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-paper pt-24 pb-12 px-6 flex flex-col items-center justify-center">
            <div className="max-w-4xl w-full text-center space-y-8">

                {/* Header Section */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-ink tracking-tight">
                        Download <span className="text-primary">StartupSpace</span> App
                    </h1>
                    <p className="text-lg md:text-xl text-ink-muted max-w-2xl mx-auto">
                        Take your ideas with you. Connect, collaborate, and innovate on the go with our mobile application.
                    </p>
                </div>

                {/* Download Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-2xl mx-auto">

                    {/* Android Card */}
                    <div className="relative group bg-card border border-haze rounded-2xl p-8 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="absolute top-0 right-0 p-4">
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                Available Now
                            </span>
                        </div>
                        <div className="flex flex-col items-center space-y-6">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-600">
                                <Smartphone size={32} />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-bold text-ink">Android</h3>
                                <p className="text-ink-muted">Compatible with Android 8.0+</p>
                            </div>
                            <a
                                href="/farangiz.apk"
                                download
                                className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-lg shadow-lg shadow-primary/20"
                            >
                                <Download size={20} />
                                Download APK
                            </a>
                            <p className="text-xs text-ink-muted">Version 1.0.0 • ~40MB</p>
                        </div>
                    </div>

                    {/* iOS Card */}
                    <div className="relative group bg-card/50 border border-haze rounded-2xl p-8 shadow-sm opacity-80 cursor-not-allowed">
                        <div className="absolute top-0 right-0 p-4">
                            <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                Coming Soon
                            </span>
                        </div>
                        <div className="flex flex-col items-center space-y-6 grayscale">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                <Apple size={32} />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-bold text-ink">iOS</h3>
                                <p className="text-ink-muted">Compatible with iOS 14+</p>
                            </div>
                            <button disabled className="w-full btn-ghost border border-haze flex items-center justify-center gap-2 py-3 text-lg cursor-not-allowed">
                                <Download size={20} />
                                Join Waitlist
                            </button>
                            <p className="text-xs text-ink-muted">In Development</p>
                        </div>
                    </div>

                </div>

                {/* Back Link */}
                <div className="pt-8">
                    <Link href="/" className="text-primary hover:underline font-medium">
                        &larr; Back to Home
                    </Link>
                </div>

            </div>
        </div>
    );
}
