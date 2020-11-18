import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { TextField, Button, IconButton } from "@material-ui/core";
import styles from "./NewEvent.module.css";
import {
  fetchAsyncGetEvents,
  fetchAsyncNewEvent,
  fetchPostEnd,
  fetchPostStart,
  resetOpenNewEvent,
} from "./eventSlice";
import { File } from "../types";
import { MdAddAPhoto } from "react-icons/md";

const NewEvent: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [img, setImg] = useState<File | null>(null);

  const addEvent = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = {
      title: title,
      img: img,
    };

    await dispatch(fetchPostStart());
    await dispatch(fetchAsyncNewEvent(packet));
    await dispatch(fetchPostEnd());
    await dispatch(resetOpenNewEvent());
  };

  const handlerEditPicture = () => {
    const fileInput = document.getElementById("imgInput");
    fileInput?.click();
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

        <input
          type="file"
          id="imgInput"
          hidden={true}
          onChange={(e) => setImg(e.target.files![0])}
        />

        <br />
        <IconButton onClick={handlerEditPicture}>
          <MdAddAPhoto />
        </IconButton>
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
