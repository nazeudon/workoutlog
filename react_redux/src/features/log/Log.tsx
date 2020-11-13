import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { PROPS_LOG } from "../types";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

const Log: React.FC<PROPS_LOG> = ({
  //   eventId,
  logId,
  userLog,
  created_on,
  event,
}) => {
  //   const myProfile = useSelector(selectMyProfile);
  //   console.log("----------");
  //   console.log("created_on", created_on);
  //   console.log("userLog", userLog);
  //   console.log("userProfile", myProfile.userProfile);
  //   //   console.log("eventID", eventId);
  //   console.log("event", event);
  //   console.log("logId", logId);
  //   console.log("----------");

  return (
    <div>
      <TableRow key={logId}>
        <TableCell component="th" scope="row">
          {created_on}
        </TableCell>
        {/* <TableCell align="right">{row.calories}</TableCell>
                    <TableCell align="right">{row.fat}</TableCell>
                    <TableCell align="right">{row.carbs}</TableCell>
                    <TableCell align="right">{row.protein}</TableCell> */}
      </TableRow>
    </div>
  );
};

export default Log;
