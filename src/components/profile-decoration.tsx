import type { ReactNode } from "react";

type DecorationLayer = {
  className: string;
};

type DecorationBadge = {
  className: string;
  content: ReactNode;
};

type DecorationConfig = {
  description: string;
  label: string;
  shellClassName: string;
  layers: DecorationLayer[];
  badge?: DecorationBadge;
};

const decorationRegistry = {
  none: {
    badge: undefined,
    description: "No extra profile decoration.",
    label: "None",
    shellClassName: "",
    layers: [],
  },
  emberHalo: {
    shellClassName: "profile-decoration profile-decoration--ember-halo",
    description: "A vivid crimson halo with a floating ember crest.",
    label: "Ember Halo",
    layers: [
      { className: "profile-decoration__layer profile-decoration__layer--mist" },
      { className: "profile-decoration__layer profile-decoration__layer--ring" },
      { className: "profile-decoration__layer profile-decoration__layer--glow" },
      { className: "profile-decoration__layer profile-decoration__layer--streak profile-decoration__layer--streak-a" },
      { className: "profile-decoration__layer profile-decoration__layer--streak profile-decoration__layer--streak-b" },
    ],
    badge: {
      className: "profile-decoration__badge profile-decoration__badge--ember",
      content: <span aria-hidden="true" className="profile-decoration__badge-mark" />,
    },
  },
  angel: {
    badge: undefined,
    shellClassName: "profile-decoration profile-decoration--angel",
    description: "A soft halo with bright wings for a calm angel look.",
    label: "Angel",
    layers: [
      { className: "profile-decoration__layer profile-decoration__layer--angel-halo" },
      { className: "profile-decoration__layer profile-decoration__layer--angel-wing profile-decoration__layer--angel-wing-left" },
      { className: "profile-decoration__layer profile-decoration__layer--angel-wing profile-decoration__layer--angel-wing-right" },
      { className: "profile-decoration__layer profile-decoration__layer--angel-spark profile-decoration__layer--angel-spark-a" },
      { className: "profile-decoration__layer profile-decoration__layer--angel-spark profile-decoration__layer--angel-spark-b" },
    ],
  },
  catEars: {
    badge: undefined,
    shellClassName: "profile-decoration profile-decoration--cat-ears",
    description: "Cat ears and whiskers for a playful profile frame.",
    label: "Cat Ears",
    layers: [
      { className: "profile-decoration__layer profile-decoration__layer--cat-ring" },
      { className: "profile-decoration__layer profile-decoration__layer--cat-ear profile-decoration__layer--cat-ear-left" },
      { className: "profile-decoration__layer profile-decoration__layer--cat-ear profile-decoration__layer--cat-ear-right" },
      { className: "profile-decoration__layer profile-decoration__layer--cat-whiskers profile-decoration__layer--cat-whiskers-left" },
      { className: "profile-decoration__layer profile-decoration__layer--cat-whiskers profile-decoration__layer--cat-whiskers-right" },
      { className: "profile-decoration__layer profile-decoration__layer--cat-spark profile-decoration__layer--cat-spark-a" },
      { className: "profile-decoration__layer profile-decoration__layer--cat-spark profile-decoration__layer--cat-spark-b" },
    ],
  },
  loneWolf: {
    shellClassName: "profile-decoration profile-decoration--lone-wolf",
    description: "Stars, a moon glow, and a lively wolf accent.",
    label: "Lone Wolf",
    layers: [
      { className: "profile-decoration__layer profile-decoration__layer--wolf-ring" },
      { className: "profile-decoration__layer profile-decoration__layer--wolf-moon" },
      { className: "profile-decoration__layer profile-decoration__layer--wolf-star profile-decoration__layer--wolf-star-a" },
      { className: "profile-decoration__layer profile-decoration__layer--wolf-star profile-decoration__layer--wolf-star-b" },
      { className: "profile-decoration__layer profile-decoration__layer--wolf-star profile-decoration__layer--wolf-star-c" },
      { className: "profile-decoration__layer profile-decoration__layer--wolf-star profile-decoration__layer--wolf-star-d" },
    ],
    badge: {
      className: "profile-decoration__badge profile-decoration__badge--wolf-head",
      content: (
        <span aria-hidden="true" className="profile-decoration__badge-mark profile-decoration__badge-mark--wolf-head" />
      ),
    },
  },
  fallenAngelWhite: {
    badge: undefined,
    shellClassName: "profile-decoration profile-decoration--fallen-angel",
    description: "White wings with a brighter dramatic frame.",
    label: "Fallen Angel",
    layers: [
      { className: "profile-decoration__layer profile-decoration__layer--fallen-wing profile-decoration__layer--fallen-wing-left" },
      { className: "profile-decoration__layer profile-decoration__layer--fallen-wing profile-decoration__layer--fallen-wing-right" },
      { className: "profile-decoration__layer profile-decoration__layer--fallen-ring" },
      { className: "profile-decoration__layer profile-decoration__layer--fallen-shine" },
    ],
  },
} as const satisfies Record<string, DecorationConfig>;

export type ProfileDecorationVariant = keyof typeof decorationRegistry;
export const profileDecorationOptions = Object.entries(decorationRegistry).map(
  ([value, config]) => ({
    description: config.description,
    label: config.label,
    value: value as ProfileDecorationVariant,
  }),
);

type ProfileDecorationProps = {
  children: ReactNode;
  className?: string;
  variant?: ProfileDecorationVariant;
};

export function ProfileDecoration({
  children,
  className,
  variant = "none",
}: ProfileDecorationProps) {
  const decoration = decorationRegistry[variant];

  if (variant === "none") {
    return <>{children}</>;
  }

  return (
    <div className={[decoration.shellClassName, className].filter(Boolean).join(" ")}>
      {decoration.layers.map((layer) => (
        <span
          key={layer.className}
          aria-hidden="true"
          className={layer.className}
        />
      ))}
      {decoration.badge ? (
        <span aria-hidden="true" className={decoration.badge.className}>
          {decoration.badge.content}
        </span>
      ) : null}
      <div className="profile-decoration__content">{children}</div>
    </div>
  );
}
