const { readFileSync } = require("fs");

const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
});

module.exports = withNextra({
  basePath: "/docs",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/installation",
        permanent: true,
      },
    ];
  },
  // mdxOptions: {
  //   rehypePrettyCodeOptions: {
  //     theme: JSON.parse(readFileSync("./custom-theme.json", "utf8")),
  //   },
  // },
});
