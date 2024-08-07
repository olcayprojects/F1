import { useState, useCallback, useEffect } from "react";
import axios from "axios";

const Fastest = (props) => {
  const [sdata, setData] = useState([]);

  let url;
  if (props) {
    url = `https://ergast.com/api/f1/${props.season}/${props.round}/fastest/1/results.json`;
  }

  const fetchFastest = useCallback(() => {
    axios
      .get(url)
      .then((res) => {
        setData(res?.data["MRData"].RaceTable.Races[0].Results[0]);
      })
      .catch((e) => console.log(e));
  }, [url]);

  useEffect(() => {
    fetchFastest();
  }, [fetchFastest]);

  return (
    <div className="text-light">
      Note - {sdata.Driver?.familyName} scored an additional point for setting the fastest lap of the race.
    </div>
  );
};

export default Fastest;
