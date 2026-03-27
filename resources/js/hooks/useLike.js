import { useState, useCallback } from 'react';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';

export function useLike(placeId, initialLiked, initialCount) {
    const [liked, setLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);
    const [loading, setLoading] = useState(false);
    const { auth } = usePage().props;

    const toggle = useCallback(() => {
        if (!auth?.user) {
            router.visit('/login');
            return;
        }

        if (loading) return;

        setLiked(prev => !prev);
        setCount(prev => liked ? prev - 1 : prev + 1);
        setLoading(true);

        axios.post(`/lugares/${placeId}/likes`)
            .then(res => {
                setLiked(res.data.liked);
                setCount(res.data.count);
            })
            .catch(() => {
                setLiked(prev => !prev);
                setCount(prev => liked ? prev + 1 : prev - 1);
            })
            .finally(() => setLoading(false));
    }, [placeId, liked, loading, auth]);

    return { liked, count, toggle, loading };
}
