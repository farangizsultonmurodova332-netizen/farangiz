"use client";

import { useCall as useCallContext } from "../context/CallContext";

export function useCall() {
    return useCallContext();
}
