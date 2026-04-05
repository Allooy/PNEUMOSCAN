import { useEffect } from 'react';

/**
 * Custom hook to set the document title dynamically per route.
 * Appends " | PNEUMOSCAN" suffix so every page has a consistent brand signal.
 *
 * @param {string} title - Page-specific title (e.g. "Dashboard")
 * @param {string} [fullTitle] - Optional: override the full title without appending the suffix
 */
export function usePageTitle(title, fullTitle) {
    useEffect(() => {
        const previousTitle = document.title;

        if (fullTitle) {
            document.title = fullTitle;
        } else {
            document.title = title ? `${title} | PNEUMOSCAN` : 'PNEUMOSCAN | AI-Powered Pneumonia Detection Platform';
        }

        // Restore on unmount (good practice for modals or nested routes)
        return () => {
            document.title = previousTitle;
        };
    }, [title, fullTitle]);
}

export default usePageTitle;
