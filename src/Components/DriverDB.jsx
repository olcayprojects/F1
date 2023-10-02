import React from "react";
import { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";

const DriverDB = (props) => {
  const [data, setData] = useState();

  let url = "";
  if (props.drv === "Carlos Sainz") {
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
      <img
        className="img-fluid w-25 "
        style={{ width: "", height: "" }}
        src={data?.strRender ? data?.strRender : data?.strCutout + "/preview"}
        alt=""
        title={data?.strDescriptionEN}
        srcSet=""
      />
      <p className="p-0 fs-5 ">
        <span className="fw-bold">Team: </span>{data?.strTeam} #{data?.strNumber} <br />
        <span className="fw-bold">Country: </span>{data?.strNationality} <br />
        <span className="fw-bold">Date of birth: </span>{data?.dateBorn} <br />
       <span className="fw-bold">Place of birth: </span>{data?.strBirthLocation}
      </p>
      <p className="text-secondary p-0 fs-5 lh-sm">{data?.strDescriptionEN}</p>
    </>
  );
};

export default DriverDB;
