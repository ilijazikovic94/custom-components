import { createSlice } from "@reduxjs/toolkit"

interface LoaderState {
  isShown: boolean
}

const initialState: LoaderState = {
  isShown: false,
}

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    show(state) {
      state.isShown = true
    },
    hide(state) {
      state.isShown = false
    }
  }
})

export const { show, hide } = loaderSlice.actions;
export default loaderSlice.reducer;