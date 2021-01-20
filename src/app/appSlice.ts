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
    const { getState, rejectWithValue } = thunkApi;
    return { id: 1 };
  }
);

const appSlice = createSlice({
  name: "app",
  initialState: {
    count: 0,
  },
  reducers: {
    actionCase: (state, { payload }: PayloadAction<any>) => {},
    add: (state) => {
      state.count++;
    },
  },
  extraReducers: (build) =>
    build
      .addCase(asyncAction.fulfilled, (state, { payload }) => {
        state.count = 1;
      })
      .addCase(asyncAction.rejected, (state, { payload }) => {}),
});

export const { actionCase, add } = appSlice.actions;

export default appSlice.reducer;
