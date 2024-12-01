import "../styles.css";
import "@code-hike/mdx/styles"
import PlausibleProvider from "next-plausible";

export default function MyApp({ Component, pageProps }) {
  return (
    <PlausibleProvider domain="tryintent.com">
      <Component {...pageProps} />;
    </PlausibleProvider>
  );
}
