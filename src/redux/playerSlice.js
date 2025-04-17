// redux/playerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Player verisini çekme işlemi
export const fetchPlayer = createAsyncThunk(
    "player/fetchPlayer",
    async (playerId) => {
        const res = await fetch(
            `https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${playerId}`
        );
        const data = await res.json();
        return { playerId, playerData: data.players[0] };  // playerId'yi de ekliyoruz
    }
);

const playerSlice = createSlice({
    name: "player",
    initialState: {
        playersData: {},
        isLoading: false,
        error: null,
    },
    reducers: {
        clearPlayer: (state) => {
            state.playersData = {};
            state.isLoading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlayer.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPlayer.fulfilled, (state, action) => {
                const { playerId, playerData } = action.payload;
                state.playersData[playerId] = playerData; // playerId'ye göre veriyi saklıyoruz
                state.isLoading = false;
            })
            .addCase(fetchPlayer.rejected, (state, action) => {
                state.error = action.error.message;
                state.isLoading = false;
            });
    },
});

export const { clearPlayer } = playerSlice.actions;
export default playerSlice.reducer;
