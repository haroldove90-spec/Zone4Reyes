
import { useState, useEffect } from 'react';

const parseHash = (hash: string) => {
    const path = hash.substring(1) || '/'; // Remove # and default to /
    const [pageWithParams, queryString] = path.split('?');
    const parts = pageWithParams.split('/').filter(p => p);
    const page = parts[0] || 'feed';
    const id = parts[1] || undefined;
    
    const queryParams = new URLSearchParams(queryString);
    const params: Record<string, string> = { id: id || '' };
    queryParams.forEach((value, key) => {
        params[key] = value;
    });

    return { page, params };
}


export const useRouter = () => {
    const [route, setRoute] = useState(() => parseHash(window.location.hash));

    useEffect(() => {
        const handleHashChange = () => {
            setRoute(parseHash(window.location.hash));
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    return route;
};
