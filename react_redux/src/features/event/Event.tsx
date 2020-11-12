import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { PROPS_EVENT } from "../types";
import styles from "./Event.module.css";
import {
  setOpenNewLog,
  resetOpenNewLog,
  selectOpenNewLog,
} from "../log/logSlice";
import { selectMyProfile } from "../auth/authSlice";
import Modal from "react-modal";

//モーダルウィンドウの見た目をカスタム
const customStyles = {
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

const Event: React.FC<PROPS_EVENT> = ({ id, title, userEvent, imageUrl }) => {
  const dispatch: AppDispatch = useDispatch();
  const myProfile = useSelector(selectMyProfile);
  const openNewLog = useSelector(selectOpenNewLog);

  if (userEvent === myProfile.userProfile) {
    return (
      <>
        <Modal
          isOpen={openNewLog}
          //モーダル以外の箇所をクリックした時
          onRequestClose={async () => {
            await dispatch(resetOpenNewLog());
          }}
          style={customStyles}
        ></Modal>
        <div className={styles.event}>
          <img className={styles.event_image} src={imageUrl} alt="" />
          <h2
            className={styles.event_text}
            onClick={() => dispatch(setOpenNewLog())}
          >
            {title}
          </h2>
        </div>
      </>
    );
  } else {
    return null;
  }
};

export default Event;
