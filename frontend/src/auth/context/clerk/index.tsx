"use client";

import { useAuth } from "@clerk/clerk-react";
import { useRef, useMemo, useState, useEffect, createContext, useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import { dashboardApi } from "@/app/api/axios/dashboardApi";
import { setToken } from "@/lib/axios-external";
import { onboardingActions } from "@/redux/features/onboarding.slice";
import { setUserInfo } from "@/redux/features/userInfo.slice";

export const ClerkContext = createContext({});

export const ClerkAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, isSignedIn } = useAuth();
  const dispatch = useDispatch();

  const [tokenClient, setTokenClient] = useState("");

  const fetchData = async () => {
    try {
      const { data } = await dashboardApi.getCurrentUser();
      dispatch(setUserInfo(data));
    } catch (error) {
      console.error(error);
    }
  };
  useLayoutEffect(() => {
    const fetchToken = async () => {
      const tokenKey = await getToken({
        template: "convex",
        skipCache: true,
      });
      setTokenClient(tokenKey || "");
      setToken(tokenKey || "");
    };
    if (isSignedIn) {
      fetchToken();
      setTimeout(() => {
        // dispatch(onboardingActions.getStatusOnboarding());
        fetchData();
      }, 1000);
    }
    const interval = setInterval(() => {
      fetchToken();
    }, 1000 * 30);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken, isSignedIn]);

  const prevTokenRef = useRef("");

  useEffect(() => {
    const prevToken = prevTokenRef.current;

    if (prevToken === "" && tokenClient !== "") {
      // chỉ chạy khi tokenClient lần đầu có giá trị
      setTimeout(() => {
        dispatch(onboardingActions.getStatusOnboarding());
        fetchData();
      }, 100);
    }
    // cập nhật giá trị trước đó
    prevTokenRef.current = tokenClient;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenClient]);

  const contextValue = useMemo(() => tokenClient, [tokenClient]);

  return <ClerkContext.Provider value={contextValue}>{children}</ClerkContext.Provider>;
};
