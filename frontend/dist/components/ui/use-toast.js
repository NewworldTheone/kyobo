import * as React from "react";
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000;
const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
};
let count = 0;
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId) => {
    if (toastTimeouts.has(toastId))
        return;
    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId);
        dispatch({ type: "REMOVE_TOAST", toastId });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action) => {
    switch (action.type) {
        case "ADD_TOAST":
            return [action.toast, ...state].slice(0, TOAST_LIMIT);
        case "UPDATE_TOAST":
            return state.map(t => (t.id === action.toast.id ? { ...t, ...action.toast } : t));
        case "DISMISS_TOAST":
            if (action.toastId)
                addToRemoveQueue(action.toastId);
            else
                state.forEach(t => addToRemoveQueue(t.id));
            return state.map(t => (t.id === action.toastId || action.toastId === undefined ? { ...t, open: false } : t));
        case "REMOVE_TOAST":
            if (action.toastId === undefined)
                return [];
            return state.filter(t => t.id !== action.toastId);
        default:
            return state;
    }
};
const listeners = [];
let memoryState = [];
function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach(listener => listener(memoryState));
}
export function useToast() {
    const [state, setState] = React.useState(memoryState);
    React.useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (index > -1)
                listeners.splice(index, 1);
        };
    }, [state]);
    return {
        toast: React.useCallback((props) => {
            const id = `${count++}`;
            dispatch({ type: "ADD_TOAST", toast: { id, open: true, ...props } });
            return id;
        }, []),
        dismiss: React.useCallback((toastId) => dispatch({ type: "DISMISS_TOAST", toastId }), []),
        toasts: state,
    };
}
