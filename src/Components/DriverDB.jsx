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
  console.log(data);

  return (
    <>
          <img
        className="img-fluid w-25"
        style={{width: "", height: "" }}
        src={data?.strRender?  data?.strRender + "/preview":data?.strCutout + "/preview"}
        alt=""
        title={data?.strDescriptionEN}
        srcSet=""
      />
      <p className="p-0">
        Team: {data?.strTeam} #{data?.strNumber} <br />
        Country: {data?.strNationality} <br />
        Date of birth: {data?.dateBorn} <br />
        Place of birth: {data?.strBirthLocation}
      </p>
      <p className="p-0">{data?.strDescriptionEN}</p>
    </>
  );
};

export default DriverDB;
