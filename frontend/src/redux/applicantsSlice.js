import { createSlice } from "@reduxjs/toolkit";

const applicantsSlice = createSlice({
    name: "application",
    initialState: {
        applicants: [],
    },
    reducers: {
        setAllApplicants: (state, action) => {
            state.applicants = action.payload;
        },
        updateApplicantStatus: (state, action) => {
            const { id, status } = action.payload;
            const applicantIndex = state.applicants.findIndex(applicant => applicant.application_id === id);
            if (applicantIndex !== -1) {
                state.applicants[applicantIndex].status = status;
            }
        },
        // New reducer to reset applicants
        resetApplicants: (state) => {
            state.applicants = [];
        }
    }
})

// Export the new reducer
export const { setAllApplicants, updateApplicantStatus, resetApplicants } = applicantsSlice.actions;

export default applicantsSlice.reducer;
