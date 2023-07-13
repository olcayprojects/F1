import { useEffect, useState } from "react";
import axios from "axios";

export default function DriverId(props) {
  const [sdata, setData] = useState();

  let url = `https://ergast.com/api/f1/drivers/${props.Id}.json`;

  useEffect(() => {
    axios.get(url).then((response) => {
      setData(response.data["MRData"].DriverTable.Drivers[0]);
    });
  }, [url]);

  if (sdata) {
    return sdata.givenName + " " + sdata.familyName;
  }
  else{
    return props.Id
  }
}
