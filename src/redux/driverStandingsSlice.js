import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchDriverStandings = createAsyncThunk(
  'driverStandings/fetchDriverStandings',
  async (yearOrSeason, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/${yearOrSeason}/driverStandings.json`);
      const data = await res.json();
      const currentList = data["MRData"].StandingsTable.StandingsLists[0];
      const standings = currentList.DriverStandings;
      const currentRound = parseInt(currentList.round);

      let prevStandings = [];
      if (currentRound > 1) {
        const prevRes = await fetch(`${BASE_URL}/${yearOrSeason}/${currentRound - 1}/driverStandings.json`);
        const prevData = await prevRes.json();
        prevStandings =
          prevData["MRData"].StandingsTable.StandingsLists[0]?.DriverStandings || [];
      }

      return {
        standings,
        prevStandings,
        round: currentRound,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue("Standings fetch failed.");
    }
  }
);

const driverStandingsSlice = createSlice({
  name: 'driverStandings',
  initialState: {
    standings: [],
    prevStandings: [],
    round: null,
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
        state.standings = action.payload.standings;
        state.prevStandings = action.payload.prevStandings;
        state.round = action.payload.round;
        state.isLoading = false;
      })
      .addCase(fetchDriverStandings.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setYear } = driverStandingsSlice.actions;
export default driverStandingsSlice.reducer;
