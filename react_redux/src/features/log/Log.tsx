import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { PROPS_LOG } from "../types";
import {
  TableCell,
  TableRow,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
} from "@material-ui/core";
import {
  setOpenDetail,
  resetOpenDetail,
  selectDetails,
  selectOpenDetail,
  fetchAsyncNewDetail,
} from "../detail/detailSlice";
import Modal from "react-modal";
import {
  fetchResetSelectedLogId,
  fetchSetSelectedLogId,
  setSelectedLogCreatedOn,
  resetSelectedLogCreatedOn,
  setOpenLog,
  selectSelectedLogId,
  selectSelectedLogCreatedOn,
} from "./logSlice";
import {
  selectSelectedEventId,
  selectSelectedEventTitle,
} from "../event/eventSlice";
import { resetOpenPlot, selectOpenPlot } from "../plot/plotSlice";
import Detail from "../detail/Detail";
import styles from "./Log.module.css";
import { IoMdAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import Plot from "../plot/Plot";

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
  const dispatch: AppDispatch = useDispatch();
  const details = useSelector(selectDetails);
  const classes = useStyles();
  const openDetail = useSelector(selectOpenDetail);
  const openPlot = useSelector(selectOpenPlot);
  const selectedEventId = useSelector(selectSelectedEventId);
  const selectedEventTitle = useSelector(selectSelectedEventTitle);
  const selectedLogId = useSelector(selectSelectedLogId);
  const selectedLogCreatedOn = useSelector(selectSelectedLogCreatedOn);
  const selectedLogIdDetails = details.filter((detail) => detail.log === logId);
  const selectedLogIdDetail = details.filter(
    (detail) => detail.log === selectedLogId
  );

  let totalWeights: number = 0;
  // let totalTimes: number = 0;
  let totalSets: number = 0;
  let maxWeight: number = 0;
  // let aveWeight: number = 0;
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
    // totalTimes += parseInt(times.toString());
    totalSets += 1;
    maxWeight = weight > maxWeight ? weight : maxWeight;
    // aveWeight = totalWeights / totalTimes;
    estimated1RM = oneRM > estimated1RM ? oneRM : estimated1RM;
  });

  const packet = {
    weight: 0,
    times: 0,
    event: selectedEventId,
    log: selectedLogId,
  };

  return (
    <>
      <TableRow key={logId}>
        <TableCell component="th" scope="row">
          <div
            className={styles.log_date}
            onClick={async () => {
              // await dispatch(resetOpenLog());
              await dispatch(fetchSetSelectedLogId(logId));
              await dispatch(setSelectedLogCreatedOn(created_on));
              await dispatch(setOpenDetail());
            }}
          >
            {created_on}
          </div>
        </TableCell>
        <TableCell align="right">{totalWeights.toFixed(1)}</TableCell>
        <TableCell align="right">{maxWeight}</TableCell>
        {/* <TableCell align="right">{aveWeight.toFixed(1)}</TableCell> */}
        <TableCell align="right">{totalSets}</TableCell>
        <TableCell align="right">{estimated1RM.toFixed(1)}</TableCell>
      </TableRow>

      <Modal //詳細閲覧/新規追加用のモーダル
        isOpen={openDetail}
        //モーダル以外の箇所をクリックした時
        onRequestClose={async () => {
          await dispatch(resetOpenDetail());
          await dispatch(fetchResetSelectedLogId());
          await dispatch(resetSelectedLogCreatedOn());
          await dispatch(setOpenLog());
        }}
        style={customStyles}
      >
        <div className={styles.detail_header}>
          <button
            className={styles.log_btnModal}
            onClick={async () => {
              await dispatch(resetOpenDetail());
              await dispatch(fetchResetSelectedLogId());
              await dispatch(resetSelectedLogCreatedOn());
            }}
          >
            <IoIosCloseCircleOutline />
          </button>
          <div className={styles.detail_title_header}>
            <h3 className={styles.detail_title}>{selectedEventTitle}</h3>
            <h3 className={styles.detail_title_between}>/</h3>
            <h3 className={styles.detail_title}>{selectedLogCreatedOn}</h3>
          </div>
          <button
            className={styles.log_btnModal}
            onClick={async () => {
              await dispatch(fetchAsyncNewDetail(packet));
            }}
          >
            <IoMdAddCircleOutline />
          </button>
        </div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Set</TableCell>
                <TableCell align="right">Weight&nbsp;(kg)</TableCell>
                <TableCell align="right">Times</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedLogIdDetail.map((detail, index) => (
                <Detail
                  index={index}
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

      <Modal //plot閲覧用のモーダル
        isOpen={openPlot}
        //モーダル以外の箇所をクリックした時
        onRequestClose={async () => {
          await dispatch(resetOpenPlot());
          await dispatch(setOpenLog());
        }}
        style={customStyles}
      >
        <div className={styles.detail_header}>
          <button
            className={styles.log_btnModal}
            onClick={async () => {
              await dispatch(resetOpenPlot());
              await dispatch(setOpenLog());
            }}
          >
            <IoIosCloseCircleOutline />
          </button>
          <div className={styles.detail_title_header}>
            <h3 className={styles.detail_title}>{selectedEventTitle}</h3>
          </div>
        </div>
        <Plot />
      </Modal>
    </>
  );
};

export default Log;
