"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useAuth } from "../../../lib/auth";
import { useLanguage } from "../../../lib/i18n";
import { API_URL } from "../../../lib/api";
import EmptyState from "../../../components/EmptyState";
import Loading from "../../../components/Loading";
import { toast } from "react-hot-toast";

type Device = {
    id: number;
    device_id: string;
    device_name: string;
    last_active: string;
    is_active: boolean;
    created_at: string;
    is_current: boolean;
};

type PaginatedResponse<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
};

function getWSUrl() {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = new URL(API_URL).host;
    return `${protocol}//${host}`;
}

function getWebDeviceId(): string {
    if (typeof window === "undefined") return "";
    const existingId = localStorage.getItem("web_device_id");
    return existingId ? `web-${existingId}` : "";
}

export default function DevicesPage() {
    const { user, apiFetch, accessToken, logout } = useAuth();
    const { t } = useLanguage();
    const queryClient = useQueryClient();
    const wsRef = useRef<WebSocket | null>(null);

    const currentDeviceId = getWebDeviceId();

    const { data: response, isLoading } = useQuery({
        queryKey: ["devices"],
        queryFn: () =>
            apiFetch<PaginatedResponse<Device>>(
                `/devices${currentDeviceId ? `?current_device_id=${encodeURIComponent(currentDeviceId)}` : ""}`
            ),
        enabled: !!user,
    });

    const devices = response?.results || [];

    const terminateMutation = useMutation({
        mutationFn: (id: number) => apiFetch(`/devices/${id}/terminate`, { method: "POST" }),
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: ["devices"] });
            toast.success(t("devices.terminateSuccess") || "Session terminated successfully");
            // If the terminated device is the current one, log out
            const terminated = devices.find((d) => d.id === id);
            if (terminated && terminated.device_id === currentDeviceId) {
                logout();
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to terminate session");
        },
    });

    // WebSocket for real-time device updates
    useEffect(() => {
        let isMounted = true;

        const connectWs = () => {
            if (!accessToken || !isMounted) return;

            const wsUrl = getWSUrl();
            const ws = new WebSocket(`${wsUrl}/ws/user/?token=${accessToken}`);
            wsRef.current = ws;

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === "device_terminated") {
                        queryClient.invalidateQueries({ queryKey: ["devices"] });
                    }
                } catch { }
            };

            ws.onclose = () => {
                if (isMounted) {
                    setTimeout(connectWs, 3000);
                }
            };
        };

        connectWs();

        return () => {
            isMounted = false;
            wsRef.current?.close();
        };
    }, [accessToken, queryClient]);

    const handleTerminate = (device: Device) => {
        const message = device.is_current
            ? t("devices.terminateCurrentConfirm") || "This is your current session. Terminating it will log you out. Are you sure?"
            : t("devices.terminateConfirm") || "Are you sure you want to log out from this device?";

        if (confirm(message)) {
            terminateMutation.mutate(device.id);
        }
    };

    const getDeviceIcon = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes("iphone") || n.includes("android") || n.includes("phone") || n.includes("mobile")) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                    <path d="M12 18h.01" />
                </svg>
            );
        }
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
            </svg>
        );
    };

    if (isLoading) return <Loading />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">{t("devices.title") || "Devices"}</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        {t("devices.description") || "Manage devices where your account is currently logged in."}
                    </p>
                </div>
            </div>

            {!devices || devices.length === 0 ? (
                <EmptyState
                    title={t("devices.emptyTitle") || "No active devices"}
                    description={t("devices.emptyBody") || "You don't have any other active sessions."}
                />
            ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <ul role="list" className="divide-y divide-slate-100">
                        {devices.map((device) => (
                            <li
                                key={device.id}
                                className={`flex items-center justify-between gap-x-6 p-5 hover:bg-slate-50 ${device.is_current ? "bg-teal-50/30" : ""}`}
                            >
                                <div className="flex min-w-0 gap-x-4">
                                    <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-teal-50">
                                        {getDeviceIcon(device.device_name)}
                                    </div>
                                    <div className="min-w-0 flex-auto">
                                        <p className="text-sm font-semibold leading-6 text-slate-900">
                                            {device.device_name}
                                            {device.is_current && (
                                                <span className="ml-2 inline-flex items-center rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700">
                                                    {t("devices.currentDevice") || "This device"}
                                                </span>
                                            )}
                                        </p>
                                        <div className="flex items-center gap-x-2 text-xs leading-5 text-slate-500">
                                            <span>{new Date(device.last_active).toLocaleString()}</span>
                                            <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                            <span className={device.is_active ? "text-green-600" : "text-slate-400"}>
                                                {device.is_active
                                                    ? t("devices.active") || "Active"
                                                    : t("devices.inactive") || "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleTerminate(device)}
                                    disabled={terminateMutation.isPending}
                                    className="rounded-full p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                                    title={t("devices.terminate") || "Terminate session"}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18" />
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
