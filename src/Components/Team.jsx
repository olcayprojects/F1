import React, { useEffect, useState, useRef } from "react";

const Team = ({ constructor, teamName, ls }) => {
  const [data, setData] = useState([]);
  const [foundTeam, setFoundTeam] = useState(null);
  const previousDataRef = useRef(null); // Önceki veriyi tutar

  const url = `https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=Formula 1`;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url);
        const item = await response.json();

        const newDataStr = JSON.stringify(item?.teams || []);
        const prevDataStr = JSON.stringify(previousDataRef.current || []);

        if (newDataStr !== prevDataStr) {
          setData(item?.teams || []);
          previousDataRef.current = item?.teams || [];
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [url]);

  useEffect(() => {
    if (data.length > 0) {
      const changedTeamname =
        teamName === "Renault" ? "BWT Alpine Formula One Team" : teamName;

      const team = data.find((teams) => {
        if (!changedTeamname) return false;

        const target = changedTeamname.toLowerCase();

        return (
          (typeof teams?.strTeam === "string" &&
            teams.strTeam.toLowerCase().includes(target)) ||
          (typeof teams?.strTeamAlternate === "string" &&
            teams.strTeamAlternate.toLowerCase().includes(target))
        );
      });

      setFoundTeam(team || null);
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
          <div key={index}>
            <img
              className="img-fluid border border-dark"
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
            className="img-fluid me-1 object-fit-md-cover object-fit-sm-none animate__flip animate__animated animate__slower"
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
          <div key={index} className="container-fluid p-0">
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
              {teams?.strDescriptionEN && (
                <>
                  <h6 className="text-info bg-dark text-center">English</h6>
                  {teams?.strDescriptionEN}
                </>
              )}
              {teams?.strDescriptionDE && (
                <>
                  <h6 className="text-info bg-dark text-center">Deutsch</h6>
                  {teams?.strDescriptionDE}{" "}
                </>
              )}
              {teams?.strDescriptionFR && (
                <>
                  <h6 className="text-info bg-dark text-center">Français</h6>
                  {teams?.strDescriptionFR}{" "}
                </>
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
