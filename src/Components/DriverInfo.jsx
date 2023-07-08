import React from "react";
import { useEffect, useState } from "react";

export const DrvInfo = (props) => {
  const [data1, setData] = useState();

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
        .then((data) => {
          setData(data["player"][0]);
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
        className="img-fluid"
        style={{ width: "", height: "" }}
        src={data1?.strCutout + "/preview"}
        alt=""
        title={data1?.strDescriptionEN}
        srcSet=""
      />
    </>
  );
};
