import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { lectureAPI } from "../../services/api";

export const fetchLectures = createAsyncThunk("lectures/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await lectureAPI.getAll();
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

export const fetchMyLectures = createAsyncThunk("lectures/fetchMy", async (_, thunkAPI) => {
  try {
    const res = await lectureAPI.getMyLectures();
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

export const fetchLecturesByCourse = createAsyncThunk("lectures/fetchByCourse", async (courseId, thunkAPI) => {
  try {
    const res = await lectureAPI.getByCourse(courseId);
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

const lectureSlice = createSlice({
  name: "lectures",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLectures.pending, (state) => { state.loading = true; })
      .addCase(fetchLectures.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchLectures.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyLectures.pending, (state) => { state.loading = true; })
      .addCase(fetchMyLectures.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchMyLectures.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchLecturesByCourse.pending, (state) => { state.loading = true; })
      .addCase(fetchLecturesByCourse.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchLecturesByCourse.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default lectureSlice.reducer;