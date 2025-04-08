import { useEffect, useState } from "react";

const Events = (props) => {
  const [data, setData] = useState();

  let url = "";

  url = `https://www.thesportsdb.com/api/v1/json/3/searchfilename.php?e=Formula_1_${props.date}_${props.name}`;
  useEffect(() => {
    function fetchData() {
      fetch(url)
        .then((response) => response.json())
        .then((items) => {
          setData(items.event[0]);
        })
        .catch((err) => {
          // console.log(err.message);
        });
    }
    fetchData();
  }, [url]);

  return (
    <div className="container-fluid p-0">
      {data?.strThumb ? (
        <div className="container">
          <img
            style={{ width: "44%" }}
            className="img-fluid p-0 m-0 mx-auto d-block"
            src={data?.strBanner + "/small"}
            alt=""
            title={data?.strFilename}
            srcSet=""
          />
          {(data?.strResult || data?.strDescriptionEN) && (
            <p
              className="text-secondary small-text"
              style={{ fontSize: "0.7em" }}
            >
              &quot; {data?.strResult || data?.strDescriptionEN} &quot;
            </p>
          )}
        </div>
      ) : <img
          className="img-fluid pt-1 ps-1 mx-auto d-block"
          src={data?.strBanner + "/small"}
          alt=""
          title={data?.strFilename}
          srcSet=""
        /> ? (
        <div className="container-fluid text-secondary text-center d-flex justify-content-center">
          <h6>
            {data?.strFilename}-{data?.strVenue}
          </h6>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Events;
