"use client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

export function AlertDialogComponent({
  title,
  text,
  action,
  onCancel,
  canCancel,
}: {
  title: string;
  text: string;
  action: undefined | (() => void);
  onCancel: () => void;
  canCancel: boolean;
}) {
  const handleActionClick = () => {
    if (typeof action !== "undefined") {
      action();
    }
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-bgDefault border-4 border-borderStrong rounded-2xl p-6 w-[90%] max-w-sm shadow-lg text-white">
        <h2 className="text-lg font-bold text-center mb-4">{title}</h2>

        <p className="text-sm text-center mb-6">{text}</p>

        <div className="flex justify-center gap-4">
          {canCancel && (
            <button
              onClick={onCancel}
              className="bg-borderStrong text-white rounded-lg px-4 py-2 text-sm shadow cursor-pointer"
            >
              ยกเลิก
            </button>
          )}
          <button
            onClick={handleActionClick}
            className="bg-primary hover:bg-bgButton text-black rounded-lg px-4 py-2 text-sm shadow cursor-pointer"
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
}

const AlertContext = createContext(
  (
    title: string,
    text: string,
    action: undefined | (() => void),
    canCancel: boolean
  ) => {
    return [title, text, action, canCancel];
  }
);

export function AlertDialogProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [action, setAction] = useState<undefined | (() => void)>(undefined);
  const [canCancel, setCanCancel] = useState<boolean>(false);

  const onChangeAlert = useCallback(
    (
      title: string,
      text: string,
      action: undefined | (() => void),
      canCancel: boolean
    ) => {
      setTitle(title);
      setText(text);
      setAction(() => action);
      setCanCancel(canCancel);
      return [title, text, action, canCancel];
    },
    []
  );

  const onCancel = () => {
    setTitle("");
    setText("");
    setAction(undefined);
  };

  return (
    <AlertContext.Provider value={onChangeAlert}>
      {(title != "" || text != "") && (
        <AlertDialogComponent
          title={title}
          text={text}
          action={action}
          onCancel={onCancel}
          canCancel={canCancel}
        />
      )}
      {children}
    </AlertContext.Provider>
  );
}

export const useAlertContext = () => useContext(AlertContext);
