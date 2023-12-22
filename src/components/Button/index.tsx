import {
  PropsWithChildren,
  ReactNode,
  forwardRef,
  useCallback,
  useState,
} from "react";
import styles from "./styles.module.scss";
import commonStyles from "../../styles/common.module.scss";
import "./variants.scss";
import { useRefMiddleware } from "../../hooks/useRefMiddleware";

type Props = PropsWithChildren<{
  isBusy?: boolean;
  disabled?: boolean;
  className?: string;
  whenBusy?: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "tertiary" | "danger" | string;
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void | Promise<void>;
}>;

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      children,
      onClick,
      isBusy = false,
      whenBusy,
      className,
      disabled = false,
      variant = "primary",
    },
    ref
  ) => {
    const [buttonRef, refMapper] = useRefMiddleware(ref);

    const [isEventBusy, setIsEventBusy] = useState(false);

    const isButtonBusy = isBusy || isEventBusy;

    const onClickHandler = useCallback(
      async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (onClick) {
          setIsEventBusy(true);
          try {
            await onClick(e);
          } finally {
            if (buttonRef.current) {
              setIsEventBusy(false);
            }
          }
        }
      },
      [onClick]
    );

    const csName = className ? styles[className] ?? className : "";

    return (
      <button
        ref={refMapper}
        disabled={disabled}
        className={`tui-button ${variant} ${styles.button} ${csName}`.trim()}
        aria-busy={isButtonBusy}
        onClick={isButtonBusy ? undefined : onClickHandler}
      >
        <div
          className={`${styles.content} ${
            isButtonBusy ? commonStyles.hide_with_opacity : ""
          }`.trim()}
        >
          {children}
        </div>
        {isButtonBusy ? (
          <div className={`${commonStyles.absolute_fill} ${styles.is_busy}`}>
            <span>{whenBusy}</span>
          </div>
        ) : null}
      </button>
    );
  }
);
