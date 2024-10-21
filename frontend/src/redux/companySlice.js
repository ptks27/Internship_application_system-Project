import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
  name: "company",
  initialState: {
    singleCompany: null,
    companies: [],
    searchCompanyByText: "",
  },
  reducers: {
    // actions
    setSingleCompany: (state, action) => {
      state.singleCompany = action.payload;
    },
    setAllCompany: (state, action) => {
      state.companies = action.payload;
    },
    setSearchCompanyByText: (state, action) => {
      state.searchCompanyByText = action.payload;
    },
    resetCompanyState: (state) => {
      state.singleCompany = null;
      state.companies = [];
      state.searchCompanyByText = "";
    },
  },
});

export const {
  setSingleCompany,
  setAllCompany,
  setSearchCompanyByText,
  resetCompanyState, // Export resetCompanyState action
} = companySlice.actions;
export default companySlice.reducer;
