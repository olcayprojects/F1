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

  function msToTime(ms) {
    function addZ(n) {
      return (n < 10 ? "0" : "") + n;
    }
    var dt = new Date(ms);

    var mins = dt.getMinutes();
    var secs = dt.getSeconds();
    var millis = dt.getMilliseconds();

    var tm =
      addZ(mins) +
      ":" +
      addZ(secs) +
      "." +
      (millis < 100 ? "0" + millis : millis);
    return tm;
  }

  // const mergeDuration = durationList.reduce((acc, curr) => {
  //   if (acc[curr.driverId]) {
  //     acc[curr.driverId].duration = [
  //       acc[curr.driverId].duration,
  //       curr.duration,
  //     ].join(" + ");
  //   } else {
  //     acc[curr.driverId] = curr;
  //   }
  //   return acc;
  // }, {});

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
