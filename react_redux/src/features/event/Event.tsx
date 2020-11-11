import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { PROPS_EVENT } from "../types";
import styles from "./Event.module.css";

const Event: React.FC<PROPS_EVENT> = ({ id, title, userEvent, imageUrl }) => {
  const dispatch: AppDispatch = useDispatch();

  return (
    <div className={styles.event}>
      <img className={styles.event_image} src={imageUrl} alt="" />
      <h2 className={styles.event_text}>{title}</h2>
    </div>
  );
};

export default Event;
