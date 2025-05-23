import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "./Nav";

export function RaceThumb(props) {
  const [data, setData] = useState([]);

  let url = "";
  url = `https://www.thesportsdb.com/api/v1/json/3/searchfilename.php?e=Formula 1 ${props.date} ${props.name}`;

  useEffect(() => {
    function fetchData() {
      fetch(url)
        .then((response) => response.json())
        .then((items) => {
          setData(items["event"]);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
    fetchData();
  }, [url]);

  return data ? (
    <img
      className="img-thumbnail w-50 m-0 p-0"
      src={data[0]?.strThumb}
      alt=""
      srcSet=""
    />
  ) : null;
}

const RaceInfo = () => {
  const { date = "2023-07-02" } = useParams();
  const { name = "Austrian Grand Prix" } = useParams();

  const formatDate = (timestamp) => {
    const date = new Date(timestamp + "Z");
    return date.toLocaleTimeString();
  };

  const [data, setData] = useState();

  let url = "";

  url = `https://www.thesportsdb.com/api/v1/json/3/searchfilename.php?e=Formula 1 ${date} ${name}`;

  useEffect(() => {
    function fetchData() {
      fetch(url)
        .then((response) => response.json())
        .then((items) => {
          setData(items["event"]);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
    fetchData();
  }, [url]);

  return (
    <div className="container-fluid">
      <Nav />

      <div className="row">
        {data?.map((event, index) => {
          return (
            <div className="col text-center" key={index}>
              <h1 className="text-light">{event.strFilename}</h1>
              <img
                className="img-fluid"
                src={event?.strPoster}
                alt=""
                srcSet=""
              />
              {/* <img className="img-fluid" src={event.strMap + "/preview"} alt="" srcSet="" /> */}
              <h5 className="text-light">{event?.strVenue}</h5>
              <h5 className="text-light">{event?.strCountry}</h5>
              <h5 className="text-light">{event?.strCity}</h5>
              <h5 className="text-light">
                Your Time: {formatDate(event?.strTimestamp)}
              </h5>
              <h5 className="text-light">Local Time: {event?.strTimeLocal}</h5>
              <h5 className="text-light">{event?.strDescriptionEN}</h5>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RaceInfo;
