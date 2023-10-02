import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import QualifyingResults from "./QualifyingResults";
import Pitstops from "./Pitstops";
import Laptimes from "./Laptimes";
import Loading from "./Loading";
import { DrvInfo } from "./DriverInfo";
import { Box, Tab, Tabs } from "@mui/material";
import { red } from "@mui/material/colors";
import Team from "./Team";

const F1Race = (props) => {
  const [sdata, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  // const randomNumber = (min, max) =>
  //   Math.floor(Math.random() * (max - min + 1)) + min;

  const handleTabChange = (e, tabIndex) => {
    setCurrentTabIndex(tabIndex);
  };

  let season,
    round,
    laps = "";

  let navigate = useNavigate();
  const { season2 = "2023" } = useParams();
  const { rounds = 0 } = useParams();
  // const timeMS = (d) => new Date(d);

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
        <div className="container.fluid bg-black p-0">
          <Link
            to="/"
            className="abc btn btn-danger text-black container-fluid m-0 p-0"
          >
            <h1 className="">
              <span className="shadow fw-bold">F1 Race Results</span>
            </h1>
          </Link>
          {sdata?.map((item, indexItem) => {
            season = item.season;
            round = item.round;
            laps = item.Results[0].laps;
            const dateTime = (d, t) =>
              new Date(d + " " + t).toLocaleString("en-EN", {
                dateStyle: "full",
                timeStyle: "short",
              });

            return (
              <div
                key={indexItem}
                className="bg-black p-0 pt-1 container-fluid"
              >
                <h1 className="text-center text-warning font-monospace fst-italic fw-bold bg-black border border-danger border-5">
                  {item.raceName} #{item.round}{" "}
                  <i className="text-info bi bi-calendar3"></i>{" "}
                  {item.time ? dateTime(item.date, item.time) : item.date}{" "}
                  <i className="text-primary bi bi-calendar3"></i>
                </h1>
                <div className="table-responsive-md">
                  <table className="table table-dark table-striped">
                    <thead className="">
                      <tr className="">
                        <th className="bg-danger text-center">P</th>
                        <th className="text-center">G</th>
                        <th className="text-center bg-danger">NO</th>
                        <th className="">D R I V E R</th>
                        <th className="bg-danger">T E A M</th>
                        <th className="text-center">LAPS</th>
                        <th className="text-center bg-danger">TIME/RETIRED</th>
                        <th className="text-center">PTS</th>
                        <th className="text-center bg-danger"></th>
                        <th className="text-end">
                          <span className="text-decoration-underline text-primary">
                            FASTEST
                          </span>
                          <br />{" "}
                          <span className="border border-black border-2 px-1">
                            TIME
                          </span>{" "}
                          <i className="bi bi-forward-fill"></i>
                          <span className="bg-black text-white px-1">POS</span>
                        </th>
                        <th className="text-center bg-danger">LAP</th>
                        <th className="text-start">
                          <span className="text-decoration-underline text-primary">
                            LAPS
                          </span>
                          <br />
                          AVG SPEED
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-danger">
                      {item?.Results?.map((result, indexResult) => {
                        return (
                          <tr key={indexResult} className="align-middle">
                            <td className="text-center text-success p-0">
                              {result.positionText in [1, 2, 3, 4] ? (
                                result.positionText === "1" ? (
                                  <b className="text-info bg-black p-2">1</b>
                                ) : result.positionText === "2" ? (
                                  <b className="text-info bg-black p-2">2</b>
                                ) : result.positionText === "3" ? (
                                  <b className="text-info bg-black p-2">3</b>
                                ) : (
                                  ""
                                )
                              ) : (
                                <b>{result.positionText}</b>
                              )}
                            </td>
                            <td className="op text-center text-warning p-0">
                              <b>{result.grid}</b>
                            </td>
                            <td className="text-center text-light">
                              <b>{result.number}</b>
                            </td>

                            <td
                              className="col-3 cp p-0 op"
                              onClick={() => {
                                navigate(
                                  "/ResultsDriver/" + result.Driver.driverId
                                );
                              }}
                              title={
                                result.Driver?.givenName +
                                " " +
                                result.Driver?.familyName
                              }
                            >
                              <span className="text-info bg-black fw-bold p-1 fs-5">
                                {result.Driver?.givenName +
                                  " " +
                                  result.Driver?.familyName}
                              </span>
                              <span className="fs-5 fst-italic fw-bold text-secondary">
                                {" " + result.Driver?.nationality}
                              </span>
                              {(result.positionText in ["1", "2", "3", "4"]) &
                              (season2 === "2023") ? (
                                <span className="">
                                  <DrvInfo
                                    drv={
                                      result.Driver?.givenName +
                                      " " +
                                      result.Driver?.familyName
                                    }
                                  />
                                </span>
                              ) : (
                                ""
                              )}
                            </td>

                            <td
                              className="col-3 cp p-0 m-0"
                              title={result.Constructor.name}
                              onClick={() => {
                                navigate(
                                  "/ConstructorsResult/" +
                                    result?.Constructor?.constructorId +
                                    "/" +
                                    season
                                );
                              }}
                            >
                              {(result.positionText in ["1", "2", "3", "4"]) &
                              (season2 === "2023") ? (
                                <>
                                  <span className="bg-black text-success text-center fs-5 p-1 fw-bold">
                                    {result.Constructor.name}
                                  </span>
                                  <span className="d-inline-block px-2">
                                    <Team
                                      teamName={result.Constructor.name}
                                      ls={1}
                                    />
                                  </span>
                                  <span className="fw-bold text-secondary fs-5 text-center fst-italic">
                                    {" " + result.Constructor.nationality}
                                  </span>
                                </>
                              ) : (
                                <i className="fs-5">
                                  <span className="bg-black text-success fw-bold p-1">
                                    {result.Constructor.name}
                                  </span>
                                  <span className="fw-light fw-bold text-secondary">
                                    {" " + result.Constructor.nationality}
                                  </span>
                                </i>
                              )}
                            </td>
                            <td
                              className="op text-center fw-bold"
                              style={{ color: "yellowgreen" }}
                            >
                              {result.laps}
                            </td>
                            <td className="text-wrap text-center text-warning fw-bold p-0">
                              <span
                                className="bg-black p-2"
                                style={{
                                  width: "150px",
                                  display: "inline-block",
                                }}
                              >
                                {result.Time?.time
                                  ? result.Time.time
                                  : result.status}
                              </span>
                            </td>

                            <td
                              className="text-center fw-bold op"
                              style={
                                result.points > 0
                                  ? { color: "aquamarine" }
                                  : { color: "black" }
                              }
                            >
                              {result.points}
                            </td>
                            <td className=""></td>

                            <td
                              className={
                                "fw-bold op text-end cp p-0 " +
                                (result.FastestLap?.rank in ["1", "2", "3", "4"]
                                  ? "text-danger"
                                  : "")
                              }
                              onClick={() => {
                                navigate(
                                  "/Laps/" +
                                    result.Driver.driverId +
                                    "/" +
                                    season +
                                    "/" +
                                    round
                                );
                              }}
                            >
                              {result.FastestLap ? (
                                <span className="border p-1 border-black border-4 bg-black">
                                  {result.FastestLap?.Time.time}
                                </span>
                              ) : (
                                ""
                              )}
                              {result.FastestLap ? (
                                <i className="bi bi-forward-fill fs-5 px-1"></i>
                              ) : (
                                ""
                              )}
                              <span
                                className="bg-black p-2 text-center"
                                style={
                                  result.FastestLap?.rank
                                    ? {
                                        width: "35px",
                                        display: "inline-block",
                                      }
                                    : { display: "none" }
                                }
                              >
                                {result.FastestLap?.rank}
                              </span>
                            </td>
                            <td className="text-center text-warning">
                              {result.FastestLap?.lap}
                            </td>
                            <td className="op text-start p-0">
                              {result?.FastestLap?.AverageSpeed.speed ? (
                                <>
                                  <span className="fw-bold">
                                    {result?.FastestLap?.AverageSpeed.speed}{" "}
                                  </span>
                                  <span className="fst-italic text-secondary">
                                    {result?.FastestLap?.AverageSpeed.units}
                                  </span>
                                </>
                              ) : (
                                ""
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

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
              p: 0,
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
                pt: 1,
              }}
            >
              <QualifyingResults season={season} round={round} />
            </Box>
          )}

          {currentTabIndex === 1 && (
            <Box sx={{ pt: 1 }}>
              <Pitstops season={season} round={round} />
            </Box>
          )}

          {currentTabIndex === 2 && (
            <Box sx={{ p: 0 }}>
              <div className="bg-black container-fluid p-0">
                <div className="row row-cols-1 row-cols-md-6 g-1 justify-content-md-center bg-black">
                  {(() => {
                    const arr = [];
                    for (let i = laps - 11; i <= laps; i++) {
                      arr.push(
                        <div key={i} className="mb-0">
                          <Laptimes season={season} round={round} lapsx={i} />
                        </div>
                      );
                    }
                    return arr;
                  })()}
                </div>
              </div>
            </Box>
          )}
        </div>
      </>
    );
  }
};

export default F1Race;
