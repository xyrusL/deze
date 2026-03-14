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
