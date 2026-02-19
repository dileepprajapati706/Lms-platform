import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { feedbackAPI } from "../../services/api";

export const fetchAllFeedbacks = createAsyncThunk("feedbacks/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await feedbackAPI.getAll();
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

export const fetchMyFeedbacks = createAsyncThunk("feedbacks/fetchMy", async (_, thunkAPI) => {
  try {
    const res = await feedbackAPI.getMy();
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

const feedbackSlice = createSlice({
  name: "feedbacks",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFeedbacks.pending, (state) => { state.loading = true; })
      .addCase(fetchAllFeedbacks.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchAllFeedbacks.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyFeedbacks.pending, (state) => { state.loading = true; })
      .addCase(fetchMyFeedbacks.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchMyFeedbacks.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default feedbackSlice.reducer;