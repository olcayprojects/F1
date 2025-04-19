import React, { useState, useRef } from "react";

const RaceSimulation = ({ laps, drivers }) => {
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
    }, 2000);
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
          <tr>
            <th>#</th>
            <th>Driver</th>
            <th>Time ↓</th>
          </tr>
        </thead>
        <tbody>
          {[...(currentLap?.Timings || [])]
            .sort((a, b) => parseFloat(a.time) - parseFloat(b.time))
            .map((timing, i) => {
              const driver = drivers.find(
                (d) => d.driverId === timing.driverId
              );
              const positionChange = getPositionChange(
                timing.driverId,
                timing.position
              );

              return (
                <tr className="font-monospace fs-5" key={i}>
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
                    <span className="mx-4 px-2 fw-bold bg-black rounded text-success">
                      {driver ? `${driver.givenName} ${driver.familyName}` : ""}
                    </span>
                    {positionChange && (
                      <span className="position-change ms-1">
                        {positionChange}
                      </span>
                    )}
                  </td>
                  <td>{timing.time}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default RaceSimulation;
