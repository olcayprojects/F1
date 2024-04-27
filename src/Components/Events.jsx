import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Events = (props) => {
  const [data, setData] = useState();

  let url = "";

  url = `https://www.thesportsdb.com/api/v1/json/3/searchfilename.php?e=Formula_1_${props.date}_${props.name}`;

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
    <div className="container-fluid p-0">
      {data?.map((event, index) => {
        return event.strDescriptionEN ? (
          <div key={index}>
            <div className="border border-5 border-dark mb-1 d-flex">
              <pre
                className="text-secondary overflow-hidden p-2 border border-dark border-3 m-1"
                style={{ whiteSpace: "pre-wrap" }}
              >
                <h6 className="fw-bold">Description: </h6>

                {event?.strDescriptionEN}
              </pre>
              <img
                className="img-responsive pt-1 ps-1"
                src={event?.strPoster + "/preview"}
                alt=""
                title={event?.strFilename}
                srcSet=""
              />
              <pre
                className="text-secondary overflow-hidden p-2 border border-dark border-3 m-1"
                style={{ whiteSpace: "pre-wrap" }}
              >
                <h6 className="fw-bold">Result: </h6>
                {event?.strResult}
              </pre>
            </div>
          </div>
        ) : null;
      })}
    </div>
  );
};

export default Events;
