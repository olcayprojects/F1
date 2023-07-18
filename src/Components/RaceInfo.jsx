import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const RaceInfo = () => {
  const { date = "2023-07-02" } = useParams();
  const { name = "Austrian Grand Prix" } = useParams();

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
      <Link to="/" className="btn btn-danger container-fluid">
        <h1>F1</h1>
      </Link>
      <div className="row">
        {data?.map((event, index) => {
          return (
            <div className="col text-center" key={index}>
              <h1 className="text-light">{event.strFilename}</h1>
              <img
                className="img-fluid"
                src={event?.strThumb + "/preview"}
                alt=""
                srcSet=""
              />
              <img
                className="img-fluid"
                src={event?.strMap + "/preview"}
                alt=""
                srcSet=""
              />
              {/* <img className="img-fluid" src={event.strMap + "/preview"} alt="" srcSet="" /> */}
              <h5 className="text-light">{event?.strVenue}</h5>
              <h5 className="text-light">{event?.strCountry}</h5>
              <h5 className="text-light">{event?.strCity}</h5>
              <h5 className="text-light">
                {new Date(event?.strTimestamp).toLocaleString()}
              </h5>
              <h5 className="text-light">{event?.strDescriptionEN}</h5>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RaceInfo;
