'use client';

import { useEffect, useRef } from 'react';
import posthog from 'posthog-js';

export function useSectionTracking(sectionName: string) {
    const ref = useRef<HTMLElement>(null);
    const tracked = useRef(false);

    useEffect(() => {
        if (!ref.current || tracked.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !tracked.current) {
                    posthog.capture('section_viewed', { section: sectionName });
                    tracked.current = true;
                    observer.disconnect();
                }
            },
            { threshold: 0.2 } // 20% of the section is visible
        );

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [sectionName]);

    return ref;
}
