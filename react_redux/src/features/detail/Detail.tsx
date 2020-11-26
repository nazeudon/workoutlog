import { TableCell, TableRow } from "@material-ui/core";
import React, { useState } from "react";
import { PROPS_DETAIL } from "../types";
import { TextField } from "@material-ui/core";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import styles from "./Detail.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAsyncUpdateDetail } from "./detailSlice";
import { selectSelectedEventId } from "../event/eventSlice";
import { selectSelectedLogId } from "../log/logSlice";

const Detail: React.FC<PROPS_DETAIL> = ({
  index,
  detailId,
  weight,
  times,
  userDetail,
  log,
}) => {
  const [editWeight, setEditWeight] = useState(String(weight));
  const [editTimes, setEditTimes] = useState(String(times));
  const [isEdit, toggleIsEdit] = useState(false);
  const selectedEventId = useSelector(selectSelectedEventId);
  const selectedLogId = useSelector(selectSelectedLogId);
  const dispatch = useDispatch();

  const updateDetail = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = {
      detailId: detailId,
      weight: parseFloat(editWeight),
      times: parseInt(editTimes),
      event: selectedEventId,
      log: selectedLogId,
    };
    console.log("detail/put");
    await dispatch(fetchAsyncUpdateDetail(packet));
    await toggleIsEdit(!isEdit);
  };

  return (
    <>
      <TableRow key={detailId}>
        <TableCell component="th" scope="row">
          <div>{index + 1}</div>
        </TableCell>
        <TableCell align="right">
          {isEdit ? (
            <form>
              <button className={styles.detail_btnModal} onClick={updateDetail}>
                <IoIosCheckmarkCircleOutline />
              </button>
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
        <TableCell align="right">
          {isEdit ? (
            <form>
              <TextField
                type="input"
                name="times"
                onChange={(e) => setEditTimes(e.target.value)}
                value={editTimes}
              />
            </form>
          ) : (
            <div onClick={() => toggleIsEdit(!isEdit)}>{times}</div>
          )}
        </TableCell>
      </TableRow>
    </>
  );
};

export default Detail;
