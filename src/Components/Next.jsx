import React, { useEffect, useState } from "react";

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
        return (
          <h1 key={index} className="blink bg-dark">
            <marquee className="blink">
              Next Race #{data.round} {data.raceName} | {data.date} {data.time}{" "}
              | First Practice:
              {data.FirstPractice.date} {data.FirstPractice.time} | Second
              Practice:
              {data.SecondPractice.date} {data.SecondPractice.time} | Third
              Practice:
              {data.ThirdPractice.date} {data.ThirdPractice.time} | Qualifying:
              {data.Qualifying.date} {data.Qualifying.time}
            </marquee>
          </h1>
        );
      })}
    </div>
  );
};

export default Next;
