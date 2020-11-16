import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { PROPS_LOG } from "../types";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { selectDetails } from "../detail/detailSlice";
import { selectSelectedEventId } from "../event/eventSlice";
import { number } from "yup";

const Log: React.FC<PROPS_LOG> = ({
  //   eventId,
  logId,
  userLog,
  created_on,
  event,
}) => {
  const selectedEventId = useSelector(selectSelectedEventId);
  const details = useSelector(selectDetails);
  const selectedEventIdDetails = details.filter(
    (detail) => detail.event === selectedEventId
  );
  const selectedLogIdDetails = details.filter((detail) => detail.log === logId);

  let totalWeights: number = 0;
  selectedLogIdDetails.forEach((detail) => {
    const weight: number = detail.weight;
    // なぜか文字列として連結される
    totalWeights += parseFloat(weight.toString());
  });

  return (
    <TableRow key={logId}>
      <TableCell component="th" scope="row">
        {created_on}
      </TableCell>
      <TableCell align="right">{totalWeights.toFixed(1)}</TableCell>
      <TableCell align="right">"Dummy"</TableCell>
      <TableCell align="right">"Dummy"</TableCell>
      <TableCell align="right">"Dummy"</TableCell>
    </TableRow>
  );
};

export default Log;
