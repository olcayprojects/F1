import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WinRacesInaSeason from "./WinRacesInaSeason";
import DriverStandings from "./DriverStandings";
import ConstructorStandings from "./ConstructorStandings";
import Next from "./Next";
import RaceSchedule from "./RaceSchedule";
import F1Race from "./F1Race";
import Carousel from "./Carousel";
import Results from "./Results";
import Nav from "./Nav";

import { Box, Tab, Tabs } from "@mui/material";
// import { Box, Tab, Tabs, TabContext, Select } from "@mui/material";
import { red } from "@mui/material/colors";
// import { blue, red, cyan, grey } from "@mui/material/colors";
// import { createTheme } from "@mui/material/styles";

// const theme = createTheme({
//   palette: {
//     primary: {
//       light: "#757ce8",
//       main: "#3f50b5",
//       dark: "#002884",
//       contrastText: "#fff",
//     },
//     secondary: {
//       light: "#ff7961",
//       main: "#f44336",
//       dark: "#ba000d",
//       contrastText: "#000",
//     },
//   },
// });

const F1 = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const handleTabChange = (e, tabIndex) => {
    setCurrentTabIndex(tabIndex);
  };

  let round = "";
  let d = new Date();

  let navigate = useNavigate();
  const { season2 = "2025" } = useParams();
  const year = new Date().getFullYear();
  const years = Array.from(new Array(75), (val, index) => year - index);

  return (
    <>
      <div className="container-fluid bg-black p-0">
        <Next />
        <Carousel />

        {season2 === "2025" ? <F1Race /> : <Nav />}

        <select
          className="form-select bg-black text-danger fs-3 text-center shadow-none cp mb-1"
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
          className="bg-dark"
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
            borderColor: "primary.dark",
          }}
        >
          <Tab label="[Races In a Season]" />
          <Tab label="[Driver Standings]" />
          <Tab label="[Constructor]" />
          <Tab label="[All Results] " />
        </Tabs>

        {currentTabIndex === 0 && (
          <Box
            sx={{
              pt: 1,
            }}
          >
            <WinRacesInaSeason season={season2} />
          </Box>
        )}

        {currentTabIndex === 1 && (
          <Box sx={{ pt: 1 }}>
            <DriverStandings season={season2} round={round} tab="1" />
          </Box>
        )}

        {currentTabIndex === 2 && (
          <Box sx={{ pt: 1 }}>
            <ConstructorStandings season={season2} round={round} tab={1} />
          </Box>
        )}
        {currentTabIndex === 3 && (
          <Box sx={{ pt: 0 }}>
            <Results season={season2} />
          </Box>
        )}
      </div>
    </>
  );
};

export default F1;
