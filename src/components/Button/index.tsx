import {
  PropsWithChildren,
  forwardRef,
  useCallback,
  useRef,
  useState,
} from "react";
import styles from "./styles.module.scss";
import commonStyles from "../../styles/common.module.scss";
import { useRefMiddleware } from "../../hooks/useRefMiddleware";
import { useUpdateEffect } from "../../hooks/useUpdateEffect";

type ButtonClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;
type Props = PropsWithChildren<{
  isLoading?: boolean;
  loadingText?: string;
  onClick?: (e: ButtonClickEvent) => void | Promise<void>;
}>;

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ children, onClick, isLoading = false, loadingText }, ref) => {
    const [isBusy, setIsBusy] = useState(isLoading);

    const [buttonRef, refMapper] = useRefMiddleware(ref);

    const busyStateFromClickEvent = useRef(false);

    const busyStateFromProps = useRef(isLoading);
    busyStateFromProps.current = isLoading;

    useUpdateEffect(
      useCallback(() => {
        if (!busyStateFromClickEvent.current) {
          setIsBusy(isLoading);
        }
      }, [isLoading])
    );

    const onClickHandler = useCallback(
      async (e: ButtonClickEvent) => {
        if (onClick) {
          busyStateFromClickEvent.current = true;
          setIsBusy(true);
          await onClick(e);
          busyStateFromClickEvent.current = false;
          if (buttonRef.current && !busyStateFromProps.current) {
            setIsBusy(false);
          }
        }
      },
      [onClick]
    );

    return (
      <button
        ref={refMapper}
        className={styles.button}
        aria-busy={isBusy}
        onClick={isBusy ? undefined : onClickHandler}
      >
        <div className={styles.content}>{children}</div>
        {isBusy ? (
          <div className={`${commonStyles.absolute_fill} ${styles.is_busy}`}>
            <span>{loadingText}</span>
          </div>
        ) : null}
      </button>
    );
  }
);
