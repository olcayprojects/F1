import React from "react";

function Duration(props) {
  const durationList = [];
  props?.data[0]?.PitStops?.map((d) => {
    durationList.push({
      driverId: d.driverId,
      duration: d.duration,
    });
  });

  const mergeDuration = durationList.reduce((acc, curr) => {
    if (acc[curr.driverId]) {
      acc[curr.driverId].duration = [
        acc[curr.driverId].duration,
        curr.duration,
      ].join(",");
    } else {
      acc[curr.driverId] = curr;
    }
    return acc;
  }, {});

  return <>{mergeDuration[props.driverid].duration}</>;
}

export default Duration;
