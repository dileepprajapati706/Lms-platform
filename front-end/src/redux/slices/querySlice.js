import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { queryAPI } from "../../services/api";

export const fetchAllQueries = createAsyncThunk("queries/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await queryAPI.getAll();
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

export const fetchMyQueries = createAsyncThunk("queries/fetchMy", async (_, thunkAPI) => {
  try {
    const res = await queryAPI.getMy();
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

const querySlice = createSlice({
  name: "queries",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllQueries.pending, (state) => { state.loading = true; })
      .addCase(fetchAllQueries.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchAllQueries.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyQueries.pending, (state) => { state.loading = true; })
      .addCase(fetchMyQueries.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchMyQueries.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default querySlice.reducer;