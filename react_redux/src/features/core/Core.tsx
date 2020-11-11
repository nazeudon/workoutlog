import React, { useEffect } from "react";
import Auth from "../auth/Auth";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { selectEvents, selectIsLoadingEvent } from "../event/eventSlice";
import { fetchAsyncGetMyProf, selectIsLoadingAuth } from "../auth/authSlice";
import {
  setOpenSignIn,
  resetOpenSignIn,
  setIsJwt,
  resetIsJwt,
  selectIsJwt,
} from "../auth/authSlice";
import { fetchAsyncGetEvents, setOpenNewEvent } from "../event/eventSlice";
import { fetchAsyncGetLogs } from "../log/logSlice";
import { fetchAsyncGetDetails } from "../detail/detailSlice";
import styles from "./Core.module.css";
import { FaDumbbell } from "react-icons/fa";
import {
  Button,
  Grid,
  Avatar,
  Badge,
  CircularProgress,
} from "@material-ui/core";
import Event from "../event/Event";

const Core: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const events = useSelector(selectEvents);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  const isLoadingEvent = useSelector(selectIsLoadingEvent);
  const isJwt = useSelector(selectIsJwt);

  useEffect(() => {
    const fetchBootLoader = async () => {
      if (localStorage.localJWT) {
        dispatch(resetOpenSignIn());
        dispatch(setIsJwt());
        const result = await dispatch(fetchAsyncGetEvents());
        if (fetchAsyncGetEvents.rejected.match(result)) {
          dispatch(setOpenSignIn());
          return null;
        }
        await dispatch(fetchAsyncGetMyProf());
        await dispatch(fetchAsyncGetLogs());
        await dispatch(fetchAsyncGetDetails());
      }
    };
    fetchBootLoader();
  }, [dispatch]);

  return (
    <div>
      <Auth />
      <div className={styles.core_header}>
        <h1 className={styles.core_title}>Workout Log</h1>
        {isJwt ? (
          <>
            <button
              className={styles.core_btnModal}
              onClick={() => {
                dispatch(setOpenNewEvent());
              }}
            >
              <FaDumbbell />
            </button>
            <div className={styles.core_logout}>
              {(isLoadingEvent || isLoadingAuth) && (
                <CircularProgress className={styles.core_progress} />
              )}
              <Button
                onClick={() => {
                  localStorage.removeItem("localJWT");
                  // dispatch(resetOpenProfile());
                  // dispatch(resetOpenNewPost());
                  dispatch(resetIsJwt());
                  dispatch(setOpenSignIn());
                }}
              >
                Logout
              </Button>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>

      {isJwt && (
        <>
          <div className={styles.core_posts}>
            <Grid container spacing={4}>
              {events.slice(0).map((event) => (
                <Grid key={event.id} item xs={12} md={4}>
                  <Event
                    id={event.id}
                    title={event.title}
                    userEvent={event.userEvent}
                    imageUrl={event.img}
                  />
                </Grid>
              ))}
            </Grid>
          </div>
        </>
      )}
    </div>
  );
};

export default Core;
