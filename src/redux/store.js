// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import driverStandingsReducer from './driverStandingsSlice';
import constructorStandingsReducer from "./constructorStandingsSlice";
import playerReducer from "./playerSlice";
import carouselReducer from "./carouselSlice";
import raceScheduleReducer from "./raceScheduleSlice";


export const store = configureStore({
    reducer: {
        driverStandings: driverStandingsReducer,
        constructorStandings: constructorStandingsReducer,
        player: playerReducer,
        carousel: carouselReducer,
        schedule: raceScheduleReducer,
    },
});
