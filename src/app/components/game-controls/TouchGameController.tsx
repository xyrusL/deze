"use client";

import { type ReactNode } from "react";
import styles from "./TouchGameController.module.css";

type ButtonVariant = "primary" | "secondary" | "accent";
type DirectionalPadLayout = "cross" | "row";
type ControllerLayout = "panel" | "inlineBar";

type ControllerAction = {
  label: string;
  ariaLabel?: string;
  onAction: () => void;
  icon?: ReactNode;
  variant?: ButtonVariant;
};

type DirectionalPadActions = {
  layout?: DirectionalPadLayout;
  up?: ControllerAction;
  down?: ControllerAction;
  left?: ControllerAction;
  right?: ControllerAction;
};

export type TouchGameControllerProps = {
  className?: string;
  layout?: ControllerLayout;
  title?: string;
  description?: string;
  primaryAction: ControllerAction;
  secondaryAction?: ControllerAction;
  directionalPad?: DirectionalPadActions;
};

function variantClassName(variant: ButtonVariant | undefined): string {
  switch (variant) {
    case "secondary":
      return styles.buttonSecondary;
    case "accent":
      return styles.buttonAccent;
    default:
      return styles.buttonPrimary;
  }
}

function ControllerButton({ action, compact = false }: { action: ControllerAction; compact?: boolean }) {
  const className = `${styles.button} ${variantClassName(action.variant)}${compact ? ` ${styles.buttonCompact}` : ""}`;

  return (
    <button
      type="button"
      className={className}
      aria-label={action.ariaLabel ?? action.label}
      onPointerDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
        action.onAction();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          action.onAction();
        }
      }}
    >
      {action.icon && <span className={styles.buttonIcon}>{action.icon}</span>}
      <span className={styles.buttonLabel}>{action.label}</span>
    </button>
  );
}

function DirectionalPad({ directionalPad }: { directionalPad: DirectionalPadActions }) {
  const hasDirectionalButtons = Boolean(directionalPad.up || directionalPad.down || directionalPad.left || directionalPad.right);
  if (!hasDirectionalButtons) {
    return null;
  }

  const layout = directionalPad.layout ?? "cross";
  const dpadButton = (action: ControllerAction | undefined, fallbackLabel: string, fallbackAriaLabel: string) => {
    if (!action) {
      return <span className={styles.spacer} aria-hidden="true" />;
    }

    return (
      <ControllerButton
        action={{
          label: action.label || fallbackLabel,
          ariaLabel: action.ariaLabel || fallbackAriaLabel,
          onAction: action.onAction,
          icon: action.icon,
          variant: action.variant ?? "secondary",
        }}
        compact
      />
    );
  };

  if (layout === "row") {
    return (
      <div className={`${styles.dPad} ${styles.dPadRow}`} aria-label="Directional controls">
        {directionalPad.left && dpadButton(directionalPad.left, "Left", "Move left")}
        {directionalPad.up && dpadButton(directionalPad.up, "Up", "Move up")}
        {directionalPad.down && dpadButton(directionalPad.down, "Down", "Move down")}
        {directionalPad.right && dpadButton(directionalPad.right, "Right", "Move right")}
      </div>
    );
  }

  return (
    <div className={`${styles.dPad} ${styles.dPadCross}`} aria-label="Directional controls">
      <span className={styles.spacer} aria-hidden="true" />
      {dpadButton(directionalPad.up, "Up", "Move up")}
      <span className={styles.spacer} aria-hidden="true" />

      {dpadButton(directionalPad.left, "Left", "Move left")}
      <span className={styles.spacer} aria-hidden="true" />
      {dpadButton(directionalPad.right, "Right", "Move right")}

      <span className={styles.spacer} aria-hidden="true" />
      {dpadButton(directionalPad.down, "Down", "Move down")}
      <span className={styles.spacer} aria-hidden="true" />
    </div>
  );
}

export default function TouchGameController({
  className,
  layout = "panel",
  title,
  description,
  primaryAction,
  secondaryAction,
  directionalPad,
}: TouchGameControllerProps) {
  const layoutClassName = layout === "inlineBar" ? styles.controllerInlineBar : "";
  const actionRowClassName = secondaryAction ? styles.actionRow : `${styles.actionRow} ${styles.actionRowSingle}`;

  return (
    <section className={`${styles.controller}${layoutClassName ? ` ${layoutClassName}` : ""}${className ? ` ${className}` : ""}`} aria-label={title ?? "Touch game controller"}>
      {(title || description) && (
        <header className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {description && <p className={styles.description}>{description}</p>}
        </header>
      )}

      <div className={actionRowClassName}>
        <ControllerButton action={primaryAction} />
        {secondaryAction && <ControllerButton action={secondaryAction} />}
      </div>

      {directionalPad && <DirectionalPad directionalPad={directionalPad} />}
    </section>
  );
}
