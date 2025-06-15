import React, { useEffect, useState } from "react";

const Team = ({ constructor, teamName, ls }) => {
  const [data, setData] = useState([]);
  const [foundTeam, setFoundTeam] = useState(null);

  let url = `https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=Formula 1`;

  useEffect(() => {
    function fetchData() {
      fetch(url)
        .then((response) => response.json())
        .then((item) => {
          setData(item?.teams);
        })
        .catch((err) => {
          // console.log(err.message);
        });
    }
    fetchData();
  }, [url]);

  useEffect(() => {
    if (data.length > 0) {
      const changedTeamname =
        teamName === "Renault" ? "BWT Alpine Formula One Team" : teamName;

      const team = data.find(
        (teams) =>
          teams?.strTeam
            ?.toLowerCase()
            ?.includes(changedTeamname?.toLowerCase()) ||
          teams?.strTeamAlternate
            ?.toLowerCase()
            .includes(changedTeamname?.toLowerCase())
      );

      if (team) {
        setFoundTeam(team);
      } else {
        setFoundTeam(null);
      }
    }
  }, [data, teamName]);

  useEffect(() => {
    if (foundTeam) {
      constructor(foundTeam);
    }
  }, [foundTeam, constructor]);

  return data?.map((teams, index) => {
    if (teams?.strTeamAlternate === "Scuderia AlphaTauri") {
      teams.strTeam = "RB F1 Team";
    }

    if (foundTeam && teams?.strTeam === foundTeam.strTeam) {
      if (ls === 1) {
        return (
          <div className="" key={index}>
            <img
              className="img-fluid"
              style={{}}
              src={teams?.strLogo + "/tiny"}
              alt={teams?.strTeamAlternate}
              title={teams?.strDescriptionEN}
            />
          </div>
        );
      }
      if (ls === 2) {
        return (
          <img
            className="img-fluid me-1 object-fit-md-cover object-fit-sm-none  animate__flip animate__animated animate__slower"
            key={index}
            style={{
              width: "20%",
              height: "50px",
              objectPosition: "center",
            }}
            src={teams?.strEquipment + "/medium"}
            alt={teams?.strTeamAlternate}
            title={teams?.strDescriptionEN}
          />
        );
      } else {
        return (
          <div key={index} className="container-fluid  p-0">
            <div className="d-flex justify-content-center align-items-center gap-1">
              {teams?.strBanner && (
                <img
                  className="img-fluid"
                  src={teams.strBanner + "/small"}
                  alt={teams.strTeamAlternate}
                  title={teams.strTeam}
                />
              )}
              {teams?.strFanart1 && (
                <img
                  className="img-fluid"
                  src={teams.strFanart1 + "/small"}
                  alt={teams.strTeamAlternate}
                  title={teams.strTeam}
                />
              )}
            </div>

            <h5 className="text-center text-light fw-bold">
              {teams?.intFormedYear} {teams?.strCountry}
            </h5>
            <pre
              className="ps-1"
              style={{
                whiteSpace: "pre-wrap",
                color: "#62b6a5",
                lineHeight: "26px",
              }}
            >
              {teams?.strDescriptionEN ? (
                <>
                  <h6 className="text-info bg-dark text-center">English</h6>
                  {teams?.strDescriptionEN}
                </>
              ) : (
                ""
              )}
              {teams?.strDescriptionDE ? (
                <>
                  <h6 className="text-info bg-dark text-center">Deutsch</h6>
                  {teams?.strDescriptionDE}{" "}
                </>
              ) : (
                ""
              )}
              {teams?.strDescriptionFR ? (
                <>
                  <h6 className="text-info bg-dark text-center">Français</h6>
                  {teams?.strDescriptionFR}{" "}
                </>
              ) : (
                ""
              )}
            </pre>
          </div>
        );
      }
    } else {
      return null;
    }
  });
};

export default Team;
