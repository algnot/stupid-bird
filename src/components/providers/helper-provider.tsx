/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { BackendClient } from "@/lib/backend-client";
import { isErrorResponse } from "@/type/payload";
import { initUserType, Item, UserType } from "@/type/users";
import liff from "@line/liff";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useFullLoadingContext } from "./full-loading-provider";
import CharacterStatus from "../CharacterStatus";
import ItemStatus from "../ItemStatus";
import ScoreBoardContent from "../ScoreBoardContent";
import { useAlertContext } from "./alert-provider";
import { setItem } from "@/lib/storage";

interface HelperContextType {
  setAlert: (
    title: string,
    text: string,
    action: undefined | (() => void),
    canCancel: boolean,
  ) => void;
  backendClient: BackendClient;
  userData: UserType;
  setFullLoading: (value: boolean) => void;
  showCharacterStatus: Item | undefined;
  setShowSummaryCharacterStatus: (
    character: Item | undefined,
    hat: Item | undefined,
  ) => void;
  showItemStatus: Item | undefined;
  setShowItemStatus: (item: Item) => void;
  setIsShowScoreBoard: (value: boolean) => void;
  router: "character" | "shop" | "inventory";
  setRouter: (value: "character" | "shop" | "inventory") => void;
  fetchUser: () => Promise<void>;
  valueStore: Record<string, string>;
  setValueStore: (key: string, value: string) => void;
}

const HelperContext = createContext<() => HelperContextType>(() => {
  return {
    setAlert: (
      title: string,
      text: string,
      action: undefined | (() => void),
      canCancel: boolean,
    ) => {},
    backendClient: new BackendClient(() => {}),
    userData: initUserType,
    setFullLoading: () => {},
    showCharacterStatus: undefined,
    setShowSummaryCharacterStatus: () => {},
    showItemStatus: undefined,
    setShowItemStatus: () => {},
    setIsShowScoreBoard: () => {},
    router: "character",
    setRouter: () => {},
    fetchUser: async () => {},
    valueStore: {},
    setValueStore: () => {},
  };
});

export function HelperProvider({ children }: { children: ReactNode }) {
  const setAlert = useAlertContext();
  const setFullLoading = useFullLoadingContext();
  const [userData, setUserData] = useState<UserType>(initUserType);
  const { backendClient } = useHelperContext()();
  const [showCharacterStatus, setShowCharacterStatus] = useState<
    Item | undefined
  >();
  const [showHatStatus, setShowHatStatus] = useState<Item | undefined>();
  const [showItemStatus, setShowItemStatus] = useState<Item | undefined>();
  const [isShowScoreBoard, setIsShowScoreBoard] = useState(false);
  const [router, setRouter] = useState<"character" | "shop" | "inventory">(
    "character",
  );
  const [allValueStore, setAllValueStore] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    initLiff();
  }, []);

  const setValueStore = (key: string, value: string): void => {
    setAllValueStore((prev) => ({ ...(prev ?? {}), [key]: value }));
  };

  const initLiff = async () => {
    try {
      setFullLoading(true);

      if (process.env.NEXT_PUBLIC_FORCE_USER_ID) {
        const response = await backendClient.getOrCreateUser();
        setFullLoading(false);
        if (isErrorResponse(response)) {
          return;
        }
        setUserData(response);
        return;
      }

      await liff.init({
        liffId: process.env.NEXT_PUBLIC_LINE_LIFF_ID ?? "",
      });

      if (!liff.isLoggedIn()) {
        liff.login({ redirectUri: window.location.href });
        return;
      }

      const token = liff.getIDToken();
      setItem("accessToken", token ?? "");
      const response = await backendClient.getOrCreateUser();
      setFullLoading(false);

      if (isErrorResponse(response)) {
        return;
      }
      setUserData(response);
    } catch (err) {
      console.log(err);
    }
  };

  const setShowSummaryCharacterStatus = (
    character: Item | undefined,
    hat: Item | undefined,
  ) => {
    setShowCharacterStatus(character);
    setShowHatStatus(hat);
  };

  const useHelper = useCallback(
    () => ({
      backendClient: new BackendClient(setAlert),
      userData,
      setFullLoading,
      showCharacterStatus,
      setShowSummaryCharacterStatus,
      showItemStatus,
      setShowItemStatus,
      setIsShowScoreBoard,
      router,
      setRouter,
      setAlert,
      fetchUser: initLiff,
      valueStore: allValueStore,
      setValueStore,
    }),
    [userData, router, allValueStore],
  );

  return (
    <HelperContext.Provider value={useHelper}>
      {typeof showCharacterStatus !== "undefined" &&
        typeof showHatStatus !== "undefined" && (
          <CharacterStatus
            onClose={() => setShowCharacterStatus(undefined)}
            characterStatus={
              showCharacterStatus.info.level[showCharacterStatus.level ?? 0]
            }
            hatStatus={showHatStatus.info.level[showHatStatus.level ?? 0]}
          />
        )}

      {typeof showItemStatus !== "undefined" && (
        <ItemStatus
          onClose={() => setShowItemStatus(undefined)}
          itemInfo={showItemStatus}
        />
      )}

      {isShowScoreBoard && (
        <>
          <div
            className="absolute z-3 inset-0 backdrop-blur-sm flex justify-center items-center"
            onClick={() => setIsShowScoreBoard(false)}
          />

          <div className="absolute z-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[550px] max-h-[80vh] overflow-auto">
            <div className="w-full h-full bg-white rounded-xl p-4 overflow-auto relative">
              <button
                className="absolute right-4 top-2 text-red-500 text-2xl text-md font-bold cursor-pointer"
                onClick={() => setIsShowScoreBoard(false)}
              >
                ×
              </button>
              <div className="text-xl font-bold text-center mb-4 text-foreground">
                อันดับผู้เล่น
              </div>

              <ScoreBoardContent />
            </div>
          </div>
        </>
      )}
      {children}
    </HelperContext.Provider>
  );
}

export const useHelperContext = () => useContext(HelperContext);
