import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    allJobsAgent: [],
    singleJob: null,
    searchJobByText: "",
    allAppliedJobs: [],
    searchQuery: "",
    salaryRange: [0, Infinity],
    isLoading: false,
  },
  reducers: {
    // actions
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },

    setAllJobsAgent: (state, action) => {
      state.allJobsAgent = action.payload;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },
    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },
    resetJobs: (state) => {
      state.allJobs = [];
      state.allJobsAgent = [];
      state.singleJob = null;
      state.searchJobByText = "";
      state.allAppliedJobs = [];
      state.searchQuery = "";
      state.salaryRange = [0, Infinity];
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSalaryRange(state, action) {
      state.salaryRange = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    updateJobBookmark: (state, action) => {
      const { jobId, isBookmarked } = action.payload;
      const job = state.allJobs.find((job) => job.job_id === jobId);
      if (job) {
        job.isBookmarked = isBookmarked;
      }
      // Re-sort jobs to show bookmarked jobs first
      state.allJobs.sort(
        (a, b) => (b.isBookmarked ? 1 : 0) - (a.isBookmarked ? 1 : 0)
      );
    },
    updateAppliedJobStatus: (state, action) => {
      const { applicationId, status } = action.payload;
      const job = state.allAppliedJobs.find(
        (job) => job.application_id === applicationId
      );
      if (job) {
        job.status = status;
      }
    },
  },
});

export const {
  setAllJobs,
  setSingleJob,
  setAllJobsAgent,
  setSearchJobByText,
  setAllAppliedJobs,
  resetJobs, // Make sure this is exported
  setSearchQuery,
  setSalaryRange,
  setIsLoading,
  updateJobBookmark,
  updateAppliedJobStatus,
} = jobSlice.actions;

export default jobSlice.reducer;
