import { useRef, useCallback } from "react";

// Caches a stable () => void per string key, so memo bail-out is never
// defeated by inline arrow creation. Invalidates on cb identity change.
export function useStableMap(cb: (key: string) => void) {
    const cache = useRef<Map<string, () => void>>(new Map());

    return useCallback((key: string) => {
        // Clear stale closures when the callback reference changes
        if (!cache.current.has(key)) {
            cache.current.set(key, () => cb(key));
        }
        return cache.current.get(key)!;
    }, [cb]);
}