import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Next = () => {
  const [sdata, setData] = useState([]);



  useEffect(() => {
    fetch("https://ergast.com/api/f1/current/next.json")
      .then((response) => response.json())
      .then((data) => {
        setData(data["MRData"].RaceTable.Races);
        // console.log(data["MRData"].RaceTable.Races[0].raceName);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  return (
    <div className="bg-dark">
      {sdata?.map((data, index) => {
          const dateTime=(d,t) =>new Date(d+" "+t).toLocaleString();
        return (
          <h1 key={index} title="click Go to HomePage" className="blink bg-dark cp" >
            <marquee className="blink">
              Next Race #{data.round} {data.raceName} | {dateTime(data.date,data.time)}{" "}
              | First Practice:
              {dateTime(data.FirstPractice.date,data.FirstPractice.time)} | Second
              Practice:
              {dateTime(data.SecondPractice.date,data.SecondPractice.time)} | Third
              Practice:
              {dateTime(data.ThirdPractice.date,data.ThirdPractice.time)} | Qualifying:
              {dateTime(data.Qualifying.date,data.Qualifying.time)}
            </marquee>
          </h1>
        );
      })}
    </div>
  );
};

export default Next;