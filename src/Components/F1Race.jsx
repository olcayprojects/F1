import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QualifyingResults from "./QualifyingResults";
import Pitstops from "./Pitstops";
import Loading from "./Loading";
import { DrvInfo } from "./DriverInfo";
import { Box, Tab, Tabs } from "@mui/material";
import { red } from "@mui/material/colors";
import AppBar from "@mui/material/AppBar";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BuildIcon from "@mui/icons-material/Build";
import ShowChartIcon from "@mui/icons-material/ShowChart";

import Team from "./Team";
import Nav from "./Nav";
import Events from "./Events";

// import RaceSimulationCanvas from "./RaceAndPitStopPage";

const F1Race = (props) => {
  const [sdata, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  // const randomNumber = (min, max) =>
  //   Math.floor(Math.random() * (max - min + 1)) + min;

  const handleTabChange = (e, tabIndex) => {
    setCurrentTabIndex(tabIndex);
  };

  let season, round;
  // ,laps

  let navigate = useNavigate();
  const { season2 = "2025" } = useParams();
  const { rounds = 0 } = useParams();
  // const timeMS = (d) => new Date(d);

  let urlx;

  if (rounds === 0) {
    urlx = `${BASE_URL}/current/last/results.json`;
  } else {
    urlx = `${BASE_URL}/${season2}/${rounds}/results.json`;
  }

  useEffect(() => {
    function fetchData() {
      setIsLoaded(false);
      fetch(urlx)
        .then((response) => response.json())
        .then((data) => {
          setIsLoaded(true);

          setData(data["MRData"].RaceTable.Races);
        })
        .catch((err) => {
          console.log(err);
          setIsLoaded(true);
        });
    }
    fetchData();
  }, [urlx]);

  if (!isLoaded) {
    return (
      <>
        <Nav />
        <Loading />
      </>
    );
  } else {
    return (
      <>
        <div className="container-fluid bg-black p-0">
          <Nav />
          {sdata.length > 0 ? (
            sdata?.map((item, indexItem) => {
              season = item.season;
              round = item.round;
              // laps = item.Results[0].laps;
              const dateTime = (d, t) =>
                new Date(d + " " + t).toLocaleString("en-EN", {
                  dateStyle: "full",
                  timeStyle: "short",
                });

              return (
                <div
                  key={indexItem}
                  className="container-fluid bg-black p-0 m-1"
                >
                  <h1 className="text-center fs-2 text-warning fst-italic fw-bold bg-dark border border-danger border-5">
                    {rounds === 0 ? (
                      <span className="text-danger">
                        Last Race <i className="bi bi-arrow-right-square"> </i>
                      </span>
                    ) : (
                      ""
                    )}
                    <span>
                      {item.raceName} #{item.round}
                    </span>
                    <i className="text-info bi bi-calendar3 ms-2">
                      <span className="px-2">
                        {item.time
                          ? dateTime(item.date, item.time)
                          : new Date(item.date).toDateString()}
                      </span>
                    </i>
                    <i className="text-info bi bi-calendar3"></i>
                  </h1>

                  {season2 > "1970" ? (
                    <div className="container-fluid" style={{}}>
                      {item?.Results?.map((result, indexResult) => {
                        return result.positionText in [1, 2, 3, 4] ? (
                          <div
                            key={indexResult}
                            className={
                              "  " +
                              (result.positionText === "1"
                                ? "d-flex justify-content-center"
                                : result.positionText === "2"
                                ? "float-start ps-5"
                                : "float-end pe-5")
                            }
                          >
                            <div
                              className="d-flex flex-column align-items-center"
                              style={{}}
                            >
                              <DrvInfo
                                drv={
                                  result.Driver?.givenName +
                                  " " +
                                  result.Driver?.familyName
                                }
                                s={"1"}
                              />
                              {season2 > "1970" && (
                                <Team
                                  teamName={result.Constructor.name}
                                  season={season2}
                                  ls={1}
                                />
                              )}
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : null}

                  {season2 > "1970" ? (
                    <Events
                      date={sdata[0]?.date}
                      name={sdata[0]?.raceName}
                      s={"2"}
                    />
                  ) : null}

                  <div className="table-responsive-sm">
                    <table className="myTable table table-dark table-striped table-bordered border-dark">
                      <thead className="">
                        <tr className="align-middle">
                          <th className="bg-light text-center text-black text-black op">
                            <span className="bg-black p-1 text-light">P</span>
                          </th>
                          <th
                            className="text-center text-black"
                            style={{ backgroundColor: "#74F0B6" }}
                          >
                            <span
                              className="bg-black p-1"
                              style={{ color: "#74F0B6" }}
                            >
                              G
                            </span>
                          </th>
                          <th
                            className="text-center text-black"
                            style={{ backgroundColor: "#FFF200" }}
                          >
                            <span className="bg-black text-warning p-1">
                              NO
                            </span>
                          </th>
                          <th
                            className="text-end text-black bg-info"
                            style={{ letterSpacing: "5px" }}
                          >
                            <span className="bg-black text-info p-1">
                              DRIVER
                            </span>
                          </th>
                          <th className="bg-primary text-black">
                            <span className="bg-black text-primary p-1 ">
                              T E A M
                            </span>
                          </th>
                          <th
                            className="text-center text-black op"
                            style={{ backgroundColor: "#DE3126" }}
                          >
                            <span className="bg-black text-danger p-1">
                              LAPS
                            </span>
                          </th>
                          <th
                            className="text-center text-black"
                            style={{ backgroundColor: "#86995B" }}
                          >
                            <span
                              className="bg-black p-1"
                              style={{ color: "#86995B" }}
                            >
                              TIME / RETIRED
                            </span>
                          </th>
                          <th
                            className="text-center text-black op"
                            style={{ backgroundColor: "aquamarine" }}
                          >
                            <span
                              className="bg-black p-1"
                              style={{ color: "aquamarine" }}
                            >
                              PTS
                            </span>
                          </th>
                          <th className="text-center text-black bg-secondary"></th>
                          <th className="text-end bg-success">
                            <span className="text-decoration-underline text-black">
                              F A S T E S T
                            </span>
                            <br />
                            <span className="bg-black text-light p-1 px-2">
                              POS
                            </span>
                            <i className="bi bi-forward-fill px-1 text-light"></i>
                            <span className="text-light bg-black p-1 px-2">
                              TIME
                            </span>
                          </th>
                          <th className="text-center bg-success text-warning">
                            <br />
                            LAP
                          </th>
                          <th className="text-start bg-success">
                            <span className="text-decoration-underline text-black">
                              L A P S
                            </span>
                            <br />
                            <span className="text-white">AVGSPEED</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="">
                        {item?.Results?.map((result, indexResult) => {
                          return (
                            <tr
                              key={indexResult}
                              className={
                                "align-middle" +
                                (indexResult === 0 ? " fs-6 fw-bold" : "")
                              }
                            >
                              <td className="text-center p-0">
                                {result.positionText in [1, 2, 3, 4] ? (
                                  result.positionText === "1" ? (
                                    <b className="text-black bg-danger px-2">
                                      1
                                    </b>
                                  ) : result.positionText === "2" ? (
                                    <b className="text-black bg-danger px-2">
                                      2
                                    </b>
                                  ) : result.positionText === "3" ? (
                                    <b className="text-black bg-danger px-2">
                                      3
                                    </b>
                                  ) : null
                                ) : !isNaN(+result.positionText) ? (
                                  <span className="fw-bold">
                                    {result.positionText}
                                  </span>
                                ) : (
                                  <>
                                    <span className="fw-bold">
                                      {result.position}
                                    </span>
                                    <span className="text-danger">
                                      ({result.positionText})
                                    </span>
                                  </>
                                )}
                              </td>
                              <td
                                className="op text-center p-0"
                                style={{ color: "#74F0B6" }}
                              >
                                <span>
                                  {result.grid - result.position === 0 ? (
                                    <i className="bi bi-dash"></i>
                                  ) : (result.grid === "0" ? 20 : result.grid) -
                                      result.position >
                                    0 ? (
                                    <i className="bi bi-chevron-up"></i>
                                  ) : (
                                    <i className="bi bi-chevron-down"></i>
                                  )}
                                  {/* {result.grid - result.position} */}

                                  {" " + result.grid + ""}
                                </span>
                              </td>
                              <td className="text-center text-warning p-0">
                                <span className="bg-black px-1">
                                  {result.number < 10 ? (
                                    <i
                                      className={
                                        "fs-5 bi bi-" +
                                        result.number +
                                        "-square-fill"
                                      }
                                    ></i>
                                  ) : (
                                    <>
                                      <i
                                        className={
                                          "fs-5 bi bi-" +
                                          result.number[0] +
                                          "-square-fill pe-1"
                                        }
                                      ></i>
                                      <i
                                        className={
                                          "fs-5 bi bi-" +
                                          result.number[1] +
                                          "-square-fill"
                                        }
                                      ></i>
                                    </>
                                  )}
                                </span>
                              </td>

                              <td
                                className="cp op p-0 p-1 text-end"
                                onClick={() => {
                                  navigate(
                                    "/ResultsDriver/" + result.Driver.driverId
                                  );
                                }}
                                title={
                                  "Click go to " +
                                  result.Driver?.givenName +
                                  " " +
                                  result.Driver?.familyName +
                                  " details"
                                }
                              >
                                <span className="text-info bg-black fw-bold px-1 p-1 ">
                                  {result.Driver?.givenName + " "}

                                  {result.Driver?.familyName.toUpperCase()}
                                </span>

                                <span className="fw-bold p-1 fst-italic text-black bg-info pe-2">
                                  {result.Driver?.nationality}
                                </span>
                              </td>

                              <td
                                className="cp p-0 ps-1"
                                title={
                                  "Click go to " +
                                  result.Constructor.name +
                                  " details"
                                }
                                onClick={() => {
                                  navigate(
                                    "/ConstructorsResult/" +
                                      result?.Constructor?.constructorId +
                                      "/" +
                                      season
                                  );
                                }}
                              >
                                <>
                                  <span className="bg-black text-primary fw-bold p-1 px-1">
                                    {result.Constructor.name.toUpperCase()}
                                  </span>
                                  <span className="bg-primary text-black p-1 pe-2 fw-bold fst-italic">
                                    {" " + result.Constructor.nationality}
                                  </span>
                                </>
                              </td>
                              <td
                                className="op text-center fw-bold"
                                style={{ color: "#DE3126" }}
                              >
                                <span className="d-block bg-black px-1">
                                  {result.laps}
                                </span>
                              </td>
                              <td className="text-wrap text-center fw-bold p-0 px-1">
                                <span
                                  className="bg-black w-100 d-inline-block"
                                  style={{ color: "#86995B" }}
                                >
                                  {result.Time?.time ? (
                                    result.Time.time[0] === "+" ? (
                                      <span className="">
                                        {result.Time.time}
                                      </span>
                                    ) : result.status !== "Finished" ? (
                                      <>
                                        {result.Time.time}
                                        <span className="text-danger ps-1">
                                          - {result.status.toUpperCase()}
                                        </span>
                                      </>
                                    ) : (
                                      result.Time.time
                                    )
                                  ) : result.status[0] === "+" ? (
                                    <span className="text-primary">
                                      {result.status}
                                    </span>
                                  ) : (
                                    <span className="text-danger">
                                      {result.status.toUpperCase()}
                                    </span>
                                  )}
                                </span>
                              </td>

                              <td
                                className="text-center fw-bold op p-0"
                                style={
                                  result.points > 0
                                    ? { color: "aquamarine" }
                                    : { color: "black" }
                                }
                              >
                                <span
                                  className={
                                    "d-block mx-1  " +
                                    (result.points > 0 ? "bg-black" : "")
                                  }
                                >
                                  {result.points}
                                </span>
                              </td>
                              <td className="bg-secondary"></td>

                              <td
                                className={
                                  "fw-bold op text-end pe-1 cp p-0 " +
                                  (result.FastestLap?.rank in
                                  ["1", "2", "3", "4"]
                                    ? "text-danger"
                                    : null)
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
                                  <>
                                    <span className="bg-black p-0 d-inline-block w-25 text-center">
                                      {result.FastestLap?.rank}.
                                    </span>
                                    <i className="bi bi-forward-fill fs-5 px-1"></i>
                                    <span className="px-3 p-0 bg-black">
                                      {result.FastestLap?.Time.time}
                                    </span>
                                  </>
                                ) : (
                                  <h3 className="text-center">-</h3>
                                )}
                              </td>
                              <td className="text-center fw-bold text-warning p-0">
                                {result.FastestLap?.lap ? (
                                  result.FastestLap?.lap
                                ) : (
                                  <h3>-</h3>
                                )}
                              </td>
                              <td className="op text-start p-0">
                                {result?.FastestLap?.AverageSpeed?.speed ? (
                                  <>
                                    <span className="ms-1 fw-bold">
                                      {result?.FastestLap?.AverageSpeed.speed}{" "}
                                    </span>
                                    <span className="fst-italic text-secondary">
                                      {result?.FastestLap?.AverageSpeed.units}
                                    </span>
                                  </>
                                ) : (
                                  <h3 className="text-center">-</h3>
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
            })
          ) : (
            <h2 className="text-center">
              Season:{season2} Round#{rounds}
            </h2>
          )}
          <Box sx={{ pt: 1 }}>
            <AppBar position="static">
              <Tabs
                className="bg-dark"
                value={currentTabIndex}
                onChange={handleTabChange}
                variant="fullWidth" // Scrollable yaparak küçük ekranlarda yatay kaydırma ekliyoruz
                scrollButtons="auto" // Yatay kaydırma için oklar ekliyoruz
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
                  label="Qualifying"
                />
                <Tab
                  icon={<BuildIcon />}
                  iconPosition="start"
                  label="Pit Stops"
                />
                <Tab
                  icon={<ShowChartIcon />}
                  iconPosition="start"
                  label="Lap Times"
                />
              </Tabs>
            </AppBar>
            {currentTabIndex === 0 && (
              <div className="container-fluid p-0">
                <QualifyingResults season={season} round={round} />
              </div>
            )}
            {currentTabIndex === 1 && (
              <div className="container-fluid p-0">
                <Pitstops season={season} round={round} />
              </div>
            )}
            {currentTabIndex === 2 && (
              <div className="container-fluid p-0">
                {/* Laptimes içeriği burada */}
                {/* <Laptimes season={season} round={round} laps={laps} lapsx={1} /> */}
              </div>
            )}
          </Box>
        </div>
      </>
    );
  }
};

export default F1Race;
