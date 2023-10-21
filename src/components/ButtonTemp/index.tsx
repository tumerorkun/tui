import { PropsWithChildren, useState } from "react";
import styles from "./styles.module.scss";

type Props = PropsWithChildren<{
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void | Promise<void>;
}>;

export const ButtonTemp = ({ children, onClick }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
};
