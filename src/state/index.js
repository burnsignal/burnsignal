import React, { createContext, useReducer } from 'react';

const initialState = { proposals: [] }
const store = createContext(initialState)
const { Provider } = store

const StateProvider = ( { children } ) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch(action.type) {
      case 'PROPOSAL':
        return { ...state, proposals: action.payload }
      default:
        return state
    };
  }, initialState)

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider }
