import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { PROPS_EVENT } from "../types";
import styles from "./Event.module.css";
import {
  setOpenNewLog,
  resetOpenNewLog,
  selectOpenNewLog,
  selectLogs,
} from "../log/logSlice";
import Modal from "react-modal";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Log from "../log/Log";
import {
  fetchResetSelectedEventId,
  selectSelectedEventId,
  fetchSetSelectedEventId,
} from "./eventSlice";

import { selectOpenNewEvent, resetOpenNewEvent } from "./eventSlice";
import NewEvent from "./NewEvent";

//モーダルウィンドウの見た目をカスタム
const customStyles = {
  overlay: {
    backgroundColor: "rgba(250, 250, 250, 0.4)",
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
  const openNewLog = useSelector(selectOpenNewLog);
  const openNewEvent = useSelector(selectOpenNewEvent);
  const selectedEventId = useSelector(selectSelectedEventId);
  const logs = useSelector(selectLogs);
  const selectedEventIdLogs = logs.filter(
    (log) => log.event === selectedEventId
  );

  const classes = useStyles();
  return (
    <>
      <div className={styles.event}>
        <img className={styles.event_image} src={imageUrl} alt="" />
        <h2
          className={styles.event_text}
          onClick={async () => {
            await dispatch(setOpenNewLog());
            await dispatch(fetchSetSelectedEventId(eventId));
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
        style={customStyles}
      >
        <NewEvent />
      </Modal>

      <Modal //新規ログ追加用のモーダル
        isOpen={openNewLog}
        //モーダル以外の箇所をクリックした時
        onRequestClose={async () => {
          await dispatch(resetOpenNewLog());
          await dispatch(fetchResetSelectedEventId());
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
