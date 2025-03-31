import React, { useEffect, useState } from "react";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Next = () => {
  const [sdata, setData] = useState([]);
  const url = `${BASE_URL}/current/next.json`;

  useEffect(() => {
    fetch(url, {
      signal: AbortSignal.timeout(5000),
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data["MRData"].RaceTable.Races);
      })
      .catch((err) => {});
  }, [url]);
  return (
    <div className="container-fluid bg-dark p-0">
      {sdata?.map((data, index) => {
        const dateTime = (date, time) => {
          const fullDate = new Date(`${date}T${time}`);
          return fullDate;
        };

        const getFormattedDate = (event) => {
          if (!event) return "-";

          const { date, time } = event;
          if (time) {
            return dateTime(date, time).toLocaleString("en", {
              weekday: "long",
              month: "long",
              day: "2-digit",
              hourCycle: "h23",
              hour: "2-digit",
              minute: "2-digit",
            });
          }

          return date;
        };

        return (
          <h2
            key={index}
            className="bg-dark text-warning mt-1 m-0 pt-1 fw-bold"
            style={{}}
          >
            <marquee className="" behavior="" scrollamount="8">
              <span className="text-primary">
                ROUND {data.round} - UP NEXT{" "}
              </span>
              <span className="text-info ">{data.raceName}</span>
              <i className="bi bi-calendar3 text-warning px-1"></i>
              <span className="text-danger">
                <span className="text-success">RACE </span>

                {data.time
                  ? getFormattedDate(data, data)
                  : new Date(data.date).toLocaleDateString("tr-TR")}
              </span>
              {data.Sprint ? (
                <>
                  <i className="bi bi-clock-fill text-info px-1"></i>
                  <span className="text-success">SPRINT </span>
                  <span>{getFormattedDate(data.Sprint, data.Sprint)}</span>
                </>
              ) : null}
              {data.FirstPractice?.date ? (
                <>
                  <i className="bi bi-clock-fill text-info px-1"></i>

                  <span className="text-success">PRACTICE1 </span>
                  <span>
                    {getFormattedDate(data.FirstPractice, data.FirstPractice)}
                  </span>
                  <i className="bi bi-clock-fill text-info px-1"></i>
                  {data.SecondPractice?.date ? (
                    <>
                      <span className="text-success">PRACTICE2 </span>
                      {getFormattedDate(
                        data.SecondPractice,
                        data.SecondPractice
                      )}
                    </>
                  ) : (
                    <>
                      <span className="text-success">SPRINT QUALIFYING </span>
                      {getFormattedDate(
                        data.SprintQualifying,
                        data.SprintQualifying
                      )}
                    </>
                  )}

                  {data.ThirdPractice?.date ? (
                    <>
                      <i className="bi bi-clock-fill text-info px-1"></i>
                      <span className="text-success">PRACTICE3 </span>
                      {getFormattedDate(data.ThirdPractice, data.ThirdPractice)}
                    </>
                  ) : null}
                  <i className="bi bi-clock-fill text-info px-1"></i>
                  <span className="text-success">QUALIFYING </span>
                  {getFormattedDate(data.Qualifying, data.Qualifying)}
                </>
              ) : (
                <>
                  <span className="text-warning">
                    {" "}
                    | Season: {data.season} Round: {data.round}
                  </span>
                  <span className="text-info">
                    {" "}
                    | {data.Circuit.circuitName}
                  </span>
                </>
              )}
            </marquee>
          </h2>
        );
      })}
    </div>
  );
};

export default Next;
