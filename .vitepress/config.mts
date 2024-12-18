import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "IntentJS",
  description: "A fresh take on traditional nodejs frameworks,",
  sitemap: {
    hostname: "https://tryintent.com",
  },
  ignoreDeadLinks: [
    // ignore exact url "/playground"
    "/playground",
    // ignore all localhost links
    /^https?:\/\/localhost/,
    // ignore all links include "/repl/""
    /\/repl\//,
    // custom function, ignore all links include "ignore"
    (url) => {
      return url.toLowerCase().includes("ignore");
    },
  ],
  base: "/docs/",
  srcDir: "./docs",
  outDir: "./dist",
  cleanUrls: true,
  appearance: "dark",
  rewrites: {
    "/": "/installation",
  },
  themeConfig: {
    siteTitle: "IntentJS",
    logo: {
      src: "/logo.png",
    },
    logoLink: "/docs/installation",
    // https://vitepress.dev/reference/default-theme-config
    footer: {
      message: "Developed by Humans at HanaLabs",
      copyright: "Copyright © 2024-present Vinayak Sarawagi",
    },
    search: {
      provider: "local",
    },
    outline: {
      level: [2, 3], // Show both h2 and h3 in the outline
      label: "On this page",
    },
    nav: [
      { text: "Home", link: "https://tryintent.com" },
      { text: "Docs", link: "/installation" },
    ],
    editLink: {
      pattern: "https://github.com/intentjs/docs/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },

    lastUpdated: {
      text: "Updated at",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "medium",
      },
    },

    externalLinkIcon: true,

    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "Installation", link: "/installation" },
          { text: "First Project", link: "/first-project" },
        ],
      },
      {
        text: "Fundamentals",
        items: [
          { text: "Configuration", link: "/configuration" },
          { text: "Directory Structure", link: "/directory-structure" },
          { text: "Providers", link: "/providers" },
          { text: "Service Providers", link: "/service-providers" },
          { text: "Application Containers", link: "/app-containers" },
          { text: "Reflectors", link: "/reflectors" },
        ],
      },
      {
        text: "Basics",
        items: [
          { text: "Controllers", link: "/controllers" },
          { text: "Requests", link: "/requests" },
          { text: "Response", link: "/response" },
          { text: "Execution Context", link: "/execution-context" },
          { text: "Services", link: "/services" },
          { text: "Middlewares", link: "/middlewares" },
          { text: "Guards", link: "/guards" },
          { text: "Transformers", link: "/transformers" },
          { text: "Validation", link: "/validation" },
          { text: "Error Handling", link: "/error-handling" },
        ],
      },
      {
        text: "Advance",
        items: [
          { text: "Console", link: "/console" },
          { text: "Cache", link: "/cache" },
          { text: "Events", link: "/events" },
          { text: "File Storage", link: "/file-storage" },
          { text: "Helpers", link: "/helpers" },
          { text: "Localization", link: "/localization" },
          { text: "Logging", link: "/logging" },
          { text: "Mailers", link: "/mailers" },
          { text: "Queues", link: "/queues" },
        ],
      },
      {
        text: "Database",
        items: [
          { text: "Introduction", link: "/databases/getting-started" },
          { text: "Migrations", link: "/databases/migrations" },
          { text: "Models", link: "/databases/models" },
          { text: "Repository", link: "/databases/repository" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/intentjs/intent" },
      { icon: "x", link: "https://x.com/intentjs" },
    ],
  },
});
