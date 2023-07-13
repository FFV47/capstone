import { useReducer } from "react";

function reducer<T>(state: T, payload: Partial<T>) {
  return {
    ...state,
    ...payload,
  };
}

export type StateReducerDispatch<T> = React.Dispatch<Partial<T>>;

export default function useStateReducer<T>(initialState: T) {
  const [state, dispatch] = useReducer(reducer<T>, initialState);
  return [state, dispatch] as const;
}
