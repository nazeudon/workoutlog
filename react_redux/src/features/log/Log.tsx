import React from "react";
import { useSelector } from "react-redux";
import { PROPS_LOG } from "../types";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { selectDetails } from "../detail/detailSlice";

const Log: React.FC<PROPS_LOG> = ({ logId, userLog, created_on, event }) => {
  const details = useSelector(selectDetails);
  const selectedLogIdDetails = details.filter((detail) => detail.log === logId);

  let totalWeights: number = 0;
  let totalTimes: number = 0;
  let totalSets: number = 0;
  let maxWeight: number = 0;
  let aveWeight: number = 0;
  let estimated1RM: number = 0;
  selectedLogIdDetails.forEach((detail) => {
    const weight: number = detail.weight;
    const times: number = detail.times;
    const oneRM: number =
      times === 1
        ? weight
        : parseFloat(
            ((weight * times) / 40 + parseFloat(weight.toString())).toString()
          );
    // なぜか文字列として連結される
    totalWeights += parseFloat((weight * times).toString());
    totalTimes += parseInt(times.toString());
    totalSets += 1;
    maxWeight = weight > maxWeight ? weight : maxWeight;
    aveWeight = totalWeights / totalTimes;
    estimated1RM = oneRM > estimated1RM ? oneRM : estimated1RM;
  });

  return (
    <TableRow key={logId}>
      <TableCell component="th" scope="row">
        {created_on}
      </TableCell>
      <TableCell align="right">{totalWeights.toFixed(1)}</TableCell>
      <TableCell align="right">{maxWeight}</TableCell>
      <TableCell align="right">{aveWeight.toFixed(1)}</TableCell>
      <TableCell align="right">{totalSets}</TableCell>
      <TableCell align="right">{estimated1RM.toFixed(1)}</TableCell>
    </TableRow>
  );
};

export default Log;
