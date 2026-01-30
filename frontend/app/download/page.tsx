"use client";

import React from "react";
import { Download } from "lucide-react";

export default function DownloadPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full bg-card rounded-2xl shadow-xl p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                    <Download className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Mobil Ilovani Yuklab Oling
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Android qurilmangiz uchun maxsus ilovani yuklab oling va barcha imkoniyatlardan foydalaning.
                    </p>
                </div>

                <div className="pt-4">
                    <a
                        href="/app-release.apk"
                        download
                        className="group relative inline-flex items-center justify-center w-full px-8 py-4 text-lg font-medium text-white transition-all duration-200 bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        <Download className="w-6 h-6 mr-2 transition-transform group-hover:animate-bounce" />
                        APK faylni yuklab olish
                    </a>
                    <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                        Hajmi: ~25 MB • Versiya: 1.0.0
                    </p>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-6 mt-6">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-2">
                        O'rnatish bo'yicha qo'llanma:
                    </h3>
                    <ol className="text-sm text-gray-600 dark:text-gray-400 text-left space-y-2 list-decimal pl-5">
                        <li>APK faylni yuklab oling.</li>
                        <li>Faylni oching va "O'rnatish" tugmasini bosing.</li>
                        <li>Agar so'rasa, noma'lum manbalardan o'rnatishga ruxsat bering.</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
