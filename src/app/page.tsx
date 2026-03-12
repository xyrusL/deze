import ProjectCard from "@/components/ProjectCard";
import SmoothScrollLink from "@/components/SmoothScrollLink";
import { getProjectMetadata, type ProjectSource } from "@/lib/project-metadata";

export const dynamic = "force-dynamic";

const projectSources: ProjectSource[] = [
  {
    url: "https://rioanime.deze.me",
    fallbackName: "RioAnime",
    fallbackDescription:
      "Watch anime easily — no clutter, just pick and play.",
  },
  {
    url: "https://papaselectronicrepairshop.deze.me",
    fallbackName: "Papa's Electronic Repair Shop",
    fallbackDescription:
      "A simple site for a local electronics repair shop. Easy to find, easy to contact.",
  },
  {
    url: "https://watermelon.deze.me",
    fallbackName: "Watermelon SMP",
    fallbackDescription:
      "A Minecraft server community site — server info, features, and a place for the players.",
  },
  {
    url: "https://chunkloader.deze.me",
    fallbackName: "Chunkloader",
    fallbackDescription:
      "Loads content in chunks so things stay fast and don't choke on big files.",
  },
];

export default async function Home() {
  const projects = await getProjectMetadata(projectSources);

  return (
    <>
      <section id="home" className="section-shell pt-28 sm:pt-36">
        <div className="hero-shell mx-auto max-w-6xl">
          <div className="hero-content">
            <h1 className="hero-title reveal-up" style={{ animationDelay: "120ms" }}>
              Everything
              <br />
              I&apos;ve built.
            </h1>

            <p
              className="hero-copy reveal-up"
              style={{ animationDelay: "210ms" }}
            >
              Deze.me is the main place to browse everything I build. It brings
              together my apps, tools, and smaller experiments in one clean space,
              while each project still keeps its own site and its own style.
            </p>

            <p
              className="hero-copy hero-copy-secondary reveal-up"
              style={{ animationDelay: "250ms" }}
            >
              If you want a quick way to see what I&apos;ve been making, what&apos;s live,
              and what I&apos;m still improving, this is where to start.
            </p>

            <div
              className="reveal-up flex flex-col gap-4 pt-8 sm:flex-row"
              style={{ animationDelay: "300ms" }}
            >
              <SmoothScrollLink href="#projects" className="button-primary">
                See projects
              </SmoothScrollLink>
              <SmoothScrollLink href="#about" className="button-secondary">
                About me
              </SmoothScrollLink>
            </div>
          </div>

          <div
            className="hero-visual reveal-up"
            style={{ animationDelay: "220ms" }}
            aria-hidden="true"
          >
            <div className="hero-orbit hero-orbit-large" />
            <div className="hero-orbit hero-orbit-small" />
            <div className="hero-glow hero-glow-top" />
            <div className="hero-glow hero-glow-bottom" />

            <div className="hero-stage">
              <div className="hero-stage-card hero-stage-card-primary">
                <span className="hero-stage-kicker">Apps</span>
                <p className="hero-stage-title">Live sites with their own identity.</p>
              </div>

              <div className="hero-stage-card hero-stage-card-secondary">
                <span className="hero-stage-kicker">Tools</span>
                <p className="hero-stage-title">Utility builds shaped by real use.</p>
              </div>

              <div className="hero-stage-card hero-stage-card-tertiary">
                <span className="hero-stage-kicker">Experiments</span>
                <p className="hero-stage-title">Ideas that keep changing until they click.</p>
              </div>

              <div className="hero-stage-footer">
                <span className="hero-stage-footer-label">Deze.me</span>
                <p className="hero-stage-footer-copy">
                  A front door for the work, not a box around it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="section-shell">
        <div className="mx-auto max-w-6xl">
          <div className="section-heading reveal-up">
            <p className="section-kicker">Projects</p>
            <h2 className="section-title">Things I&apos;ve shipped.</h2>
            <p className="section-copy">
              Each project lives on its own subdomain. Click any card to visit it directly.
            </p>
          </div>

          <div className="project-grid">
            {projects.map((project, index) => (
              <ProjectCard key={project.url} {...project} index={index} />
            ))}
          </div>

          <div className="surface-panel reveal-up mt-6 flex items-center justify-between gap-4 px-6 py-5 text-sm text-[var(--muted)]">
            <span>More coming soon.</span>
            <span className="text-[var(--foreground-soft)]">Stay tuned soon</span>
          </div>
        </div>
      </section>

      <section id="about" className="section-shell pb-24 sm:pb-32">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_minmax(0,1.1fr)]">
          <div className="surface-panel reveal-up overflow-hidden p-8 sm:p-10">
            <p className="section-kicker">About</p>
            <h2 className="section-title mt-3">Hey, I&apos;m Paul. I&apos;m 22.</h2>
            <p className="section-copy mt-5">
              I love building things with AI and shipping them fast. Deze.me is basically
              my personal playground — I put projects here as I make them, and they
              keep getting better as I learn more.
            </p>
          </div>

          <div className="surface-panel reveal-up p-8 sm:p-10" style={{ animationDelay: "120ms" }}>
            <div className="flex items-start gap-5">
              <div className="profile-mark">P</div>
              <div>
                <p className="panel-kicker">How I work</p>
                <p className="panel-copy mt-4">
                  I care a lot about how things look and feel. Clean layouts, smooth
                  interactions, good typography — not just because it looks nice, but
                  because it makes things way easier to use.
                </p>
                <p className="panel-copy mt-4">
                  Want to collab or just say hi? Hit me up at{" "}
                  <a href="mailto:paul@deze.me" className="inline-link">
                    paul@deze.me
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer-shell">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} deze.me</p>
          <p>Built with curiosity and a lot of trial and error.</p>
        </div>
      </footer>
    </>
  );
}
