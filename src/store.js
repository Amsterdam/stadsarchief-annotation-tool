import dynamicConfig from './store/dynamicConfig';
import {configureStore} from "redux-starter-kit";
import {combineReducers} from "redux";


const rootReducer = combineReducers({
  config: dynamicConfig,
});

export default () => {
  const store = configureStore({
      reducer: rootReducer
  });
  return store
};
