import React from "react";
import { useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import { selectSelectedEventId } from "../event/eventSlice";
import { selectLogs } from "../log/logSlice";
import { selectDetails } from "../detail/detailSlice";

const EstimatedMaxWeightPlot: React.FC = () => {
  const selectedEventId = useSelector(selectSelectedEventId);
  const logs = useSelector(selectLogs);
  const details = useSelector(selectDetails);
  const selectedEventIdLogs = logs.filter(
    (log) => log.event === selectedEventId
  );
  const selectedEventIdDetails = details.filter(
    (detail) => detail.event === selectedEventId
  );

  let allEstimatedOneRM: number[] = [];
  let allCreatedOn: string[] = [];
  selectedEventIdLogs.forEach((log) => {
    let estimatedOneRM: number = 0;
    const createdOn: string = log.created_on;
    selectedEventIdDetails.forEach((detail) => {
      if (detail.log === log.id) {
        const weight: number = detail.weight;
        const times: number = detail.times;
        let oneRM: number =
          times === 1
            ? weight
            : parseFloat(
                (
                  (weight * times) / 40 +
                  parseFloat(weight.toString())
                ).toString()
              );
        estimatedOneRM = oneRM > estimatedOneRM ? oneRM : estimatedOneRM;
      }
    });
    allEstimatedOneRM.push(estimatedOneRM);
    allCreatedOn.push(createdOn);
  });
  const data = {
    labels: allCreatedOn,
    datasets: [
      {
        data: allEstimatedOneRM,
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
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "date",
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Estimated Max Weight (Kg)",
          },
        },
      ],
    },
  };
  return (
    <>
      <Line data={data} options={options} />
    </>
  );
};

export default EstimatedMaxWeightPlot;
