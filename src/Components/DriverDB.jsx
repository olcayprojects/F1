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
        src={data?.strRender ? data?.strRender : data?.strCutout + "/preview"}
        alt=""
        title=""
        srcSet=""
      />
      <div>
        <span className="">Team: </span>
        <span className="fw-bold">
          {data?.strTeam} #{data?.strNumber} <br />
        </span>
        <span className="">Country: </span>
        <span className="fw-bold">
          {data?.strNationality} <br />
        </span>
        <span className="">Date of birth: </span>
        <span className="fw-bold">
          {new Date(data?.dateBorn).toDateString()} <br />
        </span>
        <span className="">Place of birth: </span>
        <span className="fw-bold">{data?.strBirthLocation}</span>
      </div>
      <pre
        className="text-start lh-sm text-secondary p-0"
        style={{ whiteSpace: "pre-wrap" }}
      >
        {data?.strDescriptionEN ? (
          <>
            <h6 className="text-info bg-dark text-center">English</h6>
            {data?.strDescriptionEN}
          </>
        ) : (
          ""
        )}
        {data?.strDescriptionDE ? (
          <>
            <h6 className="text-info bg-dark text-center">Deutsch</h6>
            {data?.strDescriptionDE}
          </>
        ) : (
          ""
        )}
        {data?.strDescriptionFR ? (
          <>
            <h6 className="text-info bg-dark text-center">Français</h6>
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
