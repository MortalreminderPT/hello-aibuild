import { createSlice } from '@reduxjs/toolkit';

const schoolSlice = createSlice({
  name: 'schools',
  initialState: {
    schools: [],
    tip: "Press the button to fetch School.",
    loading: false,
    error: null,
  },
  reducers: {
    fetchSchoolSuccess: (state, action) => {
      state.schools = action.payload.map(s => ({
        ...s,
        address: `${s.street}, ${s.suburb}, ${s.state}`,
        icsea: s.icsea == -1 ? "/" : s.icsea,
        atar: s.atar == -1 ? "/" : s.atar,
        distance: Math.floor(s.distance)
      }));
      state.tip = "You fetched with Saga!";
      state.loading = false;
      state.error = null;
    },
    fetchSchoolFailure: (state, action) => {
      state.error = "Error: request rejected";
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  }
});

export default schoolSlice.reducer;

export const { fetchSchoolSuccess, fetchSchoolFailure, setLoading } = schoolSlice.actions;