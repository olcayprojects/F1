import React, { useState, useRef } from "react";

const RaceSimulation = ({ laps, drivers, pitStops }) => {
  const [currentLapIndex, setCurrentLapIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const currentLap = laps[currentLapIndex];
  const prevLap = laps[currentLapIndex - 1];

  const startRace = () => {
    setCurrentLapIndex(0); // Her başlatmada sıfırdan başla
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setCurrentLapIndex((prevIndex) => {
        if (prevIndex < laps.length - 1) {
          return prevIndex + 1;
        } else {
          clearInterval(intervalRef.current);
          setIsRunning(false); // Yarış bitince tekrar başlatılabilir hale getir
          return prevIndex;
        }
      });
    }, 3000);
  };

  const stopRace = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const getPositionChange = (driverId, currentPosition) => {
    const prevDriverPosition = prevLap?.Timings?.find(
      (timing) => timing.driverId === driverId
    )?.position;

    if (prevDriverPosition) {
      const diff = parseInt(prevDriverPosition) - parseInt(currentPosition);
      if (diff > 0) return `( ↑ ${Math.abs(diff)} )`;
      if (diff < 0) return `( ↓ ${Math.abs(diff)} )`;
    }
    return "";
  };

  const formatPosition = (val) => {
    if (val === "N/A" || val === undefined) return "--";
    return val.toString().padStart(2, " ");
  };

  return (
    <div className="race-sim">
      <table className="table table-dark table-bordered table-striped">
        <caption className="bg-dark text-center caption-top m-0 p-0">
          <div className="m-0 p-0">
            {!isRunning && (
              <button
                className="btn btn-outline-success btn-sm"
                onClick={startRace}
              >
                Start Race
              </button>
            )}
            {isRunning && (
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={stopRace}
              >
                Stop Race
              </button>
            )}
            <span className="m-0 p-0 fw-bold ms-2 text-info">
              {currentLapIndex === laps.length - 1 && !isRunning
                ? `Last Lap: ${currentLapIndex + 1}`
                : `Lap: ${currentLapIndex + 1}`}
            </span>
          </div>
        </caption>
        <thead>
          <tr className="text-center">
            <th>#</th>
            <th>PST</th>
            <th>Driver</th>
            <th>↓ ↑</th>
            <th className="">PIT</th> {/* Yeni sütun */}
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {[...(currentLap?.Timings || [])]
            .sort((a, b) => parseInt(a.position) - parseInt(b.position))

            .map((timing, i) => {
              const driver = drivers.find(
                (d) => d.driverId === timing.driverId
              );
              const positionChange = getPositionChange(
                timing.driverId,
                timing.position
              );
              const pitStop = pitStops.find(
                (ps) =>
                  ps.driverId === timing.driverId &&
                  parseInt(ps.lap) === parseInt(currentLap.number)
              );

              return (
                <tr className="font-monospace fs-5 text-center" key={i}>
                  <td>{formatPosition(i + 1)}</td>
                  <td>
                    <strong className="text-warning">
                      {formatPosition(
                        prevLap?.Timings?.find(
                          (prevTiming) =>
                            prevTiming.driverId === timing.driverId
                        )?.position || "N/A"
                      )}
                      <span className="mx-2">→</span>
                      {formatPosition(timing.position)}
                    </strong>
                  </td>
                  <td
                    className={
                      timing.position === "1"
                        ? "text-warning"
                        : pitStop
                        ? positionChange.includes("↑")
                          ? "text-primary"
                          : positionChange.includes("↓")
                          ? "text-danger"
                          : "text-decoration-line-through"
                        : positionChange.includes("↑")
                        ? "text-primary"
                        : positionChange.includes("↓")
                        ? "text-danger"
                        : "text-success"
                    }
                  >
                    <span className="px-2 bg-black rounded">
                      {driver ? `${driver.givenName} ${driver.familyName}` : ""}
                    </span>
                  </td>
                  <td className="p-0">
                    {positionChange && (
                      <span className="position-change ms-1">
                        {positionChange}
                      </span>
                    )}
                  </td>
                  <td className="text-info fw-bold p-0">
                    {pitStop ? `${pitStop.duration}s` : ""}
                  </td>
                  <td className={"p-0 " + (pitStop ? "text-info fw-bold" : "")}>
                    {timing.time}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default RaceSimulation;
