import { PropsWithChildren, useState } from "react";
import "./styles.css";

type Props = PropsWithChildren<{
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void | Promise<void>;
}>;

export const Button = ({ children, onClick }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <button onClick={onClick}>{children}</button>;
};
