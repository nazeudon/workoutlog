import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  TextField,
  Button,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";

import styles from "./NewEvent.module.css";
import {
  fetchAsyncNewEvent,
  fetchPostEnd,
  fetchPostStart,
  resetOpenNewEvent,
  categories,
} from "./eventSlice";

const NewEvent: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  const addEvent = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = {
      title: title,
      category: category,
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
        <InputLabel id="event-name">種目名</InputLabel>
        <TextField
          placeholder="ベンチプレス？"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br />
        <br />
        <InputLabel id="event-category">部位</InputLabel>
        <Select
          labelId="event-category"
          id="event-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as string)}
        >
          {categories.map((cat) => (
            <MenuItem value={cat}>{cat}</MenuItem>
          ))}
        </Select>
        <br />
        <br />

        <Button
          disabled={!title || !category}
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
