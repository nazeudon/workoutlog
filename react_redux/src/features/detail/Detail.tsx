import { TableCell, TableRow } from "@material-ui/core";
import React from "react";
import { PROPS_DETAIL } from "../types";

const Detail: React.FC<PROPS_DETAIL> = ({
  index,
  detailId,
  weight,
  times,
  userDetail,
  log,
}) => {
  return (
    <>
      <TableRow key={detailId}>
        <TableCell component="th" scope="row">
          <div>{index + 1}</div>
        </TableCell>
        <TableCell align="right">{weight}</TableCell>
        <TableCell align="right">{times}</TableCell>
      </TableRow>
    </>
  );
};

export default Detail;
