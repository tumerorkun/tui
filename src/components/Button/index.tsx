import {
  ForwardRefExoticComponent,
  PropsWithChildren,
  ReactNode,
  RefAttributes,
  forwardRef,
  useCallback,
  useState,
} from "react";
import clsnames from "classnames";
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

type ThemedButton = ForwardRefExoticComponent<
  Omit<Props, "variant"> & RefAttributes<HTMLButtonElement>
>;

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      onClick,
      children,
      whenBusy,
      className,
      isBusy = false,
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

    return (
      <button
        ref={refMapper}
        disabled={disabled}
        className={clsnames(
          `tui-button`,
          variant,
          styles.button,
          className ? styles[className] ?? className : ""
        )}
        aria-busy={isButtonBusy}
        onClick={isButtonBusy ? undefined : onClickHandler}
      >
        <div
          className={clsnames(styles.content, {
            [commonStyles.hide_with_opacity]: isButtonBusy,
          })}
        >
          {children}
        </div>
        {isButtonBusy && whenBusy ? (
          <div className={clsnames(commonStyles.absolute_fill, styles.is_busy)}>
            <span>{whenBusy}</span>
          </div>
        ) : null}
      </button>
    );
  }
) as ForwardRefExoticComponent<
  Omit<PropsWithChildren<Props>, "ref"> & RefAttributes<HTMLButtonElement>
> & {
  Primary: ThemedButton;
  Secondary: ThemedButton;
  Tertiary: ThemedButton;
  Ghost: ThemedButton;
  Danger: ThemedButton;
};

Button.Primary = forwardRef<HTMLButtonElement, Props>((props, ref) => (
  <Button {...props} ref={ref} variant="primary" />
));

Button.Secondary = forwardRef<HTMLButtonElement, Props>((props, ref) => (
  <Button {...props} ref={ref} variant="secondary" />
));

Button.Tertiary = forwardRef<HTMLButtonElement, Props>((props, ref) => (
  <Button {...props} ref={ref} variant="tertiary" />
));

Button.Ghost = forwardRef<HTMLButtonElement, Props>((props, ref) => (
  <Button {...props} ref={ref} variant="ghost" />
));

Button.Danger = forwardRef<HTMLButtonElement, Props>((props, ref) => (
  <Button {...props} ref={ref} variant="danger" />
));
