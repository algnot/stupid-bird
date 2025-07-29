/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { BackendClient } from "@/lib/backend-client";
import { isErrorResponse } from "@/type/payload";
import { initUserType, UserType } from "@/type/users";
import liff from "@line/liff";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface HelperContextType {
  backendClient: BackendClient;
  userData: UserType;
}

const HelperContext = createContext<() => HelperContextType>(() => {
  return {
    backendClient: new BackendClient(),
    userData: initUserType,
  };
});

export function HelperProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserType>(initUserType);
  const { backendClient } = useHelperContext()();

  useEffect(() => {
    initLiff();
  }, []);

  const initLiff = async () => {
    try {
      await liff.init({
        liffId: process.env.NEXT_PUBLIC_LINE_LIFF_ID ?? "",
      });

      if (!liff.isLoggedIn()) {
        liff.login({ redirectUri: window.location.href });
        return;
      }
      const profile = await liff.getProfile();
      const response = await backendClient.getOrCreateUser({
        userId: profile.userId,
        pictureUrl: profile?.pictureUrl ?? "",
        displayName: profile.displayName,
      });

      if (isErrorResponse(response)) {
        return;
      }
      setUserData(response);
    } catch (err) {
      console.log(err);
    }
  };

  const useHelper = useCallback(
    () => ({
      backendClient: new BackendClient(),
      userData,
    }),
    [userData],
  );

  return (
    <HelperContext.Provider value={useHelper}>
      {children}
    </HelperContext.Provider>
  );
}

export const useHelperContext = () => useContext(HelperContext);
