import clsx from "classnames";

export function cn(...inputs: (string | boolean | undefined)[]) {
  return clsx(inputs);
}

export default cn;
