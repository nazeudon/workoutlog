import React from "react";
import { useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import { selectSelectedEventId } from "../event/eventSlice";
import { selectLogs } from "../log/logSlice";
import { selectDetails } from "../detail/detailSlice";

const TotalWeightPlot: React.FC = () => {
  const selectedEventId = useSelector(selectSelectedEventId);
  const logs = useSelector(selectLogs);
  const details = useSelector(selectDetails);
  const selectedEventIdLogs = logs.filter(
    (log) => log.event === selectedEventId
  );
  const selectedEventIdDetails = details.filter(
    (detail) => detail.event === selectedEventId
  );

  let allTotalWeights: number[] = [];
  let allCreatedOn: string[] = [];
  selectedEventIdLogs.forEach((log) => {
    let totalWeights: number = 0;
    const createdOn: string = log.created_on;
    selectedEventIdDetails.forEach((detail) => {
      if (detail.log === log.id) {
        const weight: number = detail.weight;
        const times: number = detail.times;
        // なぜか文字列として連結される
        totalWeights += parseFloat((weight * times).toString());
      }
    });
    allTotalWeights.push(totalWeights);
    allCreatedOn.push(createdOn);
  });

  const data = {
    labels: allCreatedOn,
    datasets: [
      {
        data: allTotalWeights,
        // label: "Changes in total weight",
        fill: true,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "round",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "square",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#eee",
        pointBorderWidth: 10,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 1,
        pointRadius: 1,
        pointHitRadius: 10,
      },
    ],
  };

  const options = {
    legend: {
      display: false,
    },
  };
  return (
    <>
      <Line data={data} options={options} />
    </>
  );
};

export default TotalWeightPlot;
