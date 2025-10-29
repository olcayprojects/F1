import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QualifyingResults from "./QualifyingResults";
import Pitstops from "./Pitstops";
import Laptimes from "./Laptimes";
import Loading from "./Loading";
import { DrvInfo } from "./DriverInfo";
import { Box, Tab, Tabs } from "@mui/material";
import { red } from "@mui/material/colors";
import AppBar from "@mui/material/AppBar";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BuildIcon from "@mui/icons-material/Build";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import LastRace from "./LastRace";
import { RaceThumb } from "./RaceInfo";

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

  let yearNow = new Date().getFullYear();

  let navigate = useNavigate();
  const { season2 = yearNow } = useParams();
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

          setData(data["MRData"].RaceTable);
        })
        .catch((err) => {
          // console.log(err);
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
          {sdata?.Races?.length > 0 ? (
            sdata?.Races?.map((item, indexItem) => {
              season = sdata?.season;
              round = sdata?.round;
              // laps = item.Results[0].laps;
              const dateTime = (d, t) =>
                new Date(d + " " + t).toLocaleString("en-EN", {
                  dateStyle: "full",
                  timeStyle: "short",
                });

              return (
                <div key={indexItem} className="container-fluid bg-black p-0">
                  <h4 className=" text-center text-warning fst-italic fw-bold bg-dark bg-gradient">
                    {rounds === 0 ? (
                      <span className="text-dark-emphasis fw-bold animate__animated animate__slow animate__flash animate__infinite">
                        Last Race
                        <i className="px-2 bi bi-arrow-right"></i>
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
                  </h4>

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
                              className="d-flex flex-column align-items-center
                              "
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
                      date={sdata?.Races[0]?.date}
                      name={sdata?.Races[0]?.raceName}
                      s={"2"}
                    />
                  ) : null}

                  <div className="table-responsive-sm">
                    <table className="myTable table table-dark table-striped table-bordered border-dark text-nowrap">
                      <thead className="">
                        {/* Üst Satır */}
                        <tr className="align-bottom fs-6">
                          <th rowSpan={2} className="bg-light text-center op">
                            <span className="p-1 text-light bg-black">P</span>
                          </th>
                          <th rowSpan={2} className="text-center bg-success">
                            <span className="text-success p-1 bg-black">G</span>
                          </th>
                          <th rowSpan={2} className="text-center bg-warning">
                            <span className="text-warning p-1 bg-black">
                              NO
                            </span>
                          </th>
                          <th
                            rowSpan={2}
                            className="text-end bg-info"
                            style={{ letterSpacing: "5px" }}
                          >
                            <span className="text-info p-1 bg-black">
                              DRIVER
                            </span>
                          </th>
                          <th rowSpan={2} className="bg-primary">
                            <span className="text-primary p-1 bg-black">
                              T E A M
                            </span>
                          </th>
                          <th
                            rowSpan={2}
                            className="text-center op bg-danger p-0"
                          >
                            <span className="text-danger bg-black p-1">L</span>
                          </th>
                          <th
                            rowSpan={2}
                            className="text-center text-black p-0"
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
                            rowSpan={2}
                            className="text-center text-black op p-0"
                            style={{ backgroundColor: "aquamarine" }}
                          >
                            <span
                              className="bg-black p-1"
                              style={{ color: "aquamarine" }}
                            >
                              PT
                            </span>
                          </th>

                          {season > 2004 ? (
                            <>
                              <th
                                rowSpan={2}
                                className="bg-secondary p-0 m-0"
                              ></th>

                              {/* FASTEST başlığı 4 sütuna yayılacak */}

                              <th
                                colSpan={season2 !== yearNow ? 4 : 3}
                                className="text-center text-black bg-success  p-0"
                              >
                                <h6
                                  className="text-black fw-bold m-0"
                                  style={{ letterSpacing: "2px" }}
                                >
                                  FASTEST LAPS
                                </h6>
                              </th>
                            </>
                          ) : null}
                        </tr>

                        {/* Alt Satır (FASTEST altındaki sütunlar) */}

                        {season > 2004 ? (
                          <>
                            <tr className="align-bottom">
                              <th className="text-center p-0">
                                <span className="text-light">P</span>
                              </th>
                              <th className="text-center text-info p-0">
                                TIME
                              </th>
                              <th className="text-center text-success p-0">
                                LAP
                              </th>
                              {Number(season2) !== yearNow ? (
                                <th className="text-start">
                                  <span className="text-white">AVGSPEED</span>
                                </th>
                              ) : null}
                            </tr>
                          </>
                        ) : null}
                      </thead>

                      <tbody className="">
                        {item?.Results?.map((result, indexResult) => {
                          return (
                            <tr
                              key={indexResult}
                              className={
                                "align-middle" +
                                (indexResult === 0 ? " fs-5 fw-bold" : "")
                              }
                            >
                              <td className="text-center p-0 rounded-4">
                                {["1", "2", "3"].includes(
                                  result.positionText
                                ) ? (
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
                                    <i className="bi bi-dash-circle-dotted"></i>
                                  ) : (result.grid === "0" ? 20 : result.grid) -
                                      result.position >
                                    0 ? (
                                    <i className="bi bi-caret-up"></i>
                                  ) : (
                                    <i className="bi bi-caret-down"></i>
                                  )}
                                  {/* {result.grid - result.position} */}

                                  {" " + result.grid + ""}
                                </span>
                              </td>
                              <td className="text-center text-warning">
                                {(() => {
                                  const drvNumber = result?.number;
                                  const drvNumberDigits = drvNumber
                                    ? drvNumber.split("")
                                    : [];

                                  const isNumber = (value) => !isNaN(value);

                                  return (
                                    <>
                                      {drvNumberDigits.map((item, index) => {
                                        if (isNumber(item)) {
                                          return (
                                            <i
                                              key={index}
                                              className={`bi bi-${item}-circle fs-5`}
                                            />
                                          );
                                        }
                                        return result?.number;
                                      })}
                                    </>
                                  );
                                })()}
                              </td>

                              <td
                                className="cp op"
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
                                <span className="text-info bg-black fw-bold px-1 bg-gradient">
                                  {result.Driver?.givenName + " "}

                                  {result.Driver?.familyName.toUpperCase()}
                                </span>
                                <p className="d-inline text-dark-emphasis bg-black bg-gradient px-1 small-text">
                                  {`${result.Driver?.dateOfBirth}`}
                                </p>

                                <span className="fw-bold px-1 fst-italic text-black bg-info pe-2">
                                  {result.Driver?.nationality}
                                </span>
                              </td>

                              <td
                                className="cp"
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
                                  <span className="bg-black text-primary fw-bold px-1 bg-gradient">
                                    {result.Constructor.name.toUpperCase()}
                                  </span>
                                  <span className="bg-primary text-black pe-2 fw-bold fst-italic">
                                    {" " + result.Constructor.nationality}
                                  </span>
                                </>
                              </td>
                              <td
                                className="op text-center fw-bold p-0"
                                style={{ color: "#DE3126" }}
                              >
                                <span className="d-block bg-black bg-gradient">
                                  {result.laps}
                                </span>
                              </td>
                              <td className="text-wrap text-center fw-bold m-0 p-0 px-1">
                                <span
                                  className="bg-black w-100 p-0 d-inline-block bg-gradient"
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
                                className="text-center fw-bold op m-0 p-0"
                                style={
                                  result.points > 0
                                    ? { color: "aquamarine" }
                                    : { color: "black" }
                                }
                              >
                                <span
                                  className={
                                    "d-block  bg-gradient " +
                                    (result.points > 0 ? "bg-black" : "")
                                  }
                                >
                                  {result.points}
                                </span>
                              </td>
                              {season > 2004 ? (
                                <>
                                  <td className="bg-success px-1"></td>

                                  <td
                                    className={
                                      "fw-bold op text-center p-0 m-0 cp " +
                                      (["1", "2", "3"].includes(
                                        result.FastestLap?.rank
                                      )
                                        ? " text-danger fst-italic"
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
                                    {result.FastestLap
                                      ? result.FastestLap?.rank
                                      : null}
                                  </td>

                                  <td className="text-center m-0 p-0 fw-bold text-info">
                                    {result.FastestLap?.Time
                                      ? result.FastestLap?.Time.time
                                      : null}
                                  </td>
                                  <td className="text-center m-0 p-0 fw-bold text-success">
                                    {result.FastestLap?.lap
                                      ? result.FastestLap?.lap
                                      : null}
                                  </td>
                                  {Number(season2) !== yearNow && (
                                    <td className="op text-start">
                                      {result?.FastestLap?.AverageSpeed
                                        ?.speed ? (
                                        <>
                                          <span className="ms-1 fw-bold">
                                            {
                                              result?.FastestLap?.AverageSpeed
                                                .speed
                                            }{" "}
                                          </span>
                                          <span className="fst-italic text-secondary">
                                            {
                                              result?.FastestLap?.AverageSpeed
                                                .units
                                            }
                                          </span>
                                        </>
                                      ) : null}
                                    </td>
                                  )}
                                </>
                              ) : null}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {/* <RaceThumb
                    date={sdata?.Races[0]?.date}
                    name={sdata?.Races[0]?.raceName}
                    s={1}
                  /> */}
                </div>
              );
            })
          ) : (
            <div className="container">
              <LastRace />
              <h4 className="text-success text-center bi-hourglass-split">
                "The final race information is currently being prepared. Please
                check back shortly."
              </h4>
            </div>
          )}

          <Tabs
            className="bg-dark"
            value={currentTabIndex}
            onChange={handleTabChange}
            variant="fullWidth"
            scrollButtons="auto"
            sx={{
              height: "30px",
              minHeight: "30px",
              "& .MuiTabs-indicator": {
                backgroundColor: "aqua",
                height: "2px",
              },
              "& .MuiButtonBase-root": {
                height: "30px",
                minHeight: "30px",
              },
              "& .MuiTab-root": {
                color: "red",
                backgroundColor: "darkred",
                fontSize: "12px",
                fontWeight: "",
                textTransform: "",
                transition: "all 0.3s",
                border: 2,
                borderColor: "black",

                "&:hover": {
                  color: "white",
                  backgroundColor: "red",
                },
              },
              "& .Mui-selected": {
                color: "white",
                fontSize: "14px",
                fontWeight: "bold",
                backgroundColor: "red",
              },
              boxShadow: 4,
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
            <Tab icon={<BuildIcon />} iconPosition="start" label="Pit Stops" />
            <Tab
              icon={<ShowChartIcon />}
              iconPosition="start"
              label="Lap Times"
            />
          </Tabs>
          <Box sx={{ pt: 1 }}>
            {currentTabIndex === 0 && (
              <div className="container-fluid p-0">
                <QualifyingResults
                  season={season ? season : sdata.season}
                  round={round ? round : sdata.round}
                />
              </div>
            )}
            {currentTabIndex === 1 && (
              <div className="container-fluid p-0">
                <Pitstops
                  season={season ? season : sdata.season}
                  round={round ? round : sdata.round}
                />
              </div>
            )}
            {currentTabIndex === 2 &&
              (season ? (
                <Laptimes season={season} round={round} laps={1} lapsx={1} />
              ) : (
                <h4 className="text-center text-danger">Data not found!</h4>
              ))}
          </Box>
        </div>
      </>
    );
  }
};

export default F1Race;
