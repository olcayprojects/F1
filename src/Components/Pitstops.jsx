import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DriverId from "./DriverId";
import Loading from "./Loading";

const Pitstops = (props) => {
  const [sdata, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  let navigate = useNavigate();
  const { season2 = "2023" } = useParams();
  const { rounds = 0 } = useParams();

  let url = "";
  if (props.season !== undefined) {
    url = `https://ergast.com/api/f1/${props.season}/${props.round}/pitstops.json?limit=100`;
  } else {
    url = `https://ergast.com/api/f1/${season2}/${rounds}/pitstops.json?limit=100`;
  }

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data["MRData"].RaceTable.Races);
        setIsLoaded(true);
      })
      .catch((err) => {
        if (!err === "Unexpected token") {
          console.log(err.message);
        }
      });
  }, [url]);

  if (!isLoaded) return <Loading />;
  return (
    <div className="container p-0">
      <div className="table-responsive">
        {sdata?.map((data, index) => {
          return (
            <table
              key={index}
              className="table table-dark table-striped table-bordered"
            >
              <thead className="border-dark">
                <tr className="text-black">
                  <th className="bg-danger op">#</th>
                  <th className="bg-danger">DRIVER INFO</th>
                  <th className="bg-danger text-center op">STOPS</th>
                  <th className="bg-danger text-center">LAP</th>
                  <th className="text-center bg-danger op">TIME OF DAY</th>
                  <th className="text-center bg-danger">DURATION</th>
                </tr>
              </thead>
              <tbody className="text-danger">
                {data?.PitStops.map((ps, index) => {
                  return (
                    <tr key={index} className="align-middle">
                      <td className="col-1 op">{index + 1}</td>
                      <td
                        className="col-4 fw-bold text-info cp"
                        style={{ textTransform: "" }}
                        onClick={() => {
                          navigate("/ResultsDriver/" + ps.driverId);
                        }}
                      >
                        <DriverId Id={ps.driverId} ls={1}></DriverId>
                        {/* {ps.driverId} */}
                      </td>
                      <td className="col-1 text-center op fw-bold">
                        {ps.stop}
                      </td>
                      <td className="col-1 text-center fw-bold">{ps.lap}</td>
                      <td
                        className="col-3 text-center op fw-bold"
                        style={{ fontFamily: "Lucida Console" }}
                      >
                        <span className="bg-black d-block p-1">{ps.time}</span>
                      </td>
                      <td
                        className="col-3 text-center fw-bold"
                        style={{ fontFamily: "Lucida Console" }}
                      >
                        <span className="bg-black d-block p-1">
                          {ps.duration}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          );
        })}
      </div>
    </div>
  );
};

export default Pitstops;
