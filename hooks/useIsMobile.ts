"use client";

import { useState, useEffect } from "react";

// Shared mobile breakpoint detector — matchMedia based, SSR-safe.
// Returns false on the server and on first client render to avoid
// hydration mismatches, then updates after mount.
const MOBILE_QUERY = "(max-width: 767px)";

export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia(MOBILE_QUERY);
        const update = () => setIsMobile(mql.matches);
        update();
        mql.addEventListener("change", update);
        return () => mql.removeEventListener("change", update);
    }, []);

    return isMobile;
}
