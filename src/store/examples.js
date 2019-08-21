import {createActionAsync, createReducerAsync} from 'redux-act-async';
import {getExamplesList} from "../api/generic_api";
import get from 'lodash.get';

// createActionAsync will create 4 synchronous action creators:
// login.request, login.ok, login.error and login.reset
export const fetchExamples = createActionAsync('EXAMPLES_LIST', getExamplesList);

// selectors
export const isLoadingExamples = state => state.loading;
export const getExamples = state => state.data;
export const getExamplesCount = state => get(state, 'data.length', undefined);

/*
createReducerAsync takes an async action created by createActionAsync.
It reduces the following state given the four actions:  request, ok, error and reset.
const defaultsState = {
    loading: false,
    request: null,
    data: null,
    error: null
};

if you need to overwrite the defaultsState just insert your initialState as a second paramenter in the createReducerAsync function. Just like that:

const initialState = {
    loading: false,
    request: null,
    data: {custom: "intitial data"},
    error: null
};
*/
const reducer = createReducerAsync(fetchExamples);

export default reducer;
