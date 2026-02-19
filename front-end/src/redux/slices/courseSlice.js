import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { courseAPI } from "../../services/api";

export const fetchCourses = createAsyncThunk("courses/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await courseAPI.getAll();
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch courses");
  }
});

export const fetchCourseById = createAsyncThunk("courses/fetchById", async (id, thunkAPI) => {
  try {
    const res = await courseAPI.getById(id);
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch course");
  }
});

const courseSlice = createSlice({
  name: "courses",
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentCourse: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCourses.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchCourses.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchCourseById.pending, (state) => { state.loading = true; })
      .addCase(fetchCourseById.fulfilled, (state, action) => { state.loading = false; state.current = action.payload; })
      .addCase(fetchCourseById.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;