import React from "react";

function Duration(props) {
  const durationList = [];
  props?.data[0]?.PitStops?.map((d) =>
    durationList.push({
      driverId: d.driverId,
      duration:
        d.duration.indexOf(":") === -1
          ? d.duration.replace(".", "")
          : Number(d.duration.split(":")[0]) * 60 * 1000 +
            Number(d.duration.split(":")[1].replace(".", "")),
    })
  );

  function msToTime(milliseconds) {
    const minutes = Math.floor(milliseconds / (60 * 1000));
    const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);
    const millis = Math.floor(milliseconds % 1000);

    return `${minutes}:${String(seconds).padStart(2, "0")}.${String(
      millis
    ).padStart(3, "0")}`;
  }

  const mergeDuration = durationList.reduce((acc, curr) => {
    if (acc[curr.driverId]) {
      acc[curr.driverId].duration = [
        parseInt(acc[curr.driverId].duration) + parseInt(curr.duration),
      ];
    } else {
      acc[curr.driverId] = curr;
    }
    return acc;
  }, {});

  return msToTime(parseInt(mergeDuration[props.driverid].duration));
}

export default Duration;
