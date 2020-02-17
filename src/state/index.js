import React, { createContext, useReducer } from 'react';

const initialState = { polls: [], web3: undefined, auth: false, verified: false }
const store = createContext(initialState)
const { Provider } = store

const StateProvider = ( { children } ) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch(action.type) {
      case 'POLL':
        return { ...state, ...action.payload }
      case 'WEB3':
        return { ...state, ...action.payload }
      default:
        return state
    };
  }, initialState)

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider }
