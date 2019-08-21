import {createSlice} from "redux-starter-kit";

const filtersSlice = createSlice({
  slice: 'filters',
  initialState: {
    activeFilters: {},
    availableFilters: {
      type: ['aanvraag', 'besluit'],
      stadsdeel: ['SA', 'SU', 'ST'],
      dossier_nummer: ['13325', '9061'],
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
    },
    clearAllFilters(state, action) {
      state.activeFilters = {}
    }
  }
});

// selectors
export const getAvailableFilters = state => state.availableFilters;
export const getActiveFilters = state => state.activeFilters;

// actions
export const { clearAllFilters, clearFilter, setFilter } = filtersSlice.actions;

export default filtersSlice.reducer
