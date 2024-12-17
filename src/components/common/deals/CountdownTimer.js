import React, { useState, useEffect } from "react";
import moment from "moment";

const CountdownTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = moment();
      const end = moment(endDate);
      const duration = moment.duration(end.diff(now));

      if (duration.asMilliseconds() <= 0) {
        setTimeLeft("00:00:00");
        return;
      }

      const totalHours = Math.floor(duration.asHours());
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      const formattedHours = totalHours.toString().padStart(2, "0");
      const formattedMinutes = minutes.toString().padStart(2, "0");
      const formattedSeconds = seconds.toString().padStart(2, "0");

      setTimeLeft(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <span className="text-sm font-[Inter,sans-serif] font-bold dark:text-white text-[#131314]">
      {timeLeft}
    </span>
  );
};

export default CountdownTimer;
