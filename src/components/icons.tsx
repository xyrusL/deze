import type { ReactNode } from "react";

type IconProps = {
  className?: string;
};

function createIcon(path: ReactNode) {
  return function Icon({ className = "h-4 w-4" }: IconProps) {
    return (
      <svg
        aria-hidden="true"
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {path}
      </svg>
    );
  };
}

export const ArrowUpRightIcon = createIcon(
  <path
    d="M7 17 17 7M9.5 7H17v7.5"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.75"
  />,
);

export const HomeIcon = createIcon(
  <>
    <path
      d="M4 10.75 12 4l8 6.75V20H4v-9.25Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
    />
    <path
      d="M9.5 20v-5.25h5V20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
    />
  </>,
);

export const GridIcon = createIcon(
  <path
    d="M5 5h6v6H5zm8 0h6v6h-6zM5 13h6v6H5zm8 0h6v6h-6z"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.75"
  />,
);

export const ProfileIcon = createIcon(
  <>
    <path
      d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
    />
    <path
      d="M4.5 19.5a7.5 7.5 0 0 1 15 0"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
    />
  </>,
);

export const MailIcon = createIcon(
  <>
    <path
      d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
    />
    <path
      d="m5 8 7 5 7-5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
    />
  </>,
);

export const SparkIcon = createIcon(
  <>
    <path
      d="M12 3.75 13.8 8.2 18.25 10 13.8 11.8 12 16.25 10.2 11.8 5.75 10 10.2 8.2 12 3.75Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
    />
    <path
      d="M18.5 4.5v3M20 6h-3"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
    />
  </>,
);

export const OrbitIcon = createIcon(
  <>
    <ellipse
      cx="12"
      cy="12"
      rx="7.5"
      ry="3.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      transform="rotate(-18 12 12)"
    />
    <ellipse
      cx="12"
      cy="12"
      rx="7.5"
      ry="3.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      transform="rotate(26 12 12)"
    />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </>,
);
