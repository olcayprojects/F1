import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "./Nav";

export function RaceThumb({ date, name, onError, s }) {
  const [data, setData] = useState([]);

  let url = "";
  url = `https://www.thesportsdb.com/api/v1/json/3/searchfilename.php?e=Formula 1 ${date} ${name}`;

  useEffect(() => {
    function fetchData() {
      setTimeout(() => {
        fetch(url)
          .then((response) => response.json())
          .then((items) => {
            setData(items["event"]);
          })
          .catch((err) => {
            // console.log(err.message);
          });
      }, 2000);
    }

    fetchData();
  }, [url]);

  return data ? (
    s === 2 ? (
      <img
        className="img-fluid m-0 p-0"
        src={data[0]?.strBanner ? data[0]?.strBanner : data[0]?.strThumb}
        alt=""
        srcSet=""
        onError={onError}
      />
    ) : (
      <div className="text-center">
        {(data[0]?.strFanart ||
          data[0]?.strSquare ||
          data[0]?.strPoster ||
          data[0]?.strThumb) && (
          <div className="d-flex justify-content-center flex-wrap gap-2">
            {data[0]?.strSquare || data[0]?.strFanart || data[0]?.strPoster
              ? ["strSquare", "strFanart", "strPoster"].map((key) =>
                  data[0]?.[key] ? (
                    <img
                      key={key}
                      className="img-fluid m-0 p-0"
                      src={`${data[0][key]}/medium`}
                      alt={data[0]?.strFilename || "Art"}
                      title={data[0]?.strFilename || "Art"}
                      onError={onError}
                    />
                  ) : null
                )
              : data[0]?.strThumb && (
                  <img
                    className="img-fluid m-0 p-0"
                    src={`${data[0].strThumb}/medium`}
                    alt={data[0]?.strFilename || "Art"}
                    title={data[0]?.strFilename || "Art"}
                    onError={onError}
                  />
                )}
          </div>
        )}

        {data[0]?.strDescriptionEN && (
          <pre className="text-success m-3 text-wrap">
            {data[0].strDescriptionEN}
          </pre>
        )}
      </div>
    )
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
            <div className="col text-center pt-1" key={index}>
              {event?.strBanner ? (
                <img
                  className="img-fluid"
                  src={event?.strBanner + ""}
                  alt=""
                  srcSet=""
                />
              ) : (
                <>
                  <h5 className="text-light">{event?.strVenue}</h5>
                  <h5 className="text-light">{event?.strCountry}</h5>
                  <h5 className="text-light">{event?.strCity}</h5>
                </>
              )}
              {/* <img className="img-fluid" src={event.strMap + "/preview"} alt="" srcSet="" /> */}

              <h5 className="text-light">
                Your Time: {formatDate(event?.strTimestamp)}
              </h5>
              <h5 className="text-light">Local Time: {event?.strTimeLocal}</h5>
              <h5 className="text-light">{event?.strDescriptionEN}</h5>
              <img
                className="img-fluid"
                src={event?.strPoster + "/medium"}
                alt=""
                srcSet=""
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RaceInfo;
