import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "./Nav";
import QualifyingResults from "./QualifyingResults";

const Event = (props) => {
  const { date = "2024" } = useParams();
  const { name = "Austrian Grand Prix" } = useParams();
  let url = `https://www.thesportsdb.com/api/v1/json/3/searchevents.php?e=${name}&s=${date}`;

  const [sdata, setData] = useState([]);

  const fetchData = async (url) => {
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data.event);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchData(url);
  }, [url]);

  return (
    <div>
      <Nav />

      {sdata?.map((events, index) => {
        return (
          <div className="text-light" key={index}>
            <div
              id="carouselEvent"
              className="carousel slide"
              data-bs-interval="1000"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner" style={{ height: "400px" }}>
                <div className="carousel-item active" data-bs-interval="1000">
                  <img
                    className="img"
                    src={events.strPoster + "/preview"}
                    alt=""
                    srcSet=""
                  />
                </div>
                <div className="carousel-item">
                  <img
                    className="img"
                    src={events.strMap + "/preview"}
                    alt=""
                    srcSet=""
                  />
                </div>
                <div className="carousel-item">
                  <img
                    className="img"
                    src={events.strBanner + "/preview"}
                    alt=""
                    srcSet=""
                  />
                </div>
                <div className="carousel-item">
                  <img
                    className="img"
                    src={events.strThumb + "/preview"}
                    alt=""
                    srcSet=""
                  />
                </div>
                <div className="carousel-item">
                  <img
                    className="img"
                    src={events.strSquare + "/preview"}
                    alt=""
                    srcSet=""
                  />
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselEvent"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselEvent"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>

            <h1 className="text-center">{events.strEvent}</h1>
            <h5 className="text-center">{events.strVenue}</h5>
            <h6 className="text-center">
              {events.strCity} {events.strCountry}
            </h6>
            <h6 className="text-center">
              {events.dateEvent + " " + events.strTime}
            </h6>
            <QualifyingResults
              season={events.strSeason}
              round={events.intRound}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Event;
