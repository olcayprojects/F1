import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";


export default function DriverId(props) {
  const [sdata1, setData] = useState();

  let url = "";

  url = `https://ergast.com/api/f1/drivers/${props.Id}.json`;
  //console.log(url);

  let datalar=""
  useEffect(() => {
    
    
    axios.get(url).then((response) => {
      
      
        setData(response.data["MRData"].DriverTable.Drivers[0]);



      });


  }, [url]);

  
  if (sdata1!==undefined) {
    console.log("sdata",sdata1);
  return (
    // sdata.givenName+" "+sdata.familyName
      
    sdata1.givenName+" "+sdata1.familyName
      );
    }
}
