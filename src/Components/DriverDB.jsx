import React from "react";
import { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";

const DriverDB = (props) => {
  const [data, setData] = useState();
  const [err, setErr] = useState(true);

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
          setErr(false);
        });
    }
    fetchData();
  }, [url]);

  return err ? (
    <>
      <img
        className="img-fluid w-25 "
        style={{ width: "", height: "" }}
        src={data?.strRender ? data?.strRender : data?.strCutout}
        alt=""
        title=""
      />
      <div
        className="fw-bold border-bottom border-info border-3 rounded-pill"
        style={{ color: "#62c6a5" }}
      >
        <span className="">TEAM: </span>
        <span className="">
          {data?.strTeam} #{data?.strNumber} <br />
        </span>
        <span className="">COUNTRY: </span>
        <span className="">
          {data?.strNationality} <br />
        </span>
        <span className="">Date of Birth: </span>
        <span className="">
          {new Date(data?.dateBorn).toDateString()} <br />
        </span>
        <span className="">Place of Birth: </span>
        <span className="">{data?.strBirthLocation}</span>
      </div>
      <pre
        className="text-start lh-md p-0 fw-bold"
        style={{ whiteSpace: "pre-wrap", color: "#62b6a5" }}
      >
        {data?.strDescriptionEN ? (
          <>
            <h5 className="text-info bg-dark text-center">English</h5>
            {data?.strDescriptionEN}
          </>
        ) : (
          ""
        )}
        {data?.strDescriptionDE ? (
          <>
            <h5 className="text-info bg-dark text-center">Deutsch</h5>
            {data?.strDescriptionDE}
          </>
        ) : (
          ""
        )}
        {data?.strDescriptionFR ? (
          <>
            <h5 className="text-info bg-dark text-center">Français</h5>
            {data?.strDescriptionFR}
          </>
        ) : (
          ""
        )}
      </pre>
    </>
  ) : null;
};

export default DriverDB;
