import {createSlice} from "redux-starter-kit";

const filtersSlice = createSlice({
  slice: 'filters',
  initialState: {
    activeFilters: {},
    availableFilters: {
      type: ['aanvraag', 'besluit'],
      stadsdeel: ['SA', 'SU', 'ST'],
    }
  },
  reducers: {
    setFilter(state, action) {
      const { label, value } = action.payload;
      const { activeFilters } = state;
      activeFilters[label] = value;
    },
    clearFilter(state, action) {
      const { label } = action.payload;
      const { activeFilters } = state;
      delete activeFilters[label];
    }
  }
});

// selectors
export const getAvailableFilters = state => state.availableFilters;
export const getActiveFilters = state => state.activeFilters;

// actions
export const { clearFilter, setFilter } = filtersSlice.actions;

export default filtersSlice.reducer
