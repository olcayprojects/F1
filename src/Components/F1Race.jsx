import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QualifyingResults from "./QualifyingResults";
import Pitstops from "./Pitstops";
import Laptimes from "./Laptimes";
import Loading from "./Loading";
import { DrvInfo } from "./DriverInfo";
import { Box, Tab, Tabs } from "@mui/material";
import { red } from "@mui/material/colors";
import Team from "./Team";
import Nav from "./Nav";

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
        })
        .catch((err) => {
          console.log("Hata:", err.message);
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
          <Nav />
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
                  <span>
                    {item.raceName} #{item.round}
                  </span>
                  <i className="text-info bi bi-calendar3">
                    {item.time ? dateTime(item.date, item.time) : item.date}
                  </i>
                  <i className="text-info bi bi-calendar3"></i>
                </h1>
                <div className="table-responsive-sm">
                  <table className="table table-dark table-striped table-bordered border-black">
                    <thead className="">
                      <tr className="">
                        <th className="bg-danger text-center">P</th>
                        <th className="text-center">G</th>
                        <th className="text-center bg-danger">NO</th>
                        <th className="" style={{ letterSpacing: "5px" }}>
                          DRIVER
                        </th>
                        <th className="bg-danger">T E A M</th>
                        <th className="text-center">LAPS</th>
                        <th className="text-center bg-danger">
                          TIME / RETIRED
                        </th>
                        <th className="text-center">PTS</th>
                        <th className="text-center bg-black"></th>
                        <th className="text-end">
                          <span className="text-decoration-underline text-black">
                            FASTEST
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
                        <th className="text-center bg-danger text-warning">
                          LAP
                        </th>
                        <th className="text-start">
                          <span className="text-decoration-underline text-black">
                            LAPS
                          </span>
                          <br />
                          <span className="text-white">AVGSPEED</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="">
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
                                ) : null
                              ) : (
                                <b>{result.positionText}</b>
                              )}
                            </td>
                            <td className="op text-center text-warning p-0">
                              {result.grid}
                            </td>
                            <td className="text-center text-light">
                              {result.number}
                            </td>

                            <td
                              className="col-3 cp p-0 op px-1"
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
                              <span className="text-info bg-black fw-bold p-1 ">
                                {result.Driver?.givenName + " "}
                                {(result.positionText in ["1", "2", "3", "4"]) &
                                (season2 === "2023") ? (
                                  <DrvInfo
                                    drv={
                                      result.Driver?.givenName +
                                      " " +
                                      result.Driver?.familyName
                                    }
                                  />
                                ) : null}
                                {result.Driver?.familyName}
                              </span>

                              <span className="ps-1 fw-bold fst-italic text-info">
                                {result.Driver?.nationality}
                              </span>
                            </td>

                            <td
                              className="col-2 cp p-0 ps-1"
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
                              {(result.positionText in ["1", "2", "3", "4"]) &
                              (season2 === "2023") ? (
                                <>
                                  <span className="bg-black text-success text-center p-1 px-1 fw-bold">
                                    {result.Constructor.name}
                                  </span>
                                  <span className="d-inline-block px-1">
                                    <Team
                                      teamName={result.Constructor.name}
                                      ls={1}
                                    />
                                  </span>
                                  <span className="text-success fw-bold text-center fst-italic">
                                    {" " + result.Constructor.nationality}
                                  </span>
                                </>
                              ) : (
                                <i className="">
                                  <span className="bg-black text-success fw-bold p-1 px-1">
                                    {result.Constructor.name}
                                  </span>
                                  <span className="text-success fw-bold">
                                    {" " + result.Constructor.nationality}
                                  </span>
                                </i>
                              )}
                            </td>
                            <td
                              className="op text-center fw-bold"
                              style={{ color: "pink" }}
                            >
                              {result.laps}
                            </td>
                            <td className="text-wrap text-center text-warning fw-bold p-0">
                              <span className="bg-black py-1 w-75 d-inline-block">
                                {result.Time?.time ? (
                                  result.Time.time
                                ) : result.status[0] === "+" ? (
                                  <span className="text-secondary">{result.status}</span>
                                ) : (
                                  <span className="text-danger">
                                    {result.status.toUpperCase()}
                                  </span>
                                )}
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
                            <td className="bg-black"></td>

                            <td
                              className={
                                "fw-bold op text-end cp p-0 " +
                                (result.FastestLap?.rank in ["1", "2", "3", "4"]
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
                              <span className="bg-black p-0 me-1 d-inline-block w-25 text-center">
                                {result.FastestLap?.rank}
                              </span>
                              {result.FastestLap ? (
                                <i className="bi bi-forward-fill fs-5 px-1"></i>
                              ) : null}
                              {result.FastestLap ? (
                                <span className="border me-1 p-0 border-black border-4 bg-black">
                                  {result.FastestLap?.Time.time}
                                </span>
                              ) : null}
                            </td>
                            <td className="text-center fw-bold text-warning">
                              {result.FastestLap?.lap}
                            </td>
                            <td className="op text-start p-0">
                              {result?.FastestLap?.AverageSpeed.speed ? (
                                <>
                                  <span className="ms-1 fw-bold">
                                    {result?.FastestLap?.AverageSpeed.speed}{" "}
                                  </span>
                                  <span className="fst-italic text-secondary">
                                    {result?.FastestLap?.AverageSpeed.units}
                                  </span>
                                </>
                              ) : null}
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
                <div className="row row-cols-1 row-cols-md-auto g-1 justify-content-sm-center bg-black">
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
