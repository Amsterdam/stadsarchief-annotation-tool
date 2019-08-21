import createSagaMiddleware from 'redux-saga'
import {configureStore, getDefaultMiddleware} from "redux-starter-kit";
import {combineReducers} from "redux";
import {combineSelectors} from "combine-selectors-redux";
import configReducer from './store/dynamicConfig';
import examplesReducer, * as examplesSelectors from './store/examples';
import filtersReducer, * as filtersSelectors from './store/filters';
import sagas from "./store/sagas";

const rootReducer = combineReducers({
  config: configReducer,
  examples: examplesReducer,
  filters: filtersReducer,
});

export const selectors = combineSelectors({
  examples: examplesSelectors,
  filters: filtersSelectors,
});

const sagaMiddleware = createSagaMiddleware();

export default () => {
  const store = configureStore({
      reducer: rootReducer,
      middleware: [...getDefaultMiddleware(), sagaMiddleware]
  });

  sagaMiddleware.run(sagas);

  return store
};

