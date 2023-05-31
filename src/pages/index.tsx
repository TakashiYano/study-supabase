import type { CustomNextPage } from "next";
import { Index } from "src/pages-component/index";
import { FluidLayout } from "src/pages-layout";

const IndexPage: CustomNextPage = (props) => {
  return <Index {...props} />;
};

IndexPage.getLayout = FluidLayout;

export default IndexPage;
