import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import LearnerLogin from "./pages/auth/LearnerLogin";
import LearnerRegister from "./pages/auth/LearnerRegister";

import OwnerDashboard from "./pages/dashboard/OwnerDashboard";
import TrainerDashboard from "./pages/dashboard/TrainerDashboard";
import LearnerDashboard from "./pages/dashboard/LearnerDashboard";

import InternalUserList from "./pages/internalUsers/InternalUserList";
import InternalUserForm from "./pages/internalUsers/InternalUserForm";

import LearnerList from "./pages/learners/LearnerList";
import LearnerProfile from "./pages/learners/LearnerProfile";

import CourseList from "./pages/courses/CourseList";
import CourseForm from "./pages/courses/CourseForm";
import CourseDetail from "./pages/courses/CourseDetail";

import LectureList from "./pages/lectures/LectureList";
import LectureForm from "./pages/lectures/LectureForm";

import EnrollmentList from "./pages/enrollments/EnrollmentList";
import PaymentList from "./pages/payments/PaymentList";

import FeedbackList from "./pages/feedbacks/FeedbackList";
import FeedbackForm from "./pages/feedbacks/FeedbackForm";

import QueryList from "./pages/queries/QueryList";
import QueryForm from "./pages/queries/QueryForm";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/learner/login" element={<LearnerLogin />} />
        <Route path="/learner/register" element={<LearnerRegister />} />

        {/* Owner Routes */}
        <Route path="/owner" element={<ProtectedRoute roles={["OWNER"]}><Layout /></ProtectedRoute>}>
          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route path="internal-users" element={<InternalUserList />} />
          <Route path="internal-users/add" element={<InternalUserForm />} />
          <Route path="internal-users/edit/:id" element={<InternalUserForm />} />
          <Route path="learners" element={<LearnerList />} />
          <Route path="courses" element={<CourseList />} />
          <Route path="courses/add" element={<CourseForm />} />
          <Route path="courses/edit/:id" element={<CourseForm />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route path="lectures" element={<LectureList />} />
          <Route path="lectures/add" element={<LectureForm />} />
          <Route path="lectures/edit/:id" element={<LectureForm />} />
          <Route path="enrollments" element={<EnrollmentList />} />
          <Route path="payments" element={<PaymentList />} />
          <Route path="feedbacks" element={<FeedbackList />} />
          <Route path="queries" element={<QueryList />} />
        </Route>

        {/* Trainer Routes */}
        <Route path="/trainer" element={<ProtectedRoute roles={["TRAINER"]}><Layout /></ProtectedRoute>}>
          <Route path="dashboard" element={<TrainerDashboard />} />
          <Route path="courses" element={<CourseList />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route path="lectures" element={<LectureList />} />
          <Route path="lectures/add" element={<LectureForm />} />
          <Route path="lectures/edit/:id" element={<LectureForm />} />
          <Route path="enrollments" element={<EnrollmentList />} />
          <Route path="feedbacks" element={<FeedbackList />} />
          <Route path="queries" element={<QueryList />} />
        </Route>

        {/* Learner Routes */}
        <Route path="/learner" element={<ProtectedRoute roles={["LEARNER"]}><Layout /></ProtectedRoute>}>
          <Route path="dashboard" element={<LearnerDashboard />} />
          <Route path="profile" element={<LearnerProfile />} />
          <Route path="courses" element={<CourseList />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route path="my-enrollments" element={<EnrollmentList />} />
          <Route path="my-payments" element={<PaymentList />} />
          <Route path="feedbacks" element={<FeedbackList />} />
          <Route path="feedbacks/add" element={<FeedbackForm />} />
          <Route path="feedbacks/edit/:id" element={<FeedbackForm />} />
          <Route path="queries" element={<QueryList />} />
          <Route path="queries/add" element={<QueryForm />} />
          <Route path="queries/edit/:id" element={<QueryForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;