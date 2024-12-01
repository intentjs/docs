import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "IntentJS",
  description: "A fresh take on traditional nodejs frameworks,",
  themeConfig: {
    siteTitle: "IntentJS",
    logo: "/logo.png",
    // https://vitepress.dev/reference/default-theme-config
    footer: {
      message: "Developed by Humans at HanaLabs",
      copyright: "Copyright © 2024-present Vinayak",
    },
    search: {
      provider: "local",
    },
    outline: {
      level: [2, 3], // Show both h2 and h3 in the outline
      label: "On this page",
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],
    editLink: {
      pattern: "https://github.com/vuejs/vitepress/edit/main/docs/:path",
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
          { text: "Installation", link: "/docs/installation" },
          { text: "First Project", link: "/docs/first-project" },
        ],
      },
      {
        text: "Fundamentals",
        items: [
          { text: "Configuration", link: "/docs/configuration" },
          { text: "Directory Structure", link: "/docs/directory-structure" },
          { text: "Providers", link: "/docs/providers" },
          { text: "Service Providers", link: "/docs/service-providers" },
          { text: "Application Containers", link: "/docs/app-containers" },
          { text: "Reflectors", link: "/docs/reflectors" },
        ],
      },
      {
        text: "Basics",
        items: [
          { text: "Controllers", link: "/docs/controllers" },
          { text: "Services", link: "/docs/services" },
          { text: "Middlewares", link: "/docs/middlewares" },
          { text: "Guards", link: "/docs/guards" },
          { text: "Requests", link: "/docs/requests" },
          { text: "Transformers", link: "/docs/transformers" },
          { text: "Validation", link: "/docs/validation" },
          { text: "Error Handling", link: "/docs/error-handling" },
        ],
      },
      {
        text: "Advance",
        items: [
          { text: "Console", link: "/docs/console" },
          { text: "Cache", link: "/docs/cache" },
          { text: "Events", link: "/docs/events" },
          { text: "File Storage", link: "/docs/file-storage" },
          { text: "Helpers", link: "/docs/helpers" },
          { text: "Localization", link: "/docs/localization" },
          { text: "Logging", link: "/docs/logging" },
          { text: "Mailers", link: "/docs/mailers" },
          { text: "Queues", link: "/docs/queues" },
        ],
      },
      {
        text: "Database",
        items: [
          { text: "Introduction", link: "/docs/databases/getting-started" },
          { text: "Migrations", link: "/docs/databases/migrations" },
          { text: "Models", link: "/docs/databases/models" },
          { text: "Repository", link: "/docs/databases/repository" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/intentjs/intent" },
      { icon: "x", link: "https://x.com/intentjs" },
    ],
  },
});
