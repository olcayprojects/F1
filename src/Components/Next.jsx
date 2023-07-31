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
    <div className="bg-dark">
      {sdata?.map((data, index) => {
        const dateTime = (d, t) =>
          new Date(d + " " + t).toLocaleString("en-EN", {
            dateStyle: "full",
            timeStyle: "short",
          });
        return (
          <h1 key={index} className="blink bg-dark m-0">
            <marquee className="blink">
              Next Race <i class="bi bi-calendar3"></i> {data.raceName + ":"}{" "}
              {dateTime(data?.date, data.time)}
              <i class="bi bi-clock-fill"></i>
              {data.Sprint
                ?  "Sprint: " +dateTime(data.Sprint?.date, data.Sprint?.time)+" "
                : ""}
                
              First Practice:
              {dateTime(data.FirstPractice?.date, data.FirstPractice?.time)}
              <i class="bi bi-clock-fill"></i>
              Second Practice:
              {dateTime(data.SecondPractice?.date, data.SecondPractice?.time)}
              <i class="bi bi-clock-fill"></i>
              {data.ThirdPractice?.date
                ? "Third Practice: " +
                  dateTime(data.ThirdPractice?.date, data.ThirdPractice?.time) 
                : " "}
                <i class="bi bi-clock-fill"></i>
              Qualifying:
              {dateTime(data.Qualifying?.date, data.Qualifying?.time)}
            </marquee>
          </h1>
        );
      })}
    </div>
  );
};

export default Next;
