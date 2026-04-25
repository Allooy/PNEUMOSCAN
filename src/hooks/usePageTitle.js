import { useEffect } from 'react';

/**
 * Custom hook to set the document title and meta description dynamically per route.
 * Appends " | PNEUMOSCAN" suffix so every page has a consistent brand signal.
 *
 * @param {string} title - Page-specific title (e.g. "Dashboard")
 * @param {string} [description] - Optional: unique meta description for the page
 * @param {string} [fullTitle] - Optional: override the full title without appending the suffix
 */
export function usePageTitle(title, description, fullTitle) {
    useEffect(() => {
        const previousTitle = document.title;
        const previousDescription = document.querySelector('meta[name="description"]')?.getAttribute('content');

        // 1. Update Title
        if (fullTitle) {
            document.title = fullTitle;
        } else {
            document.title = title ? `${title} | PNEUMOSCAN` : 'PNEUMOSCAN | AI-Powered Pneumonia Detection Platform';
        }

        // 2. Update Meta Description
        if (description) {
            let metaDescription = document.querySelector('meta[name="description"]');
            if (!metaDescription) {
                metaDescription = document.createElement('meta');
                metaDescription.setAttribute('name', 'description');
                document.head.appendChild(metaDescription);
            }
            metaDescription.setAttribute('content', description);
        }

        // 3. Update Canonical Link
        let canonicalLink = document.querySelector("link[rel='canonical']");
        if (!canonicalLink) {
            canonicalLink = document.createElement("link");
            canonicalLink.setAttribute("rel", "canonical");
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute("href", `https://pneumoscan.com${window.location.pathname}`);

        // Restore on unmount
        return () => {
            document.title = previousTitle;
            if (previousDescription) {
                const metaDescription = document.querySelector('meta[name="description"]');
                if (metaDescription) metaDescription.setAttribute('content', previousDescription);
            }
        };
    }, [title, description, fullTitle]);
}

export default usePageTitle;
