import DefaultTheme from "vitepress/theme-without-fonts";
import "./css/custom.css";
import HelpersList from "../../components/HelpersList.vue";

export default {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    ctx.app.component("HelpersList", HelpersList);
  },
};
