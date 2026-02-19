import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import courseReducer from "./slices/courseSlice";
import lectureReducer from "./slices/lectureSlice";
import enrollmentReducer from "./slices/enrollmentSlice";
import paymentReducer from "./slices/paymentSlice";
import feedbackReducer from "./slices/feedbackSlice";
import queryReducer from "./slices/querySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    lectures: lectureReducer,
    enrollments: enrollmentReducer,
    payments: paymentReducer,
    feedbacks: feedbackReducer,
    queries: queryReducer,
  },
});