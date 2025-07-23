export const createStore = <T>(initialState: T) => {
    let currentState: T = initialState;
    const listenerMap = new Map<string, ((state: T) => void)[]>();

    const getState = () => {
        return JSON.parse(JSON.stringify(currentState));
    };

    const setState = (callback: (state: T) => T | void, listener?: string) => {
        const newState = callback(currentState);
        if (newState) currentState = newState;
        if (listener) {
            listenerMap.get(listener)?.forEach((fn) => fn(currentState));
        }
    };

    const subscribe = (callback: (state: T) => void, listeners: string[]) => {
        listeners.forEach((key) => {
            if (!listenerMap.has(key)) {
                listenerMap.set(key, []);
            }
            listenerMap.get(key)?.push(callback);
        });
        return () => {
            listeners.forEach((key) => {
                listenerMap.set(key, listenerMap.get(key)?.filter((v) => v !== callback) || []);
            });
        };
    };

    return {
        getState,
        setState,
        subscribe,
    };
};
