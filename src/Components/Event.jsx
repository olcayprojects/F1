import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "./Nav";
import QualifyingResults from "./QualifyingResults";

const Event = (props) => {
  const { date = "2024" } = useParams();
  const { round = "1" } = useParams();
  const { name = "Austrian Grand Prix" } = useParams();
  let url = `https://www.thesportsdb.com/api/v1/json/3/searchevents.php?e=${name}&s=${date}`;
  const [sdata, setData] = useState([]);

  const getFormattedDate = (timestamp) => {
    if (!timestamp) return "-";

    const fullDate = new Date(timestamp + "Z");

    return fullDate.toLocaleString("en-EN", {
      weekday: "long",
      month: "long",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
  };

  const fetchData = async (url) => {
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data.event);
      })
      .catch((err) => {
        // console.log(err.message);
      });
  };

  useEffect(() => {
    fetchData(url);
  }, [url]);

  return (
    <div>
      <Nav />

      {sdata ? (
        sdata?.map((events, index) => {
          return (
            <div className="text-light bg-black" key={index}>
              <h2 className="text-center">{events.strEvent}</h2>
              <h5 className="text-center">{events.strVenue}</h5>
              <h6 className="text-center">
                {events.strCity} {events.strCountry}
              </h6>
              <h6 className="text-center">
                {getFormattedDate(events?.strTimestamp)} | Track Time:
                {events?.strTimeLocal}
              </h6>
              <QualifyingResults
                season={events.strSeason}
                round={events.intRound}
              />

              <div
                className="d-flex justify-content-center align-items-center"
              >
                {events.strPoster && (
                  <img
                    src={`${events.strThumb}/small`}
                    alt={events.strFilename}
                    className="img-fluid w-50"
                  />
                )}
              </div>
            </div>
          );
        })
      ) : (
        <QualifyingResults season={date} round={round} />
      )}
    </div>
  );
};

export default Event;
