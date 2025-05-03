import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import Nav from "./Nav";
import { DrvInfo } from "./DriverInfo";
import { fetchDriverStandings, setYear } from "../redux/driverStandingsSlice";

const DriverStandings = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { standings, prevStandings, year, isLoading } = useSelector(
    (state) => state.driverStandings
  );

  useEffect(() => {
    dispatch(fetchDriverStandings(props.season || year));
  }, [dispatch, year, props.season]);

  const handleYearChange = (e) => {
    dispatch(setYear(e.target.value));
  };

  if (isLoading) return <Loading />;

  return (
    <div className="container-fluid">
      {props.tab !== "1" && <Nav />}
      <div className="d-flex align-items-center justify-content-center">
        <select
          className="px-4 w-auto bg-black text-danger border-danger fw-bold fs-4 me-1 px-2"
          value={year}
          onChange={handleYearChange}
        >
          {Array.from(
            { length: 2025 - 1950 + 1 },
            (_, index) => 2025 - index
          ).map((yearOption) => (
            <option key={yearOption} value={yearOption}>
              {yearOption}
            </option>
          ))}
        </select>
        <h2 className="text-center fw-bold m-0 text-danger">
          DRIVER STANDINGS
        </h2>
      </div>

      <div className="d-block align-items-center">
        {standings?.map((driver, indexedDB) => {
          return driver.positionText === "1" ? (
            <div key={indexedDB}>
              <DrvInfo
                drv={driver.Driver?.givenName + " " + driver.Driver?.familyName}
                s="1"
              />
            </div>
          ) : null;
        })}

        <div className="table-responsive me-1">
          <table className="myTable table table-dark table-striped table-bordered border-dark">
            <thead className="border-5 fs-6">
              <tr>
                <th className="text-center py-0">P</th>
                <th className="text-center p-0 bi-arrow-down-up"></th>
                <th className="text-black-50 bg-info py-0 op">DRIVER INFO</th>
                <th className="py-0 bg-warning text-black-50">CONSTRUCTOR</th>
                <th className="text-center op py-0 bg-light text-black-50">
                  POINTS
                </th>
                <th className="text-center py-0 bg-primary text-black-50">
                  WINS
                </th>
              </tr>
            </thead>
            <tbody>
              {standings?.map((driver) => {
                const driverId = driver.Driver.driverId;

                const prev = prevStandings?.find(
                  (d) => d.Driver.driverId === driverId
                );

                let positionDiff = null;
                let positionIcon = null;

                if (prev) {
                  const currentPos = parseInt(driver.position);
                  const prevPos = parseInt(prev.position);

                  if (!isNaN(currentPos) && !isNaN(prevPos)) {
                    const diff = prevPos - currentPos;
                    if (diff > 0) {
                      positionDiff = `↑ ${diff}`;
                      positionIcon = "text-success";
                    } else if (diff < 0) {
                      positionDiff = `↓ ${-diff}`;
                      positionIcon = "text-danger";
                    } else {
                      positionDiff = "--";
                      positionIcon = "text-secondary";
                    }
                  }
                }

                return (
                  <tr key={driverId}>
                    <td className="text-center fw-bold py-1 op">
                      {driver.position}
                    </td>
                    <td className={`p-0 py-1 text-center  ${positionIcon}`}>
                      {positionDiff && <span className="">{positionDiff}</span>}
                    </td>
                    <td
                      className="cp py-1 fw-bold"
                      onClick={() => {
                        navigate("/ResultsDriver/" + driver.Driver.driverId);
                      }}
                    >
                      <span className="text-info fw-bolder px-1 bg-black">
                        {`${
                          driver.Driver.givenName
                        } ${driver.Driver.familyName.toUpperCase()}`}
                      </span>

                      <span className="fst-italic text-info-emphasis ps-1">
                        {driver.Driver.code &&
                          `(${
                            driver.Driver.permanentNumber
                              ? "#" + driver.Driver.permanentNumber
                              : ""
                          })`}
                        {driver.Driver.dateOfBirth +
                          " " +
                          driver.Driver.nationality.toUpperCase()}
                      </span>
                    </td>
                    <td
                      className="op cp fw-bold fst-italic text-warning py-1 ps-2"
                      onClick={() => {
                        navigate(
                          "/ConstructorsResult/" +
                            driver.Constructors[0].constructorId +
                            "/" +
                            year
                        );
                      }}
                    >
                      <span className="bg-black px-1">
                        {driver.Constructors && driver.Constructors[0] && (
                          <span>
                            {driver.Constructors[0].name.toUpperCase()}
                          </span>
                        )}
                      </span>

                      <span className="ps-2  text-warning-emphasis px-2">
                        {driver.Constructors[0]?.nationality.toUpperCase()}
                      </span>

                      <span className="px-2">
                        {driver.Constructors?.slice(1).map(
                          (constructor, index) => (
                            <span
                              key={index}
                              style={{
                                textDecorationLine: "line-through",
                                color: "gray",
                              }}
                            >
                              {constructor.name.toUpperCase()}
                              {index < driver.Constructors.length - 2 && ", "}
                            </span>
                          )
                        )}
                      </span>
                    </td>

                    <td className="text-center text-light py-1">
                      <span
                        className={
                          "fw-bold d-block " +
                          (driver?.points === "0"
                            ? "text-secondary"
                            : "bg-black")
                        }
                      >
                        {driver.points}
                      </span>
                    </td>
                    <td className="text-center text-primary py-1 op">
                      <span
                        className={
                          "fw-bold d-block " +
                          (driver?.wins === "0" ? "text-secondary" : "bg-black")
                        }
                      >
                        {driver.wins}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DriverStandings;
