import { type ReactNode } from "react";
import styles from "./ArcadeGameStage.module.css";

type ArcadeGameStageProps = {
  className?: string;
  shellClassName?: string;
  interactive?: boolean;
  children: ReactNode;
};

export default function ArcadeGameStage({ className, shellClassName, interactive = false, children }: ArcadeGameStageProps) {
  const shell = shellClassName ? `${styles.shell} ${shellClassName}` : styles.shell;
  const stage = [styles.stage, interactive ? styles.interactive : "", className ?? ""].filter(Boolean).join(" ");

  return (
    <div className={shell}>
      <div className={stage}>{children}</div>
    </div>
  );
}
