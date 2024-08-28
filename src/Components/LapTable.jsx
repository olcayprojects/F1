import React from "react";

// driverId'nin ilk 3 harfini büyük yapma işlevi
const formatDriverId = (driverId) => {
  return driverId.substring(0, 3).toUpperCase();
};

// Süreyi saniye cinsinden dönüştüren işlev
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
  //   console.error("Time is not a string or number:", time);
  //   return NaN; // Eğer zaman string veya number değilse NaN döndür
};

// Süreyi "mm:ss.sss" formatında döndüren işlev
const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds)) return "N/A";
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = (timeInSeconds % 60).toFixed(3);
  return `${minutes}:${seconds.padStart(6, "0")}`;
};

const LapTable = ({ lapTimes }) => {
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
      }))
      .sort((a, b) => timeToSeconds(a.time) - timeToSeconds(b.time));
  };

  const getPositions = () => {
    let positions = [];
    lapNumbers.forEach((lapNumber) => {
      const sortedTimes = getSortedTimes(lapNumber);
      sortedTimes.forEach((time, index) => {
        if (!positions[index]) {
          positions[index] = {};
        }
        positions[index][lapNumber] = {
          driverId: formatDriverId(time.driverId),
          time: time.time,
        };
      });
    });
    return positions;
  };

  const positions = getPositions();

  return (
    <div className="table-responsive">
      <table className="table table-dark table-bordered table-striped m-0 mb-1">
        <thead>
          <tr>
            <th>Lap</th>
            {Array.from({ length: maxDrivers }, (_, i) => (
              <th className="text-center" key={i + 1}>
                {i + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lapNumbers.map((lapNumber) => (
            <tr key={lapNumber}>
              <td>{lapNumber}</td>
              {Array.from({ length: maxDrivers }, (_, i) => (
                <td className="p-0" key={i + 1}>
                  {positions[i] && positions[i][lapNumber] ? (
                    <>
                      <h6 className="m-0">
                        {positions[i][lapNumber].driverId}
                      </h6>
                      <span>
                        {formatTime(
                          timeToSeconds(positions[i][lapNumber].time)
                        )}
                      </span>
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
