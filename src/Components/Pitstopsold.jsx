import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DriverId from "./DriverId";
import Loading from "./Loading";
import Duration from "./Duration";

const Pitstops = (props) => {
  const [sdata, setData] = useState([]);
  const [dur, setDur] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);
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
    setIsLoaded(true);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data["MRData"].RaceTable.Races);
        setIsLoaded(false);
      })
      .catch((err) => {
        setIsLoaded(false);
        console.log(err.message);
      });
  }, [url]);

  if (isLoaded) return <Loading />;
  return sdata.length ? (
    <div className="container p-0 border border-dark border-5">
      <div className="table-responsive">
        <table className="table table-dark table-striped table-bordered">
          <thead className="border-dark">
            <tr className="text-black align-middle">
              <th className="bg-danger op text-center py-0">#</th>
              <th className="bg-danger py-0">DRIVER INFO</th>
              <th className="bg-danger text-center op py-0">STOPS</th>
              <th className="bg-danger text-center py-0">LAP</th>
              <th className="text-center bg-danger op py-0">TIME OF DAY</th>
              <th className="text-center bg-danger py-0">DURATION</th>
              <th className="text-center bg-danger op py-0">TOTAL DURATION</th>
            </tr>
          </thead>
          <tbody className="text-danger">
            {sdata[0]?.PitStops.map((ps, index) => {
              return (
                <tr key={index} className="align-middle">
                  <td className="op text-center px-1 py-0">{index + 1}</td>
                  <td
                    className="col-auto fw-bold text-info cp py-0"
                    style={{ textTransform: "" }}
                    onClick={() => {
                      navigate("/ResultsDriver/" + ps.driverId);
                    }}
                  >
                    <DriverId Id={ps.driverId} ls={1}></DriverId>
                    {/* {ps.driverId} */}
                  </td>
                  <td className="text-center op fw-bold py-0">{ps.stop}</td>
                  <td className="text-center fw-bold py-0">{ps.lap}</td>
                  <td
                    className="text-center op fw-bold py-0"
                    style={{ fontFamily: "Lucida Console" }}
                  >
                    <span className="">{ps.time}</span>
                  </td>
                  <td
                    className="text-center fw-bold py-0"
                    style={{ fontFamily: "Lucida Console" }}
                  >
                    <span className="">{ps.duration}</span>
                  </td>
                  <td
                    className="col-1 text-center fw-bold op py-0"
                    style={{ fontFamily: "Arial Black" }}
                  >
                    <span
                      className={
                        index % 2 !== 0 ? "bg-black px-2" : "bg-secondary px-2"
                      }
                    >
                      <Duration data={sdata} driverid={ps.driverId} />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <h4 className="text-center">Data Not Found!</h4>
  );
};

export default Pitstops;
