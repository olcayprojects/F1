// redux/constructorStandingsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchConstructorStandings = createAsyncThunk(
  "constructorStandings/fetchConstructorStandings",
  async (yearOrSeason) => {
    const url = `${BASE_URL}/${yearOrSeason}/constructorStandings.json`;
    const res = await fetch(url);
    const data = await res.json();
    return data["MRData"].StandingsTable.StandingsLists[0].ConstructorStandings;
  }
);

const constructorStandingsSlice = createSlice({
  name: "constructorStandings",
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
      .addCase(fetchConstructorStandings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchConstructorStandings.fulfilled, (state, action) => {
        state.standings = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchConstructorStandings.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setYear } = constructorStandingsSlice.actions;
export default constructorStandingsSlice.reducer;
