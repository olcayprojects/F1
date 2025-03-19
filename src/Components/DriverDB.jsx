import React from "react";
import { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import PlayerProfile from "./PlayerProfile";

const DriverDB = (props) => {
  const [data, setData] = useState();
  const [err, setErr] = useState(true);
  const [playerId, setPlayerId] = useState();

  let url = "";
  url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${props.drv}`;

  useEffect(() => {
    function fetchData() {
      fetch(url)
        .then((response) => response.json())
        .then((items) => {
          const drv =
            props.drv === "Carlos Sainz"
              ? "carlos sainz jr"
              : props.drv
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase();
  
          // `find` metodu ile ilk eşleşen oyuncuyu buluyoruz
          const player = items["player"].find((player) => 
            player["strPlayer"]
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase() === drv
          );
  
          // Eğer oyuncu bulunduysa, setData ve setPlayerId'yi çalıştır
          if (player) {
            setData(player);
            setPlayerId(player.idPlayer);
            console.log(items);
          }
        })
        .catch((err) => {
          console.log(err.message);
          setErr(false);
        });
    }
  
    fetchData();
  }, [url]);
  
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
      {playerId&&<PlayerProfile playerId={playerId} />}
    </>
  ) : null;
};

export default DriverDB;
