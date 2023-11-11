import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "./Loading";

const QualifyingResults = (props) => {
  const [sdata, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);
  let navigate = useNavigate();

  const { season2 = "2023" } = useParams();
  const { rounds = 0 } = useParams();

  let url = "";
  if (props.season !== undefined) {
    url = `https://ergast.com/api/f1/${props.season}/${props.round}/qualifying.json`;
  } else {
    url = `https://ergast.com/api/f1/${season2}/${rounds}/qualifying.json`;
  }

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setIsLoaded(false);
        setData(data["MRData"].RaceTable.Races);
        // console.log(data["MRData"].RaceTable.Races[0].raceName);
      })
      .catch((err) => {
        if (!err === "Unexpected token") {
          console.log(err.message);
          setIsLoaded(true);
        }
      });
  }, [url]);

  if (isLoaded) {
    return <Loading />;
  }

  return (
    <div className="container p-0">
      <div className="table-responsive">
        <table className="table table-dark table-striped table-bordered">
          <thead className="">
            <tr className="text-black">
              <th className="bg-danger text-center op">P</th>
              <th className="bg-danger text-center">NO</th>
              <th className="bg-danger op">D R I V E R</th>
              <th className="text-center bg-danger">Q3</th>
              <th className="text-center bg-danger op">Q2</th>
              <th className="text-center bg-danger">Q1</th>
            </tr>
          </thead>
          {sdata?.map((item, index) => {
            return (
              <tbody key={index}>
                {item?.QualifyingResults?.map((qualifying, indexQ) => {
                  return (
                    <tr key={indexQ} className="align-middle">
                      <td className="p-0 text-center op">
                        {qualifying.position < 4 ? (
                          <i
                            className={
                              "text-info bi bi-" +
                              qualifying.position +
                              "-square"
                            }
                          ></i>
                        ) : (
                          qualifying.position
                        )}
                      </td>
                      <td className="text-center p-0">{qualifying.number}</td>
                      <td className="col-5 op">
                        <span
                          className="fw-bold text-info bg-black px-1 p-1 cp"
                          onClick={() => {
                            navigate(
                              "/ResultsDriver/" + qualifying.Driver.driverId
                            );
                          }}
                        >
                          {qualifying.Driver.givenName +
                            " " +
                            qualifying.Driver.familyName}
                        </span>

                        <span
                          className="fw-bold fst-italic text-black px-1 p-1 bg-info cp"
                          onClick={() => {
                            navigate(
                              "/ConstructorsResult/" +
                                qualifying?.Constructor?.constructorId +
                                "/" +
                                item.season
                            );
                          }}
                        >
                          {qualifying.Constructor.name}
                        </span>
                      </td>
                      <td className="col-2 text-center ">
                        <span
                          className={
                            qualifying?.Q3
                              ? "bg-black d-block text-success fw-bold p-2 align-middle"
                              : null
                          }
                        >
                          {qualifying?.Q3}
                        </span>
                      </td>
                      <td className="col-2 text-center op">
                        <span
                          className={
                            qualifying?.Q2
                              ? "bg-black d-block p-2 fw-bold text-warning"
                              : null
                          }
                        >
                          {qualifying?.Q2}
                        </span>
                      </td>
                      <td className="col-2 text-center fw-bolder align-middle">
                        <span
                          className={
                            qualifying?.Q1
                              ? "bg-black d-block p-2 text-danger"
                              : null
                          }
                        >
                          {qualifying?.Q1}
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
  );
};

export default QualifyingResults;
