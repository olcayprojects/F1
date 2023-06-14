import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import QualifyingResults from "./QualifyingResults";
import Pitstops from "./Pitstops";
import Laptimes from "./Laptimes";
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

const F1Race = () => {
  const [sdata, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const handleTabChange = (e, tabIndex) => {
    setCurrentTabIndex(tabIndex);
  };

  let url = "";

  let season = "";
  let round = "";
  let laps = "";
  let navigate = useNavigate();
  const { season2 = "2023" } = useParams();
  const { rounds = 0 } = useParams();
  const date = (d) => new Date(d).toDateString();

  if (rounds === 0) {
    url = "https://ergast.com/api/f1/current/last/results.json";
  } else {
    url = `https://ergast.com/api/f1/${season2}/${rounds}/results.json`;
  }

  useEffect(() => {
    fetch(url)
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
  }, [url]);

  if (!isLoaded) {
    return <Loading />;
  } else {
    return (
      <>
        <Link to="/" className="btn btn-danger container-fluid p-0">
          <img
            src={require("../images/race-car.png")}
            className="img p-0 mx-0"
            style={{ maxWidth: "10%" }}
            alt=""
          />
        </Link>

        <div className="container.fluid bg-dark p-3">
          {sdata?.map((item, index) => {
            season = item.season;
            round = item.round;
            laps = item.Results[0].laps;
            const dateTime = (d, t) => new Date(d + " " + t).toLocaleString();

            return (
              <div key={index} className="bg-black pt-2 container-fluid">
                {/* {console.log(item)} */}

                <h1 className="text-center text-light bg-black border border-danger border-5">
                  {item.raceName} #{item.round} (
                  {item.time ? dateTime(item.date, item.time) : item.date})
                </h1>
                <div className="table-responsive-sm">
                  <table className="table table-dark table-striped border-5 ">
                    <thead className="text">
                      <tr className="text">
                        <th>P</th>
                        <th>G</th>
                        <th>DRIVER</th>
                        <th>CONSTRUCTOR</th>
                        <th>TIME</th>
                        <th>LAPS</th>
                        <th>FASTEST LAP</th>
                      </tr>
                    </thead>
                    <tbody className="text-danger">
                      {item.Results.map((result, index) => {
                        return (
                          <tr key={index} className="text-danger">
                            <td className="col">{result.positionText}</td>
                            <td className="col op">{result.grid}</td>
                            <td
                              className="col-6 cp text-nowrap"
                              onClick={() => {
                                navigate(
                                  "/ResultsDriver/" +
                                    item.season +
                                    "/" +
                                    result.Driver.driverId
                                );
                              }}
                            >
                              {result.Driver.code}(#{result.number})_
                              <b>
                                <u>
                                  {result.Driver.givenName}{" "}
                                  {result.Driver.familyName}
                                </u>
                              </b>
                              _({result.Driver.nationality}){" "}
                              {date(result.Driver.dateOfBirth)}
                            </td>
                            <td className="col op">{result.Constructor.name}</td>
                            <td className="col-2 text-wrap">
                              {result.Time?.time
                                ? result.Time.time
                                : result.status}
                            </td>
                            <td className="col op">{result.laps}</td>
                            <td
                              className={
                                "col-6 text-nowrap " +
                                (result.FastestLap?.rank === "1"
                                  ? "text-warning"
                                  : "")
                              }
                             
                            >
                              {" "}
                              (#<b>{result.FastestLap?.rank}</b>#){" "}
                              <b>{result.FastestLap?.Time.time}</b>{" "}
                              {result.FastestLap?.AverageSpeed?.speed}
                              kph {result.FastestLap?.lap}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <hr />
              </div>
            );
          })}

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
              borderRadius: 1,
              borderColor: "primary.main",
            }}
          >
            <Tab label="[Qualifying Results]" />
            <Tab label="[Pit Stops]" />
            <Tab label="[Lap Times]" />
          </Tabs>

          {currentTabIndex === 0 && (
            <Box
              sx={{
                p: 1,
              }}
            >
              <QualifyingResults season={season} round={round} />
            </Box>
          )}

          {currentTabIndex === 1 && (
            <Box sx={{ p: 1 }}>
              <Pitstops season={season} round={round} />
            </Box>
          )}

          {currentTabIndex === 2 && (
            <Box sx={{ p: 1 }}>
              <div className="bg-black container-fluid">
                <div className="row row-cols-1 row-cols-md-6 g-1 justify-content-md-center bg-black">
                  {(() => {
                    const arr = [];
                    for (let i = laps - 5; i <= laps; i++) {
                      arr.push(
                        <div key={i} className="col mb-0">
                          <Laptimes season={season} round={round} lapsx={i} />
                        </div>
                      );
                    }
                    return arr;
                  })()}
                </div>
                <hr />
              </div>
            </Box>
          )}
        </div>
      </>
    );
  }
};

export default F1Race;
