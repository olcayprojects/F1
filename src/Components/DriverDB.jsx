import React from "react";
import { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";

const DriverDB = (props) => {
  const [data, setData] = useState();

  let url = "";
  if (props.drv === "Carlos Sainz") {
    console.log(props.drv);

    url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=Carlos Sainz Jr`;
  } else {
    url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${props.drv}`;
  }

  useEffect(() => {
    function fetchData() {
      fetch(url)
        .then((response) => response.json())
        .then((items) => {
          setData(items["player"][0]);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
    fetchData();
  }, [url]);

  return (
    <>
      <pre className="p-0 text-wrap">
        {data?.dateBorn} {data?.strBirthLocation}
      </pre>
      <pre className="p-0 text-wrap">
        {data?.strTeam} #{data?.strNumber}
      </pre>
      <p className="p-0 text-light">{data?.strDescriptionEN}</p>
    </>
  );
};

export default DriverDB;
