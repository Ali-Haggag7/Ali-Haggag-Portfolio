import { useRef, useCallback, useEffect } from "react";

// Caches a stable () => void per string key, so memo bail-out is never
// defeated by inline arrow creation while always invoking the latest callback.
export function useStableMap(cb: (key: string) => void) {
    const cbRef = useRef(cb);
    const cache = useRef<Map<string, () => void>>(new Map());

    useEffect(() => {
        cbRef.current = cb;
    }, [cb]);

    return useCallback((key: string) => {
        if (!cache.current.has(key)) {
            cache.current.set(key, () => cbRef.current(key));
        }
        return cache.current.get(key)!;
    }, []);
}
