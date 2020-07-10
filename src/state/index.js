import React, { createContext, useReducer } from 'react';

import { initialState } from '../constants/parameters'

const store = createContext(initialState)
const { Provider } = store

const StateProvider = ( { children } ) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch(action.type) {
      case 'TX':
        return { ...state, receipt: { ...action.payload } }
      case 'INIT':
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
