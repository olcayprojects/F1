import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DriverId from "./DriverId";
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
  const [drivers, setDrivers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  let navigate = useNavigate();
  const { season2 = "2023" } = useParams();
  const { rounds = 0 } = useParams();

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
                    `${detail.stop}. [ Lap: ${
                      detail.lap.length > 1 ? detail.lap : " " + detail.lap
                    }, Time: ${detail.time}, Duration: ${detail.duration} ]`
                )
                .join("\n"),
              totalDuration: millisecondsToDuration(totalDuration),
            };
          }
        );

        setFormattedData(newFormattedData);
        setIsLoaded(true);
      } catch (error) {
        console.error("Veri çekme veya işleme hatası:", error);
      }
    }

    fetchData();
  }, [url]);

  if (!isLoaded) {
    return <Loading />;
  }

  return formattedData.length ? (
    <div className="container-fluid p-0 border border-dark border-5">
      <DriverId setDrivers={setDrivers} season={props.season} />
      <div className="table-responsive">
        <table className="table table-dark table-striped table-bordered">
          <thead className="border-dark fs-5">
            <tr className="text-black align-middle">
              <th className="bg-danger op text-center py-0">#</th>
              <th className="bg-danger py-0">DRIVER INFO</th>
              <th className="bg-danger op py-0 text-center">DETAILS</th>
              <th className="text-center bg-danger op py-0">TOTAL DURATION</th>
            </tr>
          </thead>
          <tbody className="text-danger">
            {formattedData.map((ps, index) => {
              const driver = drivers.find(
                (driver) => driver.driverId === ps.driverId
              );
              return (
                <tr key={index} className="align-middle">
                  <td className="op text-center px-1 py-0">{index + 1}</td>
                  <td
                    className="col-auto fw-bold fs-5 text-info cp py-0"
                    onClick={() => {
                      navigate("/ResultsDriver/" + ps.driverId);
                    }}
                  >
                    {driver
                      ? `${driver.givenName} 
                          ${driver.familyName}
                          (${driver.permanentNumber})
                          ${driver.nationality}
                          ${driver.dateOfBirth}                          
                          `
                      : ps.driverId}
                  </td>
                  <td className="fs-6 op fw-bold text-center">
                    <pre
                      className="text-warning px-1 p-0 fs-6 d-inline-block m-0 align-middle"
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

                  <td
                    className="text-center fw-bold op py-0"
                    style={{ fontFamily: "Arial Black" }}
                  >
                    <span
                      className={
                        index % 2 !== 0 ? "bg-black px-2" : "bg-secondary px-2"
                      }
                    >
                      {ps.totalDuration}
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
    "Data not found"
  );
}

export default Pitstops;
