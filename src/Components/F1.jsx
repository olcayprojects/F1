import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WinRacesInaSeason from "./WinRacesInaSeason";
import DriverStandings from "./DriverStandings";
import ConstructorStandings from "./ConstructorStandings";
import Next from "./Next";
import RaceSchedule from "./RaceSchedule";
import F1Race from "./F1Race";
import Carousel from "./Carousel";

import { Box, Tab, Tabs, TabContext, Select } from "@mui/material";
import { blue, red, cyan, grey } from "@mui/material/colors";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#3f50b5",
      dark: "#002884",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
});

const F1 = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const handleTabChange = (e, tabIndex) => {
    setCurrentTabIndex(tabIndex);
  };

  let round = "";
  let d = new Date();

  let navigate = useNavigate();
  const { season2 = "2023" } = useParams();
  const year = new Date().getFullYear();
  const years = Array.from(new Array(74), (val, index) => year - index);

  return (
    <>
      <div className="container-fluid bg-dark p-0">
        <Next />
        <Carousel />
        <F1Race />
        <select
          className="form-select bg-black text-danger border-danger border-5 shadow-none cp mb-1"
          onChange={(e) => {
            navigate(`/F1/${e.target.value}`);
            navigate(0);
          }}
        >
          <option value="" hidden>
            Select Year for Drivers and Constructors Winning Races In a Season
            1950 - {d.getFullYear()}
          </option>
          {years.map((year, index) => {
            return (
              <option key={`year${index}`} value={year}>
                {year}
              </option>
            );
          })}
        </select>
        <RaceSchedule season={season2} />
        <Tabs
          value={currentTabIndex}
          onChange={handleTabChange}
          centered
          variant="standard"
          sx={{
            "& .MuiTabs-indicator": { backgroundColor: "#FFFFFF" },
            "& .MuiTab-root": { color: red[500], fontSize: "20px" },
            "& .Mui-selected": { color: red[500], fontSize: "24px" },
            boxShadow: 4,
            p: 1,
            borderRadius: 1,
            borderColor: "primary.main",
          }}
        >
          <Tab label="[Races In a Season]" />
          <Tab label="[Driver Standings]" />
          <Tab label="[Constructor Standings]" />
        </Tabs>

        {currentTabIndex === 0 && (
          <Box
            sx={{
              p: 0,
            }}
          >
            <WinRacesInaSeason season={season2} />
          </Box>
        )}

        {currentTabIndex === 1 && (
          <Box sx={{ p: 0 }}>
            <DriverStandings season={season2} round={round} />
          </Box>
        )}

        {currentTabIndex === 2 && (
          <Box sx={{ p: 0 }}>
            <ConstructorStandings season={season2} round={round} />
          </Box>
        )}
      </div>
    </>
  );
};

export default F1;
