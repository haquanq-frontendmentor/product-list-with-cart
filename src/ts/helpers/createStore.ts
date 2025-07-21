export const createStore = <T>(initialState: T) => {
    let currentState: T = initialState;
    const listenerMap = new Map<string, ((state: T) => void)[]>();

    const getState = () => {
        return currentState;
    };

    const setState = (callback: (state: T) => T | void, listener?: string) => {
        const newState = callback(currentState);
        if (newState) currentState = newState;
        if (listener) {
            listenerMap.get(listener)?.forEach((fn) => fn(currentState));
        }
    };

    const subscribe = (callback: (state: T) => void, listener: string) => {
        if (!listenerMap.has(listener)) {
            listenerMap.set(listener, []);
        }
        listenerMap.get(listener)?.push(callback);
    };

    return {
        getState,
        setState,
        subscribe,
    };
};
