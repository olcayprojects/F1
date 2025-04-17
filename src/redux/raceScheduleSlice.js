// redux/raceScheduleSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchRaceSchedule = createAsyncThunk(
  "schedule/fetchRaceSchedule",
  async (season) => {
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const res = await fetch(`${BASE_URL}/${season}.json`);
    const data = await res.json();
    return data?.MRData?.RaceTable?.Races || [];
  }
);

const raceScheduleSlice = createSlice({
  name: "schedule",
  initialState: {
    races: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRaceSchedule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRaceSchedule.fulfilled, (state, action) => {
        state.races = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchRaceSchedule.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      });
  },
});

export default raceScheduleSlice.reducer;
