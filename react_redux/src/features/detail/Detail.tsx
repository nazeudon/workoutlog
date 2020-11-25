import { TableCell, TableRow } from "@material-ui/core";
import React, { useState } from "react";
import { PROPS_DETAIL } from "../types";
import { TextField } from "@material-ui/core";

const Detail: React.FC<PROPS_DETAIL> = ({
  index,
  detailId,
  weight,
  times,
  userDetail,
  log,
}) => {
  const [editWeight, setEditWeight] = useState(String(weight));
  const [isEdit, toggleIsEdit] = useState(false);
  return (
    <>
      <TableRow key={detailId}>
        <TableCell component="th" scope="row">
          <div>{index + 1}</div>
        </TableCell>
        <TableCell align="right">
          {isEdit ? (
            <form>
              <TextField
                type="input"
                name="weight"
                onChange={(e) => setEditWeight(e.target.value)}
                value={editWeight}
              />
            </form>
          ) : (
            <div onClick={() => toggleIsEdit(!isEdit)}>{weight}</div>
          )}
        </TableCell>
        <TableCell align="right">{times}</TableCell>
      </TableRow>
    </>
  );
};

export default Detail;
