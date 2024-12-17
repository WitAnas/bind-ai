"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { auth } from "@/config/FirebaseConfig";
import { setLoading, updateCurrentUser } from "@/redux/reducers/authReducer";
import {
  clearUserSubscription,
  fetchUserSubscription,
} from "@/redux/reducers/userSubscriptionReducer";
import { clearCustomBots, fetchUserBots } from "@/redux/reducers/botReducer";
import {
  clearUserApiKeys,
  fetchUserApiKeys,
} from "@/redux/reducers/apiKeyReducer";
import { clearSessions } from "@/redux/reducers/sessionReducer";

const AuthCheck = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(updateCurrentUser(user));
        dispatch(fetchUserSubscription(user.uid));
        dispatch(fetchUserApiKeys(user.uid));
        dispatch(fetchUserBots(user.uid));
      } else {
        dispatch(updateCurrentUser({}));
        dispatch(clearUserSubscription());
        dispatch(clearUserApiKeys());
        dispatch(clearCustomBots());
        dispatch(clearSessions({}));
      }
      dispatch(setLoading(false));
    });

    return unsubscribe;
  }, [dispatch]);

  return props.children;
};

export default AuthCheck;
