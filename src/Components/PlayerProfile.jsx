import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlayer } from "../redux/playerSlice";
import { Carousel } from "react-bootstrap";
import Loading from "./Loading";

const PlayerCarousel = ({ playerImages }) => {
  return (
    <div className="container mt-4">
      <Carousel>
        {playerImages.map((image, index) =>
          image ? (
            <Carousel.Item key={index}>
              <img
                className="d-block mx-auto img-fluid"
                src={image + "/small"}
                alt={`Player ${index + 1}`}
                style={{ objectFit: "fill", height: "400px" }}
              />
            </Carousel.Item>
          ) : null
        )}
      </Carousel>
    </div>
  );
};

const PlayerInfo = ({ playerData }) => (
  <div>
    <h4>
      <strong>Team:</strong> {playerData.strTeam}
    </h4>
    <h5>
      {playerData.strBirthLocation}{" "}
      {new Date(playerData.dateBorn).toLocaleDateString()}
      {playerData.strNationality && <span> ({playerData.strNationality})</span>}
      {playerData.strHeight && (
        <p>
          {playerData.strHeight} {playerData.strWeight}
        </p>
      )}
    </h5>
  </div>
);

const PlayerProfile = ({ playerId, t }) => {
  const dispatch = useDispatch();
  const { playersData, isLoading, error } = useSelector(
    (state) => state.player
  );

  useEffect(() => {
    if (playerId && !playersData[playerId]) {
      dispatch(fetchPlayer(playerId));
    }
  }, [dispatch, playerId, playersData]);

  const playerData = playersData[playerId];

  if (isLoading) return <Loading />;
  if (error) return <div>Hata: {error}</div>;
  if (!playerData) return null;

  const playerImages = [
    playerData?.strThumb,
    playerData?.strPoster,
    playerData?.strFanart1,
    playerData?.strFanart2,
    playerData?.strFanart3,
    playerData?.strFanart4,
    playerData?.strBanner,
    playerData?.strRender,
    playerData?.strCutout,
  ].filter((image) => image !== null);

  return t === "1" ? (
    <div className="player-profile">
      {playerImages.length > 1 ? (
        <PlayerCarousel playerImages={playerImages} />
      ) : (
        <img
          className="img-fluid"
          src={(playerData.strThumb || playerData.strCutout || "") + "/small"}
          alt={playerData.strPlayer}
        />
      )}
      <PlayerInfo playerData={playerData} />
      <pre
        className="p-1 bg-dark text-start border"
        style={{ whiteSpace: "pre-wrap" }}
      >
        <strong className="fs-5 text-black">Biyografi:</strong>{" "}
        {playerData?.strDescriptionEN}
      </pre>
    </div>
  ) : t === "2" ? (
    <div className="container-fluid ">
      <img
        className="img-fluid  animate__animated animate__fadeInDownBig animate__slower"
        src={
          (playerData.strBanner ||
            playerData.strCutout ||
            playerData.strThumb ||
            "") + "/small"
        }
        alt=""
      />
      <div className="bg-secondary">
        {/* {playerData?.strTeam} */}
        <p className="text-center m-0 small-text">
          {new Date(playerData?.dateBorn).toDateString()}{" "}
          {playerData.strBirthLocation} {playerData.strNationality}
        </p>
        {playerData.strHeight && (
          <p className="m-0 text-center small-text">
            {playerData.strHeight} {playerData.strWeight}
          </p>
        )}
      </div>
      <p className="m-0 bg-dark text-start px-1 small-text">
        {playerData?.strDescriptionEN}
      </p>
    </div>
  ) : t === "3" ? (
    <div className="container-fluid p-0 text-info">
      <img
        className="img-fluid d-block mx-auto text-center 
          a  animate__animated animate__backInDown animate__slower"
        src={
          (playerData.strCutout ||
            playerData.strThumb ||
            playerData.strRender ||
            null) + "/small"
        }
        alt={playerData.strPlayer}
        title={playerData.strDescriptionEN}
      />
      <p className="text-center m-0 small-text">
        {new Date(playerData.dateBorn).toDateString()} <br />
        {playerData.strBirthLocation} {playerData.strNationality}
      </p>
      {playerData.strHeight && (
        <p className="m-0 text-center small-text">
          {playerData.strHeight} {playerData.strWeight}
        </p>
      )}
    </div>
  ) : (
    ""
  );
};

export default PlayerProfile;
