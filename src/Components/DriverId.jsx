import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loading";

export default function DriverId(props) {
  const [sdata, setData] = useState();
  const [isLoaded, setIsLoaded] = useState(false);

  //  console.log(props.ls);

  let url = `https://ergast.com/api/f1/drivers/${props.Id}.json`;

  useEffect(() => {
    axios.get(url).then((response) => {
      // console.log(response.data["MRData"]);
      setData(response.data["MRData"].DriverTable.Drivers[0]);
      setIsLoaded(true);
    });
  }, [url]);

  if (!isLoaded) {
    // return <Loading />;
    return <span>{props.Id}</span>;
  } else {
    if (props.ls === 1) {
      return (
        <>
          {/* <span className="pe-1">{sdata?.code}</span> */}
          <span className="px-1 bg-black">
            {sdata?.givenName} {sdata?.familyName.toUpperCase()}
          </span>
          <span className="bg-secondary px-1 text-black">
            {sdata?.permanentNumber}
          </span>
          <span className="bg-black px-1 text-info">
            {sdata?.code
              ? sdata?.code
              : sdata?.familyName.substring(0, 3).toUpperCase()}
          </span>
          <span className="fw-light px-1 fst-italic text-secondary">
            {sdata?.nationality}
          </span>
          {/* <span>{sdata?.dateOfBirth} </span> */}
        </>
      );
    } else if (props.ls === 2) {
      return (
        <div className="fw-bold">
          <span className="bg-black text-info px-2">{sdata?.givenName}</span>
          <span className="bg-black text-success">{sdata?.familyName}</span>
          <span className="bg-black text-success  px-1">
            ({sdata?.permanentNumber})
          </span>
          <span className="px-1 fw-normal text-warning">
            {sdata?.nationality}
          </span>
          <span className="fw-normal text-warning">
            {new Date(sdata?.dateOfBirth).toDateString()}
          </span>
        </div>
      );
    } else {
      return (
        <td
          className="op fw-bold py-0"
          title={sdata.givenName + " " + sdata.familyName}
        >
          {sdata?.code}
          {/* <span className=""> ({sdata?.permanentNumber})</span> */}
        </td>
      );
    }
  }
}
