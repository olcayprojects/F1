import React, { useEffect } from "react";
import Caro from "react-bootstrap/Carousel";
import { useDispatch, useSelector } from "react-redux";
import { fetchCarouselTeams } from "../redux/carouselSlice";
import Loading from "./Loading";

const Carousel = () => {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector((state) => state.carousel);

  useEffect(() => {
    dispatch(fetchCarouselTeams());
  }, [dispatch]);

  if (isLoading) return <Loading />;
  if (error) return <div className="text-danger">Hata: {error}</div>;

  return (
    <Caro
      controls={false}
      indicators={false}
      fade={true}
      pause={"hover" | false}
      style={{ height: "110px" }}
    >
      {data.map((item, i) => (
        <Caro.Item interval={1000} key={i}>
          <h1
            style={{ fontFamily: "fantasy", transform: "scaleX(-1)" }}
            className="text-danger float-start pe-1"
          >
            {item.strTeamAlternate}
          </h1>
          <img
            style={{
              width: "28%",
              height: "140px",
              objectFit: "cover",
              objectPosition: "top 50%",
            }}
            className="rounded float-start p-0"
            src={item.strEquipment + "/medium"}
            alt=""
          />
          <h1
            style={{ fontFamily: "fantasy" }}
            className="text-danger float-end pe-1"
          >
            {item.strTeamAlternate}
          </h1>
          <img
            style={{
              width: "28%",
              height: "140px",
              objectFit: "cover",
              objectPosition: "center",
              transform: "scaleX(-1)",
            }}
            className="rounded float-end p-0"
            src={item.strEquipment + "/medium"}
            alt=""
          />
        </Caro.Item>
      ))}
    </Caro>
  );
};

export default Carousel;
