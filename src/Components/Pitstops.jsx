import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDrivers } from "../context/DriverContext";
import Loading from "./Loading";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function durationToMilliseconds(duration) {
  const [minutesPart, secondsPart] = duration.split(":");
  let minutes = 0;
  let seconds = 0;
  let milliseconds = 0;

  if (secondsPart) {
    minutes = parseInt(minutesPart, 10);
    const [sec, milli] = secondsPart.split(".");
    seconds = parseInt(sec, 10);
    milliseconds = milli ? parseInt(milli, 10) : 0;
  } else {
    const [sec, milli] = duration.split(".");
    seconds = parseInt(sec, 10);
    milliseconds = milli ? parseInt(milli, 10) : 0;
  }

  const minutesInMilliseconds = minutes * 60 * 1000;
  const secondsInMilliseconds = seconds * 1000;
  return minutesInMilliseconds + secondsInMilliseconds + milliseconds;
}

function millisecondsToDuration(milliseconds) {
  const minutes = Math.floor(milliseconds / (60 * 1000));
  const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);
  const millis = Math.floor(milliseconds % 1000);
  return `${minutes}:${String(seconds).padStart(2, "0")}.${String(
    millis
  ).padStart(3, "0")}`;
}

function Pitstops(props) {
  const [formattedData, setFormattedData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { drivers, season, setSeason } = useDrivers();

  let navigate = useNavigate();
  const { season2 = "2023" } = useParams();
  const { rounds = 0 } = useParams();
  let animate =
    "animate__animated animate__jackInTheBox animate__slow  animate__delay-";

  useEffect(() => {
    setSeason(props.season);
  }, [setSeason, props.season]);

  let url = "";
  if (props.season !== undefined) {
    url = `${BASE_URL}/${props.season}/${props.round}/pitstops.json?limit=100`;
  } else {
    url = `${BASE_URL}/${season2}/${rounds}/pitstops.json?limit=100`;
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("API yanıtı başarılı olmadı.");
        }

        const jsonData = await response.json();

        const driverInfo = jsonData[
          "MRData"
        ].RaceTable.Races[0].PitStops.reduce((acc, item) => {
          if (!acc[item.driverId]) {
            acc[item.driverId] = {
              laps: [],
              times: [],
              stops: [],
              durations: [],
              totalDuration: 0,
            };
          }

          const durationInMilliseconds = durationToMilliseconds(item.duration);

          acc[item.driverId].laps.push(item.lap);
          acc[item.driverId].times.push(item.time);
          acc[item.driverId].stops.push(item.stop);
          acc[item.driverId].durations.push(item.duration);
          acc[item.driverId].totalDuration += durationInMilliseconds;

          return acc;
        }, {});

        const newFormattedData = Object.entries(driverInfo).map(
          ([driverId, { laps, times, stops, durations, totalDuration }]) => {
            const lapDetails = laps.map((lap, index) => ({
              lap: lap,
              time: times[index],
              stop: stops[index],
              duration: durations[index],
            }));

            lapDetails.sort(
              (a, b) =>
                new Date(`1970-01-01T${a.time}Z`) -
                new Date(`1970-01-01T${b.time}Z`)
            );

            return {
              driverId: driverId,
              lapDetails: lapDetails
                .map(
                  (detail) =>
                    `${detail.stop}:  Lap ${
                      detail.lap.length > 1 ? detail.lap : " " + detail.lap
                    } - Time ${detail.time} - Duration ${detail.duration} `
                )
                .join("\n"),
              totalDuration: millisecondsToDuration(totalDuration),
            };
          }
        );

        setFormattedData(newFormattedData);
        setIsLoaded(true);
      } catch (error) {
        setIsLoaded(true);
      }
    }

    fetchData();
  }, [url]);

  if (!isLoaded) {
    return <Loading />;
  }

  return formattedData.length ? (
    <div className="container-fluid p-0 border border-dark border-5">
      <div className={"table-responsive " + animate}>
        <table className="myTable table table-dark table-striped table-bordered border-dark">
          <thead className="border-dark">
            <tr className="text-black align-middle bord">
              <th className="text-center py-0">#</th>
              <th className="py-0 bg-info text-info-emphasis bi-card-list">
                DRIVER INFO
              </th>
              <th className="py-0 bg-warning text-warning-emphasis text-center bi-list-ol">
                DETAILS
              </th>
              <th className="text-center py-0 text-success-emphasis bg-success bi-stopwatch-fill">
                TOTAL DURATION
              </th>
            </tr>
          </thead>
          <tbody className={"text-danger "}>
            {formattedData.map((ps, index) => {
              const driver = drivers.find(
                (driver) => driver.driverId === ps.driverId
              );
              return (
                <tr key={index} className="align-middle">
                  <td className={"op text-center px-1 py-0"}>{index + 1}</td>
                  <td
                    className="col-auto fw-bold text-info cp"
                    onClick={() => {
                      navigate("/ResultsDriver/" + ps.driverId);
                    }}
                  >
                    {driver ? (
                      <>
                        {driver.givenName} {driver.familyName}
                        <span className="ms-2 opacity-50">
                          ({driver.permanentNumber}) {driver.nationality}{" "}
                          {driver.dateOfBirth}
                        </span>
                      </>
                    ) : (
                      ps.driverId
                    )}
                  </td>
                  <td className="op fw-bold text-center">
                    <pre
                      className="d-block text-warning p-0 px-1 bg-black d-inline-block m-0 my-1 align-middle"
                      style={{
                        fontFamily: "Arial Black",
                        borderColor: "rgba(255,255,0,0.2)",
                        borderWidth: "2px",
                        borderStyle: "solid",
                      }}
                    >
                      {ps.lapDetails}
                    </pre>
                  </td>

                  <td className={"text-center text-success fw-bold op py-0 "}>
                    <span
                    // className={
                    //   index % 2 !== 0
                    //     ? "bg-black p-1"
                    //     : "bg-info text-black p-1"
                    // }
                    >
                      <span className="d-block bg-black p-1 border border-success">
                        {ps.totalDuration}
                      </span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <h4 className="text-center text-danger">Data not found!</h4>
  );
}

export default Pitstops;
