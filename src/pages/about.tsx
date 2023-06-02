import type { CustomNextPage } from "next";
import { About } from "src/pages-component/about";
import { FluidLayout } from "src/pages-layout";

const AboutPage: CustomNextPage = (props) => {
  return <About {...props} />;
};

AboutPage.getLayout = FluidLayout;

export default AboutPage;
