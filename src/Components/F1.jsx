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
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BuildIcon from "@mui/icons-material/Build";
import ShowChartIcon from "@mui/icons-material/ShowChart";

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

  return (
    <>
      <div className="container-fluid bg-black p-0">
        <div className="mb-2">
          <Next />
          <Carousel />
        </div>

        {season2 === "2025" ? <F1Race /> : <Nav />}

        <select
          className="form-select bg-black text-danger fs-3 text-center shadow-none cp mb-1"
          onChange={(e) => {
            navigate(`/F1/${e.target.value}`);
            navigate(0);
          }}
        >
          {" "}
          <option value="" hidden>
            Select Year for Drivers and Constructors Winning Races In a Season
            1950 - {d.getFullYear()}
          </option>
          {Array.from(
            { length: d.getFullYear() - 1950 + 1 },
            (_, index) => d.getFullYear() - index
          ).map((yearOption) => (
            <option key={yearOption} value={yearOption}>
              {yearOption}
            </option>
          ))}
        </select>
        <RaceSchedule season={season2} />
        <Tabs
          className="bg-dark"
          centered
          value={currentTabIndex}
          onChange={handleTabChange}
          variant="fullWidth" //  Yatay kaydırma
          scrollButtons="auto" // Yatay kaydırma için oklar
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "white",
              height: "4px",
            },
            "& .MuiTab-root": {
              color: "red",
              backgroundColor: "darkred",
              fontSize: "18px",
              fontWeight: "bold",
              textTransform: "",
              transition: "all 0.3s",
              border: 2,
              borderColor: "black",

              "&:hover": {
                color: "white",
                backgroundColor: "red",
                borderRadius: 3,
              },
            },
            "& .Mui-selected": {
              color: "#FFFFFF",
              fontSize: "20px",
              fontWeight: "bold",
              backgroundColor: "#B71C1C",
              borderRadius: 1,
            },
            boxShadow: 4,
            mt: 1,
            p: 0,
            borderRadius: 3,
            "@media (max-width: 600px)": {
              "& .MuiTab-root": {
                fontSize: "10px",
              },
              "& .Mui-selected": {
                fontSize: "12px",
              },
            },
          }}
        >
          <Tab
            icon={<DirectionsCarIcon />}
            iconPosition="start"
            label="Races In a Season"
          />
          <Tab
            icon={<ShowChartIcon />}
            iconPosition="start"
            label="Driver Standings"
          />
          <Tab
            icon={<ShowChartIcon />}
            iconPosition="start"
            label="Constructor Standings"
          />
          <Tab
            icon={<DirectionsCarIcon />}
            iconPosition="start"
            label="All Results"
          />
        </Tabs>

        {/* Tab içeriği */}
        <Box sx={{ pt: 0 }}>
          {currentTabIndex === 0 && <WinRacesInaSeason season={season2} />}
          {currentTabIndex === 1 && (
            <DriverStandings season={season2} round={round} tab="1" />
          )}
          {currentTabIndex === 2 && (
            <ConstructorStandings season={season2} round={round} tab={1} />
          )}
          {currentTabIndex === 3 && <Results season={season2} />}
        </Box>
      </div>
    </>
  );
};

export default F1;
