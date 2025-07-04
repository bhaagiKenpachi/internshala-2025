import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export function useRedirect(condition: boolean, targetPath: string, delay: number = 100) {
    const router = useRouter();
    const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const hasRedirectedRef = useRef(false);

    useEffect(() => {
        // Clear any existing timeout
        if (redirectTimeoutRef.current) {
            clearTimeout(redirectTimeoutRef.current);
        }

        // Only redirect if condition is true and we haven't already redirected
        if (condition && !hasRedirectedRef.current) {
            hasRedirectedRef.current = true;

            redirectTimeoutRef.current = setTimeout(() => {
                router.push(targetPath);
            }, delay);
        }

        // Reset the flag when condition becomes false
        if (!condition) {
            hasRedirectedRef.current = false;
        }

        return () => {
            if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current);
            }
        };
    }, [condition, targetPath, router, delay]);

    return hasRedirectedRef.current;
} 