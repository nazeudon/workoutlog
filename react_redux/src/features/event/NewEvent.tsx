import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { TextField, Button } from "@material-ui/core";
import styles from "./NewEvent.module.css";
import {
  fetchAsyncNewEvent,
  fetchPostEnd,
  fetchPostStart,
  resetOpenNewEvent,
} from "./eventSlice";

const NewEvent: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [title, setTitle] = useState("");

  const addEvent = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = {
      title: title,
    };

    await dispatch(fetchPostStart());
    await dispatch(fetchAsyncNewEvent(packet));
    await dispatch(fetchPostEnd());
    await dispatch(resetOpenNewEvent());
  };

  return (
    <>
      <form className={styles.newEvent_signUp}>
        <h2 className={styles.newEvent_title}>種目追加</h2>

        <br />
        <TextField
          placeholder="ベンチプレス？"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br />
        <br />

        <Button
          disabled={!title}
          variant="contained"
          color="primary"
          type="submit"
          onClick={addEvent}
        >
          新規追加
        </Button>
      </form>
    </>
  );
};

export default NewEvent;
