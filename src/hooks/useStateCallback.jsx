import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 让 React Hoot useState 支持回调操作
 */
export function useStateCallback(initialState) {
    const [state, setState] = useState(initialState);
    const cbRef = useRef(null);

    const setStateCallback = useCallback((state, cb) => {
        cbRef.current = cb;
        setState(state);
    }, []);

    useEffect(() => {
        if (cbRef.current) {
            cbRef.current(state);
            cbRef.current = null;
        }
    }, [state]);

    return [state, setStateCallback];
}
