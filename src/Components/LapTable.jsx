import React from "react";

const formatDriverId = (driverId) => {
  return driverId.substring(0, 3).toUpperCase();
};

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
  return NaN;
};

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

  const getSortedTimes = (lapNumber) => {
    const timings = lapTimes[lapNumber] || {};
    return Object.keys(timings)
      .map((driverId) => ({
        driverId,
        time: timings[driverId],
        position: positions[lapNumber]?.[driverId],
      }))
      .sort((a, b) => timeToSeconds(a.time) - timeToSeconds(b.time));
  };

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
          position: time.position,
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
            <th className="m-0 p-0 text-center">L</th>
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
              <td className="px-0 ">{lapNumber}</td>
              {Array.from({ length: maxDrivers }, (_, i) => (
                <td className="p-0" key={i + 1}>
                  {positionsArray[i] && positionsArray[i][lapNumber] ? (
                    <>
                      <h6
                        className={
                          "p-0 " +
                          (positionsArray[i][lapNumber].position === "1"
                            ? "text-danger"
                            : positionsArray[i][lapNumber].position === "2"
                            ? "text-warning"
                            : positionsArray[i][lapNumber].position === "3"
                            ? "text-primary"
                            : "")
                        }
                      >
                        {positionsArray[i][lapNumber].driverId}
                        <span className="fst-italic">
                          {positionsArray[i][lapNumber].position
                            ? `(${positionsArray[i][lapNumber].position})`
                            : ""}
                        </span>
                      </h6>
                      <div>
                        <span
                          className={
                            "text-secondary fw-bold " +
                            (positionsArray[i][lapNumber].position === "1"
                              ? "text-light"
                              : positionsArray[i][lapNumber].position === "2"
                              ? "text-light"
                              : positionsArray[i][lapNumber].position === "3"
                              ? "text-light"
                              : "")
                          }
                        >
                          {formatTime(
                            timeToSeconds(positionsArray[i][lapNumber].time)
                          )}
                        </span>
                      </div>
                    </>
                  ) : (
                    "-"
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
