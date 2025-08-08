"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

const FullLoadingContext = createContext((value: boolean) => value);

function FullLoading() {
  return (
    <div className="absolute inset-0 z-100 flex items-center justify-center backdrop-blur-sm">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#815230] border-opacity-50 mb-4 mx-auto"></div>
      </div>
    </div>
  );
}

export function FullLoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState<boolean>(false);

  const onChangeLoading = useCallback((value: boolean) => {
    setLoading(value);
    return value;
  }, []);

  return (
    <FullLoadingContext.Provider value={onChangeLoading}>
      {loading && <FullLoading />}
      {children}
    </FullLoadingContext.Provider>
  );
}

export const useFullLoadingContext = () => useContext(FullLoadingContext);
