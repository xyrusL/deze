import ExternalRedirectTrigger from "@/components/ExternalRedirectTrigger";
import FaviconBadge from "@/components/FaviconBadge";

interface ProjectCardProps {
  name: string;
  description: string;
  url: string;
  faviconUrl: string;
  hostname: string;
  isFallback: boolean;
  index: number;
}

export default function ProjectCard({
  name,
  description,
  url,
  faviconUrl,
  hostname,
  index,
}: ProjectCardProps) {
  return (
    <ExternalRedirectTrigger
      url={url}
      name={name}
      description={description}
      hostname={hostname}
      faviconUrl={faviconUrl}
      className="project-card reveal-up group"
      style={{ animationDelay: `${180 + index * 110}ms` }}
    >
      {/* Top row: icon left, arrow right */}
      <div className="flex items-start justify-between">
        <FaviconBadge name={name} faviconUrl={faviconUrl} />
        <span className="project-arrow" aria-hidden="true">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.7}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 17L17 7M17 7H8M17 7v9"
            />
          </svg>
        </span>
      </div>

      {/* Title */}
      <h3 className="project-title">{name}</h3>

      {/* Description */}
      <p className="project-description">{description}</p>

      {/* Footer: domain only, truncated */}
      <div className="project-footer">
        <span className="project-hostname">{hostname}</span>
      </div>
    </ExternalRedirectTrigger>
  );
}
