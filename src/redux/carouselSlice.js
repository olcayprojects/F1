import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCarouselTeams = createAsyncThunk(
  "carousel/fetchCarouselTeams",
  async () => {
    const res = await fetch(
      "https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=Formula 1"
    );
    const data = await res.json();
    return data.teams;
  }
);

const carouselSlice = createSlice({
  name: "carousel",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarouselTeams.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCarouselTeams.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchCarouselTeams.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      });
  },
});

export default carouselSlice.reducer;
