import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { PROPS_EVENT } from "../types";
import styles from "./Event.module.css";
import {
  setOpenLog,
  resetOpenLog,
  selectOpenLog,
  selectLogs,
  fetchAsyncNewLog,
} from "../log/logSlice";
import Modal from "react-modal";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import Log from "../log/Log";
import {
  fetchResetSelectedEventId,
  selectSelectedEventId,
  selectSelectedEventTitle,
  selectOpenNewEvent,
  resetOpenNewEvent,
  fetchSetSelectedEventId,
  fetchSetSelectedEventTitle,
  fetchResetSelectedEventTitle,
} from "./eventSlice";
import NewEvent from "./NewEvent";
import { IoMdAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { BsGraphUp } from "react-icons/bs";
import { setOpenPlot } from "../plot/plotSlice";

//モーダルウィンドウの見た目をカスタム
const customStyles = {
  overlay: {
    backgroundColor: "rgba(250, 250, 250, 0.2)",
  },
  content: {
    top: "55%",
    left: "50%",
    width: "50%",
    height: "50%",
    padding: "1% 2%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgb(240, 240, 240)",
  },
};

const customAddEventStyles = {
  overlay: {
    backgroundColor: "rgba(250, 250, 250, 0.2)",
    // backgroundColor: "transparent",
  },
  content: {
    top: "35%",
    left: "50%",
    width: "30%",
    height: "30%",
    padding: "1% 2%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgb(240, 240, 240)",
  },
};

// tableの見た目
const useStyles = makeStyles({
  table: {
    width: "100%",
  },
});

const Event: React.FC<PROPS_EVENT> = ({
  eventId,
  title,
  userEvent,
  imageUrl,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const openLog = useSelector(selectOpenLog);
  const openNewEvent = useSelector(selectOpenNewEvent);
  const selectedEventId = useSelector(selectSelectedEventId);
  const logs = useSelector(selectLogs);
  const selectedEventIdLogs = logs.filter(
    (log) => log.event === selectedEventId
  );
  const selectedEventTitle = useSelector(selectSelectedEventTitle);

  const packet = {
    event: selectedEventId,
  };

  const doNothing = () => {};

  const classes = useStyles();
  return (
    <>
      <div className={styles.event}>
        <img className={styles.event_image} src={imageUrl} alt="" />
        <h2
          className={styles.event_text}
          onClick={async () => {
            await dispatch(setOpenLog());
            await dispatch(fetchSetSelectedEventId(eventId));
            await dispatch(fetchSetSelectedEventTitle(title));
          }}
        >
          {title}
        </h2>
      </div>
      <Modal //新規種目追加用のモーダル
        isOpen={openNewEvent}
        //モーダル以外の箇所をクリックした時
        onRequestClose={async () => {
          await dispatch(resetOpenNewEvent());
        }}
        style={customAddEventStyles}
      >
        <NewEvent />
      </Modal>

      <Modal //ログ閲覧/新規追加用のモーダル
        isOpen={openLog}
        //モーダル以外の箇所をクリックした時
        onRequestClose={async () => {
          await dispatch(resetOpenLog());
          await dispatch(fetchResetSelectedEventId());
          await dispatch(fetchResetSelectedEventTitle());
        }}
        style={customStyles}
      >
        <div className={styles.log_header}>
          <button
            className={styles.event_btnModal}
            onClick={async () => {
              await dispatch(resetOpenLog());
              await dispatch(fetchResetSelectedEventId());
              await dispatch(fetchResetSelectedEventTitle());
            }}
          >
            <IoIosCloseCircleOutline />
          </button>
          <h3 className={styles.log_titile}>{selectedEventTitle}</h3>
          <div>
            <button
              className={styles.event_btnModal}
              onClick={async () => {
                await dispatch(setOpenPlot());
              }}
            >
              <BsGraphUp />
            </button>
            <button
              className={styles.event_btnModal}
              onClick={async () => {
                const result = window.confirm("新規ログを作成しますか？");
                result ? await dispatch(fetchAsyncNewLog(packet)) : doNothing();
              }}
            >
              <IoMdAddCircleOutline />
            </button>
          </div>
        </div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Total&nbsp;(kg)</TableCell>
                <TableCell align="right">Max&nbsp;(kg)</TableCell>
                {/* <TableCell align="right">Average&nbsp;(kg)</TableCell> */}
                <TableCell align="right">Sets&nbsp;(times)</TableCell>
                <TableCell align="right">Estimated 1RM&nbsp;(kg)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedEventIdLogs.map((log) => (
                <Log
                  logId={log.id}
                  userLog={log.userLog}
                  created_on={log.created_on}
                  event={log.event}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Modal>
    </>
  );
};

export default Event;
