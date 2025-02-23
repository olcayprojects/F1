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
          setData(items.event[0]);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
    fetchData();
  }, [url]);

  return (
    <div className="container-fluid p-0">
      {data?.strThumb ? (
        <div>
          <div className="">
            <img
              className="img-fluid pt-1 ps-1 mx-auto d-block"
              src={data?.strThumb + "/preview"}
              alt=""
              title={data?.strFilename}
              srcSet=""
            />
          </div>
        </div>
      ) : (
        <img
          className="img-fluid pt-1 ps-1 mx-auto d-block"
          src={data?.strBanner + "/preview"}
          alt=""
          title={data?.strFilename}
          srcSet=""
        />
      )}
    </div>
  );
};

export default Events;
