import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Next = () => {
  const [sdata, setData] = useState([]);

  useEffect(() => {
    fetch("https://ergast.com/api/f1/current/next.json", {
      signal: AbortSignal.timeout(5000),
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data["MRData"].RaceTable.Races);
      })
      .catch((err) => {});
  }, []);
  return (
    <div className="container-fluid bg-dark p-0">
      {sdata?.map((data, index) => {
        const dateTime = (d, t) =>
          new Date(d + " " + t).toLocaleString("en-EN", {
            weekday: "long",
            month: "long",
            day: "2-digit",
            hourCycle: "h23",
            hour: "2-digit",
            minute: "2-digit",
          });
        return (
          <h2
            key={index}
            className="bg-dark text-warning mt-1 m-0 pt-1"
            style={{ fontFamily: "fantasy" }}
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
                  ? dateTime(data?.date, data.time)
                  : new Date(data.date).toLocaleDateString("tr-TR")}
              </span>
              {data.Sprint ? (
                <>
                  <i className="bi bi-clock-fill text-info px-1"></i>
                  <span className="text-success">SPRINT </span>
                  <span>{dateTime(data.Sprint?.date, data.Sprint?.time)}</span>
                </>
              ) : null}
              {data.FirstPractice?.date ? (
                <>
                  <i className="bi bi-clock-fill text-info px-1"></i>

                  <span className="text-success">PRACTICE1 </span>
                  <span>
                    {dateTime(
                      data.FirstPractice?.date,
                      data.FirstPractice?.time
                    )}
                  </span>
                  <i className="bi bi-clock-fill text-info px-1"></i>
                  <span className="text-success">PRACTICE2 </span>
                  {dateTime(
                    data.SecondPractice?.date,
                    data.SecondPractice?.time
                  )}
                  {data.ThirdPractice?.date ? (
                    <>
                      <i className="bi bi-clock-fill text-info px-1"></i>
                      <span className="text-success">PRACTICE3 </span>
                      {dateTime(
                        data.ThirdPractice?.date,
                        data.ThirdPractice?.time
                      )}
                    </>
                  ) : null}
                  <i className="bi bi-clock-fill text-info px-1"></i>
                  <span className="text-success">QUALIFYING </span>
                  {dateTime(data.Qualifying?.date, data.Qualifying?.time)}
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
