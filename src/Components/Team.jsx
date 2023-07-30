import React from "react";
import { useEffect, useState } from "react";

const Team = (props) => {
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

  return data?.map((teams, index) => {
    if (teams.strTeam === "Scuderia AlphaTauri") {
      teams.strTeam = "AlphaTauri";
    }

    if (props?.teamName?.substring(0, 4) === teams?.strTeam?.substring(0, 4)) {
      return (
        <div key={index} className="container p-0" style={{}}>
          <img
            className="img-fluid w-25 imgrun"
            style={{}}
            src={teams?.strTeamJersey + "/preview"}
            alt=""
            srcSet=""
            title={teams?.strDescriptionEN}
          />
          <img
            className="img-fluid w-25"
            style={{}}
            src={teams?.strTeamBadge + "/preview"}
            alt=""
            srcSet=""
            title=""
          />
        </div>
      );
    } else {
      // console.log(teams);
    }
  });
};

export default Team;
