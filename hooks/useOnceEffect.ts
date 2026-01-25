import { useEffect, useRef } from 'react';

/**
 * A custom hook to prevent duplicate API calls in React Strict Mode
 * This ensures that the effect callback only runs once per dependency change
 * even in development mode where Strict Mode intentionally renders components twice
 *
 * Uses useRef instead of useState to avoid triggering re-renders
 *
 * @param effect - The imperative function to run
 * @param deps - The dependency array
 *
 * @example
 * useOnceEffect(() => {
 *   async function fetchData() {
 *     const data = await api.getData();
 *     setState(data);
 *   }
 *   fetchData();
 * }, [id]);
 */
export function useOnceEffect(
    effect: () => (() => void) | void,
    deps: React.DependencyList
) {
    const hasRunRef = useRef<boolean>(false);

    // Reset the flag when dependencies change
    useEffect(() => {
        hasRunRef.current = false;
    }, deps);

    useEffect(() => {
        // Skip if already run with these dependencies
        if (hasRunRef.current) {
            return;
        }

        hasRunRef.current = true;

        // Run the effect and get cleanup function
        const cleanup = effect();

        // Return cleanup function
        return () => {
            if (cleanup && typeof cleanup === 'function') {
                cleanup();
            }
        };
    }, deps);
}

/**
 * A simpler version that just prevents the effect from running twice in Strict Mode
 * Use this for simple effects that don't need complex cleanup
 */
export function useStrictModeEffect(
    effect: () => void | (() => void),
    deps: React.DependencyList
) {
    const hasRunRef = useRef(false);

    // Reset when dependencies change
    useEffect(() => {
        hasRunRef.current = false;
    }, deps);

    useEffect(() => {
        if (hasRunRef.current) {
            return;
        }

        hasRunRef.current = true;

        const cleanup = effect();

        return () => {
            if (cleanup && typeof cleanup === 'function') {
                cleanup();
            }
        };
    }, deps);
}
