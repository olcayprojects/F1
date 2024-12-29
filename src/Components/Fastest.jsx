import { useState, useCallback, useEffect } from "react";
import axios from "axios";

const Fastest = (props) => {
  const [sdata, setData] = useState();
  const [isLoaded, setIsLoaded] = useState(false);

  let url;
  if (props) {
    url = `https://ergast.com/api/f1/${props.season}/${props.round}/fastest/1/results.json`;
  }

  const fetchFastest = useCallback(() => {
    axios
      .get(url)
      .then((res) => {
        setData(res?.data["MRData"].RaceTable.Races[0]?.Results[0]);
        setIsLoaded(true);
      })
      .catch((e) => console.log(e));
  }, [url]);

  useEffect(() => {
    fetchFastest();
  }, [fetchFastest]);

  if (!isLoaded) {
    return <h6>Loading...</h6>;
  } else {
    return sdata ? (
      <div className="">
        {sdata?.position > 10 ? (
          <>
            <h6 className="text-info m-0">
              Fastest Lap: {sdata?.laps} | {sdata?.FastestLap?.Time.time} |{" "}
              {sdata?.FastestLap?.AverageSpeed.speed}{" "}
              {sdata?.FastestLap?.AverageSpeed.units}
            </h6>
            <span className="fw-bold">
              <u>{sdata?.Driver?.familyName}</u> fastest lap of the race.
            </span>
          </>
        ) : (
          <>
            <h6 className="text-info m-0">
              Fastest Lap: {sdata?.laps} | {sdata?.FastestLap?.Time.time} |{" "}
              {sdata?.FastestLap?.AverageSpeed.speed}{" "}
              {sdata?.FastestLap?.AverageSpeed.units}
            </h6>
            <span className="fw-bold">
              <u>{sdata?.Driver?.familyName}</u> scored an additional point for
              setting the fastest lap of the race.
            </span>
          </>
        )}
      </div>
    ) : (
      <span className="text-danger fw-bold">Fastest Lap Data Not Found!</span>
    );
  }
};

export default Fastest;
