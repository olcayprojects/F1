import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Next = () => {
  const [sdata, setData] = useState([]);

  useEffect(() => {
    fetch("https://ergast.com/api/f1/current/next.json")
      .then((response) => response.json())
      .then((data) => {
        setData(data["MRData"].RaceTable.Races);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  return (
    <div className="container-fluid bg-dark p-0 ">
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
          <h1 key={index} className="nextmarque m-0">
            <marquee className="blink" behavior="" scrollamount="6">
              Next Race <i className="bi bi-calendar3"></i>{" "}
              {data.raceName + ": "} {dateTime(data?.date, data.time)}
              <i className="bi bi-clock-fill"></i>
              {data.Sprint
                ? "Sprint: " +
                  dateTime(data.Sprint?.date, data.Sprint?.time) +
                  " "
                : ""}
              <i className="bi bi-clock-fill"></i>
              <span className="">First Practice: </span>
              {dateTime(data.FirstPractice?.date, data.FirstPractice?.time)}
              <i className="bi bi-clock-fill"></i>
              Second Practice:{" "}
              {dateTime(data.SecondPractice?.date, data.SecondPractice?.time)}
              <i className="bi bi-clock-fill"></i>
              {data.ThirdPractice?.date
                ? "Third Practice: " +
                  dateTime(data.ThirdPractice?.date, data.ThirdPractice?.time)
                : " "}
              <i className="bi bi-clock-fill"></i>
              Qualifying:{" "}
              {dateTime(data.Qualifying?.date, data.Qualifying?.time)}
            </marquee>
          </h1>
        );
      })}
    </div>
  );
};

export default Next;
