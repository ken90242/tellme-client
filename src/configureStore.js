import { createStore, applyMiddleware, compose } from "redux";

import { routerMiddleware, connectRouter } from "connected-react-router";

import { history } from "./history";

import rootReducer from "./reducers";

export default function configureStore() {
  const routerMiddlewaree = routerMiddleware(history);

  const middlewares = [routerMiddlewaree];
  const store = createStore(
    connectRouter(history)(rootReducer),
    compose(applyMiddleware(...middlewares))
  );
  return store;
}
