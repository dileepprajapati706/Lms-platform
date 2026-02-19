import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { paymentAPI } from "../../services/api";

export const fetchAllPayments = createAsyncThunk("payments/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await paymentAPI.getAll();
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

export const fetchMyPayments = createAsyncThunk("payments/fetchMy", async (_, thunkAPI) => {
  try {
    const res = await paymentAPI.getMy();
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

const paymentSlice = createSlice({
  name: "payments",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPayments.pending, (state) => { state.loading = true; })
      .addCase(fetchAllPayments.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchAllPayments.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyPayments.pending, (state) => { state.loading = true; })
      .addCase(fetchMyPayments.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchMyPayments.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default paymentSlice.reducer;