import {createSlice} from "redux-starter-kit";

const hostname = window.location.hostname;

const dynamicConfigSlice = createSlice({
  slice: 'dconfig',
  initialState: {
    IMAGE_HOST: `http://${hostname}:5000/`,
    API_HOST: `http://${hostname}:8000/`,
  },
  reducers: {
  }
});

// export const {} = dynamicConfigSlice.actions;

export default dynamicConfigSlice.reducer
