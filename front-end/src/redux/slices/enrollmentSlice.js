import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { enrollmentAPI } from "../../services/api";

export const fetchAllEnrollments = createAsyncThunk("enrollments/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await enrollmentAPI.getAll();
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

export const fetchMyEnrollments = createAsyncThunk("enrollments/fetchMy", async (_, thunkAPI) => {
  try {
    const res = await enrollmentAPI.getMy();
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

const enrollmentSlice = createSlice({
  name: "enrollments",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllEnrollments.pending, (state) => { state.loading = true; })
      .addCase(fetchAllEnrollments.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchAllEnrollments.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyEnrollments.pending, (state) => { state.loading = true; })
      .addCase(fetchMyEnrollments.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchMyEnrollments.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default enrollmentSlice.reducer;