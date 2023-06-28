import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import QualifyingResults from "./QualifyingResults";
import Pitstops from "./Pitstops";
import Laptimes from "./Laptimes";
import Loading from "./Loading";
import { DrvInfo } from "./DriverInfo";
import Team from "./Team";
import { Box, Tab, Tabs } from "@mui/material";
import { red } from "@mui/material/colors";

const F1Race = (props) => {
  const [sdata, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  // const randomNumber = (min, max) =>
  //   Math.floor(Math.random() * (max - min + 1)) + min;

  const handleTabChange = (e, tabIndex) => {
    setCurrentTabIndex(tabIndex);
  };

  let season = "";
  let round = "";
  let laps = "";

  let navigate = useNavigate();
  const { season2 = "2023" } = useParams();
  const { rounds = 0 } = useParams();
  // const date = (d) => new Date(d).toDateString();

  let urlx;
  if (rounds === 0) {
    urlx = "https://ergast.com/api/f1/current/last/results.json";
  } else {
    urlx = `https://ergast.com/api/f1/${season2}/${rounds}/results.json`;
  }

  useEffect(() => {
    function fetchData() {
      fetch(urlx)
        .then((response) => response.json())
        .then((data) => {
          setIsLoaded(true);

          setData(data["MRData"].RaceTable.Races);

          //  console.log(sdata);
        })
        .catch((err) => {
          if (!err === "Unexpected token") {
            console.log(err.message);
          }
        });
    }
    fetchData();
  }, [urlx]);

  if (!isLoaded) {
    return <Loading />;
  } else {
    return (
      <>
        <div className="container.fluid bg-dark p-3">
          {sdata?.map((item, index) => {
            season = item.season;
            round = item.round;
            laps = item.Results[0].laps;
            const dateTime = (d, t) => new Date(d + " " + t).toLocaleString();

            return (
              <div key={index} className="bg-black pt-2 container-fluid">
                {/* {console.log(item)} */}

                <h1 className="text-center text-danger bg-black border border-danger border-5">
                  {item.raceName} #{item.round} (
                  {item.time ? dateTime(item.date, item.time) : item.date})
                </h1>
                <div className="table-responsive-md">
                  <table className="table table-dark table-striped">
                    <thead className="text">
                      <tr className="">
                        <th className="bg-danger text-center">P</th>
                        <th className="bg-danger text-center">G</th>
                        <th className="text-center bg-danger">DRIVER</th>
                        <th className="bg-danger text-center">CONSTRUCTOR</th>
                        <th className="bg-danger text-center">LAPS</th>
                        <th className="text-center bg-danger">TIME</th>
                        <th className="text-center bg-danger">PTS</th>
                        <th className="text-center bg-danger">FASTEST LAP</th>
                      </tr>
                    </thead>
                    <tbody className="text-danger">
                      {item?.Results?.map((result, index) => {
                        return (
                          <tr key={index} className="text-danger">
                            <td className="align-middle col text-center">
                              <b>{result.positionText}</b>
                            </td>
                            <td className="align-middle col op text-center">
                              {result.grid}
                            </td>

                            <td
                              className="align-middle col cp"
                              onClick={() => {
                                navigate(
                                  "/ResultsDriver/" + result.Driver.driverId
                                );
                              }}
                            >
                              {(result.positionText in ["1", "2", "3", "4"]) &
                              (season2 === "2023") ? (
                                <DrvInfo
                                  drv={
                                    result.Driver?.givenName +
                                    " " +
                                    result.Driver?.familyName
                                  }
                                />
                              ) : (
                                ""
                              )}

                              {result.Driver?.givenName +
                                " " +
                                result.Driver?.familyName +
                                " - " +
                                result.Driver?.nationality}
                            </td>

                            <td
                              className="align-middle text-center col-3 op p-0"
                              title={result.Constructor.name}
                            >
                              {(result.positionText in ["1", "2", "3", "4"]) &
                              (season2 === "2023") ? (
                                <Team teamName={result?.Constructor.name} />
                              ) : (
                                ""
                              )}
                              {result.Constructor.name} -{" "}
                              {result.Constructor.nationality}
                            </td>
                            <td className="align-middle col text-center">
                              {result.laps}
                            </td>
                            <td className="align-middle col op text-wrap text-center">
                              {result.Time?.time
                                ? result.Time.time
                                : result.status}
                            </td>
                            <td className="align-middle col text-center">
                              {result.points}
                            </td>

                            <td
                              className={
                                "align-middle op text-nowrap " +
                                (result.FastestLap?.rank in ["1", "2", "3", "4"]
                                  ? "text-danger "
                                  : "")
                              }
                            >
                              {result.FastestLap
                                ? "_" +
                                  result.FastestLap.rank +
                                  "_TIME(" +
                                  result.FastestLap?.Time.time +
                                  ") AVG SPEED(" +
                                  result.FastestLap?.AverageSpeed?.speed +
                                  ") LAP(" +
                                  result.FastestLap?.lap +
                                  ")"
                                : ""}
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
              "& .MuiTab-root": { color: red[500], fontSize: "20px" },
              "& .Mui-selected": { color: red[500], fontSize: "24px" },
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
                <div className="row row-cols-1 row-cols-md-5 g-1 justify-content-md-center bg-black">
                  {(() => {
                    const arr = [];
                    for (let i = laps - 4; i <= laps; i++) {
                      arr.push(
                        <div key={i} className="mb-0">
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
          <Link to="/" className="p-0">
            <img
              src={
                "https://www.thesportsdb.com/images/media/team/jersey/2f0s8q1679829159.png"
              }
              className="img-fluid p-0 mx-auto d-block"
              style={{ objectFit: "cover", width: "500px", height: "200px" }}
              alt=""
            />
          </Link>
        </div>
      </>
    );
  }
};

export default F1Race;
