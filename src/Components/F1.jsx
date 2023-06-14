import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WinRacesInaSeason from "./WinRacesInaSeason";
import DriverStandings from "./DriverStandings";
import ConstructorStandings from "./ConstructorStandings";
import Next from "./Next";
import RaceSchedule from "./RaceSchedule";
import F1Race from "./F1Race";
import Loading from "./Loading";

import { Box, Tab, Tabs, TabContext } from "@mui/material";
import { blue, red, cyan } from "@mui/material/colors";

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
  const [isLoaded, setIsLoaded] = useState(false);

  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const handleTabChange = (e, tabIndex) => {
    setCurrentTabIndex(tabIndex);
  };

  const [sdata, setData] = useState([]);
  let round = "";
  let navigate = useNavigate();
  const { season2 = "2023" } = useParams();

  const year = new Date().getFullYear();
  const years = Array.from(new Array(74), (val, index) => year - index);

  useEffect(() => {
    fetch("https://ergast.com/api/f1/current/last/results.json")
      .then((response) => response.json())
      .then((data) => {
        setIsLoaded(true);

        setData(data["MRData"].RaceTable.Races);
        // console.log(data["MRData"].RaceTable.Races[0].raceName);
      })
      .catch((err) => {
        setIsLoaded(true);

        console.log(err.message);
      });
  }, []);

  if (!isLoaded) {
    return <Loading />;
  } else {
    return (
      <>
        <div className="container.fluid bg-dark p-3">
          <Next />
          <RaceSchedule season={season2} />
          <F1Race />
          <select
            className="form-select bg-dark text-danger border-danger shadow-none"
            onChange={(e) => {
              navigate(`/F1/${e.target.value}`);
              navigate(0);
            }}
          >
            <option value="" hidden>
              Select Year for Drivers and Constructors Winning Races In a Season
              1950 - Now
            </option>
            {years.map((year, index) => {
              return (
                <option key={`year${index}`} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
          <h1 className="text-black bg-danger text-center p-0 m-0">{season2}</h1>
          <Tabs
            value={currentTabIndex}
            onChange={handleTabChange}
            centered
            variant="standard"
            sx={{
              "& .MuiTabs-indicator": { backgroundColor: "#FFFFFF" },
              "& .MuiTab-root": { color: red[500], fontSize: "22px" },
              "& .Mui-selected": { color: "#FFFF", fontSize: "22px" },
              boxShadow: 4,
              p: 1,
              borderRadius: 0,
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
  }
};

export default F1;
