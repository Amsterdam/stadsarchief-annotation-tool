import { put, select, takeLatest } from 'redux-saga/effects'

import {clearAllFilters, clearFilter, setFilter} from "./filters";
import {selectors} from "../store";
import {fetchExamples} from "./examples";

function* fetchExamplesGen() {
  const activeFilters = yield select(selectors.filters.getActiveFilters);
  const asyncAction = fetchExamples(activeFilters);
  yield put(asyncAction);
}

function* sagas() {
  yield takeLatest([
    clearAllFilters.type,
    clearFilter.type,
    setFilter.type,
  ], fetchExamplesGen);
}

export default sagas;
