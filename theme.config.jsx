import { useRouter } from "next/router";
import { useConfig } from "nextra-theme-docs";
import GithubStar from "./src/components/utils/githubstar";
import { iconMap } from "./src/components/utils/iconmap";
import Community from "./src/components/Community";
import Footer from "./src/components/Footer";
import { Logo } from "./src/components/images/providers";

const GITHUB_REPO_STAR = <GithubStar />;

export default {
  head: () => {
    const { asPath, defaultLocale, locale } = useRouter();
    const { frontMatter } = useConfig();
    const url =
      "https://tryintent.com" +
      (defaultLocale === locale ? asPath : `/${locale}${asPath}`);

    return (
      <>
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={frontMatter.title || "IntentJs"} />
        <meta
          property="og:description"
          content={frontMatter.description || "The next site builder"}
        />
        <meta
          property="og:image"
          content={
            frontMatter.image ||
            "https://docs.intentjs.dev/~gitbook/ogimage/c54x0ZXLzB17lOdopIfm"
          }
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="docs.intentjs.dev" />
        <meta property="twitter:url" content={url} />
        <meta name="twitter:title" content={frontMatter.title || "IntentJs"} />
        <meta
          name="twitter:description"
          content={frontMatter.description || "The next site builder"}
        />
        <meta
          name="twitter:image"
          content={
            frontMatter.image ||
            "https://docs.intentjs.dev/~gitbook/ogimage/c54x0ZXLzB17lOdopIfm"
          }
        />
      </>
    );
  },
  primaryHue: 80,
  logo: (
    <div className="flex flex-row gap-2 items-center">
      <Logo />
      <span className="text-3xl">Intent</span>
    </div>
  ),
  chat: {
    link: "https://discord.com/invite/CvCPVYMR",
  },
  project: {
    link: "https://github.com/intentjs/core",
    icon: (
      <div className="flex flex-row gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          className="bi bi-github"
          viewBox="0 0 16 16"
        >
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
        </svg>
        <span>{GITHUB_REPO_STAR}</span>
      </div>
    ),
  },
  docsRepositoryBase: "https://github.com/intentjs/docs",
  sidebar: {
    titleComponent({ title }) {
      const IconComponent = iconMap[title] || null;
      return (
        <div className="flex flex-row items-center gap-3">
          {IconComponent ? <IconComponent size={18} /> : null}
          {title}
        </div>
      );
    },
  },
  feedback: {
    content: "",
  },
  footer: {
    component: <Footer />,
  },
  editLink: {
    component: (props) => <Community {...props} />,
  },
  navigation: {
    prev: true,
    next: true,
  },
  gitTimestamp: true,
  useNextSeoProps() {
    const { asPath } = useRouter();
    if (asPath !== "/") {
      return {
        titleTemplate: "%s – Intent",
      };
    }
  },
};
