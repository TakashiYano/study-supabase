import type { CustomNextPage } from "next";
import { About } from "src/pages-component/about";
import { FixedLayout } from "src/pages-layout";

const AboutPage: CustomNextPage = (props) => {
  return <About {...props} />;
};

AboutPage.getLayout = FixedLayout;

export default AboutPage;
