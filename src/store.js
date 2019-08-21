import configReducer from './store/dynamicConfig';
import examplesReducer, * as examplesSelectors from './store/examples';
import filtersReducer, * as filtersSelectors from './store/filters';
import {configureStore} from "redux-starter-kit";
import {combineReducers} from "redux";
import {combineSelectors} from "combine-selectors-redux";

const rootReducer = combineReducers({
  config: configReducer,
  examples: examplesReducer,
  filters: filtersReducer,
});

export const selectors = combineSelectors({
  examples: examplesSelectors,
  filters: filtersSelectors,
});

export default () => {
  const store = configureStore({
      reducer: rootReducer
  });
  return store
};
