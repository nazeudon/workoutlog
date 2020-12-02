import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import Auth from "../auth/Auth";
import { selectEvents, selectIsLoadingEvent } from "../event/eventSlice";
import {
  fetchAsyncGetMyProf,
  selectIsLoadingAuth,
  resetMyProfile,
} from "../auth/authSlice";
import {
  setOpenSignIn,
  resetOpenSignIn,
  setIsJwt,
  resetIsJwt,
  selectIsJwt,
  selectMyProfile,
} from "../auth/authSlice";
import {
  fetchAsyncGetEvents,
  setOpenNewEvent,
  resetEvents,
  categories,
  EVENT_BY_CATEGORY,
} from "../event/eventSlice";
import { fetchAsyncGetLogs, resetLogs } from "../log/logSlice";
import { fetchAsyncGetDetails, resetDetails } from "../detail/detailSlice";
import styles from "./Core.module.css";
import { FaDumbbell } from "react-icons/fa";
import { Button, Grid, CircularProgress, Typography } from "@material-ui/core";
import Event from "../event/Event";

const Core: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const events = useSelector(selectEvents);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  const isLoadingEvent = useSelector(selectIsLoadingEvent);
  const isJwt = useSelector(selectIsJwt);
  const myProfile = useSelector(selectMyProfile);
  const loginedIdEvents = events.filter(
    (event) => myProfile.userProfile === event.userEvent
  );

  const loginedIdEventsByCategory: EVENT_BY_CATEGORY = {
    Chest: [],
    Back: [],
    Sholder: [],
    Arm: [],
    Leg: [],
  };

  loginedIdEvents.forEach((event) => {
    const cat: keyof EVENT_BY_CATEGORY = event.category as keyof EVENT_BY_CATEGORY;
    if (cat) {
      loginedIdEventsByCategory[cat].push(event);
    }
  });

  useEffect(() => {
    const fetchBootLoader = async () => {
      if (localStorage.localJWT) {
        dispatch(resetOpenSignIn());
        dispatch(setIsJwt());
        const result = await dispatch(fetchAsyncGetEvents()); //直す
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
                  dispatch(resetIsJwt());
                  dispatch(resetMyProfile());
                  dispatch(resetEvents());
                  dispatch(resetLogs());
                  dispatch(resetDetails());
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
            <Grid container spacing={2}>
              {categories.map((cat) => {
                const cat_key: keyof EVENT_BY_CATEGORY = cat as keyof EVENT_BY_CATEGORY;
                return (
                  <>
                    <Grid item key={1} xs={12} className={styles.event_header}>
                      <Typography variant="h4" align="center">
                        <div className={styles.event_title}>{cat}</div>
                      </Typography>
                    </Grid>
                    {loginedIdEventsByCategory[cat_key].map((event) => {
                      return (
                        <Grid key={event.id} item xs={12} md={4}>
                          <Event
                            eventId={event.id}
                            title={event.title}
                            category={event.category}
                            userEvent={event.userEvent}
                            imageUrl={event.img}
                          />
                        </Grid>
                      );
                    })}
                  </>
                );
              })}
            </Grid>
          </div>
        </>
      )}
    </div>
  );
};

export default Core;
