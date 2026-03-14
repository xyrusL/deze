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

export const GitHubIcon = createIcon(
  <path
    d="M12 3.5a8.5 8.5 0 0 0-2.69 16.56c.43.08.59-.18.59-.41v-1.44c-2.41.52-2.92-1.02-2.92-1.02-.4-.99-.97-1.25-.97-1.25-.79-.54.06-.53.06-.53.88.06 1.34.9 1.34.9.78 1.34 2.05.95 2.55.73.08-.57.31-.95.56-1.17-1.92-.22-3.94-.96-3.94-4.28 0-.95.34-1.72.89-2.32-.09-.22-.39-1.12.08-2.33 0 0 .73-.23 2.4.89a8.27 8.27 0 0 1 4.37 0c1.67-1.12 2.39-.89 2.39-.89.48 1.21.18 2.11.09 2.33.55.6.88 1.37.88 2.32 0 3.33-2.02 4.06-3.95 4.28.32.28.6.82.6 1.66v2.46c0 .23.15.5.6.41A8.5 8.5 0 0 0 12 3.5Z"
    fill="currentColor"
  />,
);

export const FacebookIcon = createIcon(
  <path
    d="M13.5 20v-6.2h2.2l.4-2.8h-2.6V9.2c0-.8.2-1.4 1.3-1.4H16V5.3c-.2 0-.9-.1-1.8-.1-1.8 0-3.1 1.1-3.1 3.3V11H9v2.8h2.3V20h2.2Z"
    fill="currentColor"
  />,
);

export const TikTokIcon = createIcon(
  <>
    <path
      d="M14.5 4.5c.5 1.5 1.5 2.7 3 3.4v2.4a6.3 6.3 0 0 1-3-.8v4.6a4.6 4.6 0 1 1-4.6-4.6c.3 0 .7 0 1 .1V12a2.3 2.3 0 1 0 1.3 2.1V4.5h2.3Z"
      fill="currentColor"
    />
    <path
      d="M14.5 4.5c.5 1.5 1.5 2.7 3 3.4"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
    />
  </>,
);

export const CopyIcon = createIcon(
  <>
    <rect
      height="11"
      rx="2"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.75"
      width="9"
      x="9"
      y="9"
    />
    <path
      d="M15 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
    />
  </>,
);

export const CheckIcon = createIcon(
  <path
    d="m5.5 12.5 4 4L18.5 7.5"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.75"
  />,
);

export const BrokenComputerIcon = createIcon(
  <>
    <rect
      height="10"
      rx="2"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.75"
      width="14"
      x="5"
      y="4"
    />
    <path
      d="M8 20h8M10 14l-1.2 3M14 14l1.2 3"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
    />
    <path
      d="M9.25 8.75h.5M14.25 8.75h.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
    />
    <path
      d="M9 11.8c.8-.7 1.9-1.1 3-1.1s2.2.4 3 1.1"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
    />
  </>,
);
