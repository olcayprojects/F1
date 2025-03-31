import React from "react";
import { useEffect, useState } from "react";
import Loading from "./Loading";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;


const Constructor = (props) => {
  let url = `${BASE_URL}/${props.year}/constructors.json`;

  const [sdata, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    function fetchData() {
      fetch(url)
        .then((response) => response.json())
        .then((items) => {
          setIsLoaded(true);

          setData(items["MRData"]?.ConstructorTable?.Constructors);
        })
        .catch((err) => {
          console.log("Hata:", err.message);
          setIsLoaded(true);
        });
    }
    fetchData();
  }, [url]);

  if (!isLoaded) {
    return <Loading />;
  } else {
    return sdata?.map((item, index) => {
      return (
        <option key={index} value={item.constructorId}>
          {item?.name}
        </option>
      );
    });
  }
};

export default Constructor;
