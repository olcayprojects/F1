import React from "react";

// Function to format driverId by taking the first 3 characters and converting them to uppercase
const formatDriverId = (driverId) => {
  return driverId.substring(0, 3).toUpperCase();
};

// Function to convert time string or number to seconds
const timeToSeconds = (time) => {
  if (typeof time === "string") {
    const parts = time.split(":");
    if (parts.length === 2) {
      const [minutes, seconds] = parts.map((part) => parseFloat(part));
      return minutes * 60 + seconds;
    }
    console.error("Invalid time format (string):", time);
  } else if (typeof time === "number") {
    return time;
  }
  // console.error("Time is not a string or number:", time);
  return NaN;
};

// Function to format time from seconds to "mm:ss.sss" format
const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds)) return "-:--.---";
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = (timeInSeconds % 60).toFixed(3);
  return `${minutes}:${seconds.padStart(6, "0")}`;
};

const LapTable = ({ lapTimes, driverIds, positions }) => {
  const lapNumbers = Object.keys(lapTimes).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );
  const maxDrivers = 20;

  // Function to get sorted times and positions for each lap
  const getSortedTimes = (lapNumber) => {
    const timings = lapTimes[lapNumber] || {};
    return Object.keys(timings)
      .map((driverId) => ({
        driverId,
        time: timings[driverId],
        position: positions[lapNumber]?.[driverId], // Fetch position for the lap
      }))
      .sort((a, b) => timeToSeconds(a.time) - timeToSeconds(b.time));
  };

  // Function to get positions for all laps
  const getPositions = () => {
    let positionsArray = [];
    lapNumbers.forEach((lapNumber) => {
      const sortedTimes = getSortedTimes(lapNumber);
      sortedTimes.forEach((time, index) => {
        if (!positionsArray[index]) {
          positionsArray[index] = {};
        }
        positionsArray[index][lapNumber] = {
          driverId: formatDriverId(time.driverId),
          time: time.time,
          position: time.position, // Include position
        };
      });
    });
    return positionsArray;
  };

  const positionsArray = getPositions();

  return (
    <div className="table-responsive">
      <table className="table table-dark table-bordered table-striped m-0 mb-1">
        <thead>
          <tr>
            <th className="m-0 p-0 text-center">Lap</th>
            {Array.from({ length: maxDrivers }, (_, i) => (
              <th className="text-center m-0 p-0" key={i + 1}>
                {i + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lapNumbers.map((lapNumber) => (
            <tr className="text-center" key={lapNumber}>
              <td>{lapNumber}</td>
              {Array.from({ length: maxDrivers }, (_, i) => (
                <td className="p-0" key={i + 1}>
                  {positionsArray[i] && positionsArray[i][lapNumber] ? (
                    <>
                      <h6
                        className={
                          "m-0 " +
                          (positionsArray[i][lapNumber].position === "1"
                            ? "text-danger"
                            : positionsArray[i][lapNumber].position === "2"
                            ? "text-warning"
                            : positionsArray[i][lapNumber].position === "3"
                            ? "text-success"
                            : "")
                        }
                      >
                        {positionsArray[i][lapNumber].driverId}
                        <span className="ms-2 fst-italic">
                          {positionsArray[i][lapNumber].position
                            ? `(P${positionsArray[i][lapNumber].position})`
                            : ""}
                        </span>
                      </h6>
                      <div>
                        <span className="text-info fw-bold">
                          {formatTime(
                            timeToSeconds(positionsArray[i][lapNumber].time)
                          )}
                        </span>
                      </div>
                    </>
                  ) : (
                    "N/A"
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LapTable;
