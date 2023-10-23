import { PropsWithChildren, forwardRef, useCallback, useState } from "react";
import styles from "./styles.module.scss";
import commonStyles from "../../styles/common.module.scss";
import { useRefMiddleware } from "../../hooks/useRefMiddleware";

type Props = PropsWithChildren<{
  isBusy?: boolean;
  disabled?: boolean;
  className?: string;
  busyText?: string;
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
      busyText,
      className,
      disabled = false,
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
          await onClick(e);
          if (buttonRef.current) {
            setIsEventBusy(false);
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
        className={`${styles.button} ${csName}`.trim()}
        aria-busy={isButtonBusy}
        onClick={isButtonBusy ? undefined : onClickHandler}
      >
        <div className={styles.content}>{children}</div>
        {isButtonBusy ? (
          <div className={`${commonStyles.absolute_fill} ${styles.is_busy}`}>
            <span>{busyText}</span>
          </div>
        ) : null}
      </button>
    );
  }
);
