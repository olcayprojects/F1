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
        <div className="w-50 mx-auto table-responsive-sm">
          <table className="table table-dark table-bordered">
            <thead className="">
              <tr className="">
                <th className="bg-danger p-0 m-0">Team</th>
                <th className="p-0 m-0">Country</th>
                <th className="bg-danger p-0 m-0">Date of Birth</th>
                <th className="p-0 m-0">Place of Birth</th>
              </tr>
            </thead>
            <tbody className="">
              <tr className="">
                <td className="text-uppercase p-0 op">
                  {data?.strNumber
                    ? data?.strTeam + " #" + data?.strNumber
                    : data?.strTeam}
                  <br />
                </td>

                <td className="text-uppercase p-0">
                  {data?.strNationality} <br />
                </td>

                <td className="p-0 op">
                  {new Date(data?.dateBorn).toDateString()} <br />
                </td>

                <td className="p-0">{data?.strBirthLocation}</td>
              </tr>
            </tbody>
          </table>
        </div>
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
