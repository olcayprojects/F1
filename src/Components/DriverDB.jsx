import React from "react";
import { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import PlayerProfile from "./PlayerProfile";

const DriverDB = (props) => {
  const [data, setData] = useState();
  const [err, setErr] = useState(true);
  const [playerId, setPlayerId] = useState();
  const [drvr, setDrvr] = useState("");

  // `drvr`'yi ilk başta props'dan normalize et
  useEffect(() => {
    let normalizedDrvr = props.drv
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace("-", "_")
      .replace(" ", "_");

    if (normalizedDrvr === "carlos_sainz") {
      normalizedDrvr = "carlos_sainz_jr";
    }

    setDrvr(normalizedDrvr);
  }, [props.drv]);

  const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${drvr}`;

  console.log(url);

  useEffect(() => {
    if (!drvr) return;

    function fetchData() {
      fetch(url)
        .then((response) => response.json())
        .then((items) => {
          const player = items["player"]?.find(
            (player) =>
              player["strPlayer"]
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .replace("-", "_")
                .replace(" ", "_")
                .replace(" ", "_") === drvr
          );

          if (player) {
            setData(player);
            setPlayerId(player.idPlayer);
          }
        })
        .catch((err) => {
          console.log(err.message);
          setErr(false);
        });
    }

    fetchData();
  }, [url, drvr]); //

  return err ? (
    <>
      {/* {data?.strCutout && (
        <img
          className="img-fluid w-25 "
          style={{ width: "", height: "" }}
          src={data?.strCutout}
          alt=""
          title=""
        />
      )}
      <img
        className="img-fluid w-25 "
        style={{ width: "", height: "" }}
        src={data?.strThumb ? data?.strThumb : data?.strCutout}
        alt=""
        title=""
      />
      <div
        className="fw-bold border-bottom border-info border-3 rounded-pill"
        style={{ color: "#62c6a5" }}
      ></div>
      <pre
        className="text-start lh-md p-0 fw-bold"
        style={{ whiteSpace: "pre-wrap", color: "#62b6a5" }}
      ></pre> */}
      {playerId && <PlayerProfile playerId={playerId} />}
    </>
  ) : null;
};

export default DriverDB;
