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
    <div className="container-fluid my-2">
      {data?.map((event, index) => {
        return event.strDescriptionEN ? (
          <div key={index}>
            <div className="border border-5 border-dark mb-1">
              <h3 className="text-center text-light">Description</h3>
              <pre
                className="text-light overflow-hidden px-4"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {event?.strDescriptionEN}
              </pre>
            </div>
            <div className="border border-5 border-dark">
              <h3 className="text-center text-light">Result</h3>
              <pre
                className="text-light overflow-hidden px-4"
                style={{ whiteSpace: "pre-wrap" }}
              >
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
