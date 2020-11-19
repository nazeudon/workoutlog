import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { PROPS_LOG } from "../types";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import {
  setOpenDetail,
  resetOpenDetail,
  selectDetails,
  selectOpenDetail,
} from "../detail/detailSlice";
import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
} from "@material-ui/core";
import Modal from "react-modal";
import {
  fetchResetSelectedLogId,
  fetchSetSelectedLogId,
  setOpenLog,
  resetOpenLog,
} from "./logSlice";
import Detail from "../detail/Detail";
import styles from "./Log.module.css";

// tableの見た目
const useStyles = makeStyles({
  table: {
    width: "100%",
  },
});

//モーダルウィンドウの見た目をカスタム
const customStyles = {
  overlay: {
    backgroundColor: "rgba(250, 250, 250, 0)",
  },
  content: {
    top: "55%",
    left: "50%",
    width: "40%",
    height: "40%",
    padding: "50px",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgb(240, 240, 240)",
  },
};

const Log: React.FC<PROPS_LOG> = ({ logId, userLog, created_on, event }) => {
  const dispatch = useDispatch();
  const details = useSelector(selectDetails);
  const classes = useStyles();
  const openDetail = useSelector(selectOpenDetail);
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
    <>
      <TableRow key={logId}>
        <TableCell component="th" scope="row">
          <div
            className={styles.log_date}
            onClick={async () => {
              // await dispatch(resetOpenLog());
              await dispatch(fetchSetSelectedLogId(logId));
              await dispatch(setOpenDetail());
            }}
          >
            {created_on}
          </div>
        </TableCell>
        <TableCell align="right">{totalWeights.toFixed(1)}</TableCell>
        <TableCell align="right">{maxWeight}</TableCell>
        <TableCell align="right">{aveWeight.toFixed(1)}</TableCell>
        <TableCell align="right">{totalSets}</TableCell>
        <TableCell align="right">{estimated1RM.toFixed(1)}</TableCell>
      </TableRow>

      <Modal //詳細閲覧/新規追加用のモーダル
        isOpen={openDetail}
        //モーダル以外の箇所をクリックした時
        onRequestClose={async () => {
          await dispatch(resetOpenDetail());
          await dispatch(fetchResetSelectedLogId());
          await dispatch(setOpenLog());
        }}
        style={customStyles}
      >
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Total&nbsp;(kg)</TableCell>
                <TableCell align="right">Max&nbsp;(kg)</TableCell>
                <TableCell align="right">Average&nbsp;(kg)</TableCell>
                <TableCell align="right">Sets&nbsp;(times)</TableCell>
                <TableCell align="right">Estimated 1RM&nbsp;(kg)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedLogIdDetails.map((detail) => (
                <Detail
                  detailId={detail.id}
                  weight={detail.weight}
                  times={detail.times}
                  userDetail={detail.userDetail}
                  log={detail.log}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Modal>
    </>
  );
};

export default Log;
