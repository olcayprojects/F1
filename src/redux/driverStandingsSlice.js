// redux/driverStandingsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Async thunk ile API'den veri çekiyoruz
export const fetchDriverStandings = createAsyncThunk(
  'driverStandings/fetchDriverStandings',
  async (year, thunkAPI) => {
    const res = await fetch(`${BASE_URL}/${year}/driverStandings.json`);
    const data = await res.json();
    return data["MRData"].StandingsTable.StandingsLists[0].DriverStandings;
  }
);

const driverStandingsSlice = createSlice({
  name: 'driverStandings',
  initialState: {
    standings: [],
    year: "2025",
    isLoading: false,
  },
  reducers: {
    setYear: (state, action) => {
      state.year = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDriverStandings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDriverStandings.fulfilled, (state, action) => {
        state.standings = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchDriverStandings.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setYear } = driverStandingsSlice.actions;
export default driverStandingsSlice.reducer;
