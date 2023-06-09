import React from "react";
import { useEffect, useState } from "react";
import Caro from "react-bootstrap/Carousel";

const Carousel = () => {
  const [data, setData] = useState([]);

  let url = "";
  url = `https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=Formula 1`;

  useEffect(() => {
    function fetchData() {
      fetch(url)
        .then((response) => response.json())
        .then((item) => {
          setData(item.teams);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
    fetchData();
  }, [url]);

  return (
    <Caro
    controls={false}
    indicators={false}
    fade={true}
    
    >
      {data.map((item, i) => {
        return (
          <Caro.Item interval={1000} key={i}>
<h2 style={{fontFamily:"fantasy", transform:"scaleX(-1)"}} className="text-danger float-start">{item.strTeam}</h2>
            <img style={{width:"400px", height:"100px" ,objectFit:"cover"}} className="rounded float-start p-0" src={item.strTeamJersey} srcSet="" alt="" />
<h2 style={{fontFamily:"fantasy"}} className="text-danger float-end">{item.strTeam}</h2>
            <img style={{width:"400px", height:"100px" ,objectFit:"cover",transform:"scaleX(-1)"}} className="rounded float-end p-0" src={item.strTeamJersey+""} srcSet="" alt="" />
          </Caro.Item>
        );
      })}
    </Caro>
  );
};

export default Carousel;
