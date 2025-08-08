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

interface HelperContextType {
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
}

const HelperContext = createContext<() => HelperContextType>(() => {
  return {
    backendClient: new BackendClient(),
    userData: initUserType,
    setFullLoading: () => {},
    showCharacterStatus: undefined,
    setShowSummaryCharacterStatus: () => {},
    showItemStatus: undefined,
    setShowItemStatus: () => {},
    setIsShowScoreBoard: () => {},
    router: "character",
    setRouter: () => {},
  };
});

export function HelperProvider({ children }: { children: ReactNode }) {
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

  useEffect(() => {
    initLiff();
  }, []);

  const initLiff = async () => {
    try {
      setFullLoading(true);
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
      backendClient: new BackendClient(),
      userData,
      setFullLoading,
      showCharacterStatus,
      setShowSummaryCharacterStatus,
      showItemStatus,
      setShowItemStatus,
      setIsShowScoreBoard,
      router,
      setRouter,
    }),
    [userData, router],
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
        <div className="fixed inset-0 z-50 bg-[#00000055] flex justify-center items-center">
          <div className="bg-white rounded-xl p-4 w-[90%] max-w-[500px] max-h-[80vh] overflow-auto">
            <div className="text-xl font-bold text-center mb-4 text-[#345b95]">
              อันดับผู้เล่น
            </div>

            <ScoreBoardContent />

            <button
              onClick={() => setIsShowScoreBoard(false)}
              className="mt-4 bg-[#f8da38] border-[#815230] border-2 px-4 py-2 rounded font-bold text-[#815230] w-full"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
      {children}
    </HelperContext.Provider>
  );
}

export const useHelperContext = () => useContext(HelperContext);
