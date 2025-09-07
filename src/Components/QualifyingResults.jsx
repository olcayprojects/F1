import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "./Loading";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const QualifyingResults = (props) => {
  const [sdata, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  let navigate = useNavigate();
  let animate = "animate__animated animate__tada animate__slow";

  const timeToMillis = (timeStr) => {
    if (!timeStr) return null;
    const [min, sec] = timeStr.split(":");
    return parseInt(min) * 60000 + parseFloat(sec) * 1000;
  };

  const { season2 = new Date().getFullYear() } = useParams();
  const { rounds = 0 } = useParams();

  let url = "";
  if (props.season !== undefined) {
    url = `${BASE_URL}/${props.season}/${props.round}/qualifying.json`;
  } else {
    url = `${BASE_URL}/${season2}/${rounds}/qualifying.json`;
  }

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data["MRData"].RaceTable.Races);
        setIsLoaded(true);
      })
      .catch((err) => {
        // console.log(err);
        setIsLoaded(true);
      });
  }, [url]);

  if (!isLoaded) {
    return <Loading />;
  }

  return sdata.length ? (
    <div className="container-fluid p-0">
      <div
        className={"table-responsive border border-dark border-5 " + animate}
      >
        <table className="myTable table table-dark table-striped table-bordered border-dark">
          <thead className="">
            <tr className="text-black text-center">
              <th className="bg-dark border-4 border-primary text-light py-0">
                P
              </th>
              <th className="border-4 border-light bg-dark text-light py-0">
                No
              </th>
              <th className="bg-dark text-info border-4 border-info text-end py-0">
                <span className="bg-black px-1 bg-gradient">DRIVER</span>
              </th>
              <th className="bg-dark text-info border-4 border-info text-start py-0">
                <span className="bg-black bg-gradient px-1">TEAM</span>
              </th>
              <th className="border-4 bg-dark border-success text-success py-0">
                Q3
              </th>
              <th className="border-4 border-warning text-warning bg-dark py-0">
                Q2
              </th>
              <th className="py-0 border-4 border-danger text-danger bg-dark">
                Q1
              </th>
            </tr>
          </thead>
          {sdata?.map((item, index) => {
            return (
              <tbody key={index}>
                {item?.QualifyingResults?.map((qualifying, indexQ, arr) => {
                  const firstQ3Millis = timeToMillis(arr[0]?.Q3);
                  const currentQ3Millis = timeToMillis(qualifying?.Q3);

                  const prevQ3Millis =
                    indexQ > 0 ? timeToMillis(arr[indexQ - 1]?.Q3) : null;

                  const diffPrevMillis =
                    currentQ3Millis && prevQ3Millis
                      ? currentQ3Millis - prevQ3Millis
                      : null;

                  const diffFirstMillis =
                    currentQ3Millis && firstQ3Millis
                      ? currentQ3Millis - firstQ3Millis
                      : null;

                  const formatDiff = (diff) =>
                    diff !== null
                      ? (diff >= 0 ? "+" : "") + (diff / 1000).toFixed(3) + "s"
                      : "";

                  const diffPrevStr = formatDiff(diffPrevMillis);
                  const diffFirstStr = formatDiff(diffFirstMillis);

                  return (
                    <tr
                      key={indexQ}
                      className={"align-middle" + (indexQ === 0 ? " fs-6" : "")}
                    >
                      <td className="text-center op">
                        {qualifying.position < 4 ? (
                          <span className="border border-primary fw-bold bg-light text-black px-1">
                            {qualifying.position}
                          </span>
                        ) : (
                          <span className="bg-black border-primary border px-1">
                            {qualifying.position}
                          </span>
                        )}
                      </td>
                      <td className="text-center py-0">{qualifying.number}</td>
                      <td className={"col-5 op py-0 text-end"}>
                        <span
                          className="fw-bold text-info bg-black px-1 cp bg-gradient"
                          onClick={() => {
                            navigate(
                              "/ResultsDriver/" + qualifying.Driver.driverId
                            );
                          }}
                        >
                          {qualifying.Driver.givenName +
                            " " +
                            qualifying.Driver.familyName.toUpperCase()}
                        </span>
                        <span className="text-black opacity-50 bg-info px-1 fst-italic fw-light">
                          {qualifying.Driver.nationality}
                        </span>
                      </td>
                      <td className={"col-5 op py-0"}>
                        <span
                          className="fw-bold fst-italic text-black px-2 bg-info cp"
                          onClick={() => {
                            navigate(
                              "/ConstructorsResult/" +
                                qualifying?.Constructor?.constructorId +
                                "/" +
                                item.season
                            );
                          }}
                        >
                          {qualifying.Constructor.name.toUpperCase()}
                        </span>
                        <span className="text-black opacity-50 bg-info px-2 fst-italic fw-light">
                          {qualifying.Constructor.nationality}
                        </span>
                      </td>
                      <td className="text-center py-1">
                        <span
                          className={
                            "d-block bg-black px-1 text-success fw-bold align-middle bg-gradient"
                          }
                        >
                          {qualifying?.Q3 ? qualifying?.Q3 : "-"}
                          {qualifying?.Q3 && diffFirstStr && indexQ !== 0 && (
                            <small className="text-light ms-2">
                              {diffFirstStr}
                            </small>
                          )}
                          {qualifying?.Q3 && diffPrevStr && indexQ > 1 && (
                            <small className="text-primary ms-1">
                              ({diffPrevStr})
                            </small>
                          )}
                        </span>
                      </td>

                      <td className="text-center op py-0 ">
                        <span
                          className={
                            "d-block bg-black px-1 fw-bold text-warning bg-gradient"
                          }
                        >
                          {qualifying?.Q2 || "-"}
                        </span>
                      </td>
                      <td className="text-center fw-bolder align-middle py-0">
                        <span
                          className={
                            "d-block bg-black px-1 text-danger bg-gradient"
                          }
                        >
                          {qualifying?.Q1 || "-"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  ) : (
    <h4 className="text-center text-danger">Data not found!</h4>
  );
};

export default QualifyingResults;
