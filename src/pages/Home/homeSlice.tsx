import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ReturnObj {
  id: number;
  [key: string]: any;
}

interface RootState {
  [key: string]: any;
}

interface Args {
  name: string;
}

export const asyncAction = createAsyncThunk<ReturnObj, Args, RootState>(
  "app/asyncAction",
  async (args, thunkApi) => {
    const { dispatch, getState, rejectWithValue } = thunkApi;
    return { id: 1 };
  }
);

const homeSlice = createSlice({
  name: "home",
  initialState: {
  },
  reducers: {

  },
  extraReducers: (build) =>
    build
      .addCase(asyncAction.fulfilled, (state, { payload }) => {})
      .addCase(asyncAction.rejected, (state, { payload }) => {}),
});

export const {  } = homeSlice.actions;

export default homeSlice.reducer;
