import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchConstructorStandings = createAsyncThunk(
  "constructorStandings/fetchConstructorStandings",
  async (yearOrSeason, { dispatch }) => {
    const url = `${BASE_URL}/${yearOrSeason}/constructorStandings.json`;
    const res = await fetch(url);
    const data = await res.json();

    const standingsList = data.MRData.StandingsTable.StandingsLists[0];
    const round = parseInt(standingsList?.round || "0");
    const standings = standingsList?.ConstructorStandings || [];

    if (round > 1) {
      dispatch(
        fetchConstructorStandingsByRound({
          season: yearOrSeason,
          round: round - 1,
        })
      );
    }

    return { standings, round };
  }
);

export const fetchConstructorStandingsByRound = createAsyncThunk(
  "constructorStandings/fetchConstructorStandingsByRound",
  async ({ season, round }) => {
    const url = `${BASE_URL}/${season}/${round}/constructorStandings.json`;
    const res = await fetch(url);
    const data = await res.json();
    return (
      data["MRData"].StandingsTable.StandingsLists[0]?.ConstructorStandings || []
    );
  }
);

const constructorStandingsSlice = createSlice({
  name: "constructorStandings",
  initialState: {
    standings: [],
    prevStandings: [],
    year: "2026",
    round: 0,
    isLoading: false,
  },
  reducers: {
    setYear: (state, action) => {
      state.year = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConstructorStandings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchConstructorStandings.fulfilled, (state, action) => {
        state.standings = action.payload.standings;
        state.round = action.payload.round;
        state.isLoading = false;
      })
      .addCase(fetchConstructorStandings.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchConstructorStandingsByRound.fulfilled, (state, action) => {
        state.prevStandings = action.payload;
      });
  },
});

export const { setYear } = constructorStandingsSlice.actions;
export default constructorStandingsSlice.reducer;
