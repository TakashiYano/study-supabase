import type { CustomNextPage } from "next";
import { Index } from "src/pages-component/index";
import { FixedLayout } from "src/pages-layout";

const IndexPage: CustomNextPage = (props) => {
  return <Index {...props} />;
};

IndexPage.getLayout = FixedLayout;

export default IndexPage;
