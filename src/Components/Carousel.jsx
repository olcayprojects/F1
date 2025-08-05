import React, { useEffect } from "react";
import Caro from "react-bootstrap/Carousel";
import { useDispatch, useSelector } from "react-redux";
import { fetchCarouselTeams } from "../redux/carouselSlice";
import Loading from "./Loading";

const Carousel = () => {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector((state) => state.carousel);

  useEffect(() => {
    if (!data || data.length === 0) {
      dispatch(fetchCarouselTeams());
    }
  }, [dispatch, data]);

  // if (isLoading) return <Loading />;
  // if (error) return <div className="text-danger">Hata: {error}</div>;

  return (
    <Caro
      controls={false}
      indicators={false}
      fade={true}
      pause={"hover" | false}
      style={{ height: "110px" }}
    >
      {data.map((item, i) => (
        <Caro.Item interval={1000} key={i} className="">
          <div className="m-0 p-0 animate__lightSpeedInLeft  animate__delay-1s animate__animated animate__slower">
            <h2
              // style={{ fontFamily: "fantasy" }}
              className="text-danger float-start  m-0"
            >
              {item.strTeamAlternate}
            </h2>
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
          </div>
          <div className="animate__bounceInRight  animate__delay-1s animate__animated animate__slow">
            <h2
              // style={{ fontFamily: "fantasy" }}
              className="text-danger float-end m-0"
            >
              {item.strTeamAlternate}
            </h2>
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
          </div>
        </Caro.Item>
      ))}
    </Caro>
  );
};

export default Carousel;
