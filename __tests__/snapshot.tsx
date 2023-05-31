import renderer from "react-test-renderer";
import IndexPage from "src/pages";
import AboutPage from "src/pages/about";


it("renders index unchanged", () => {
  const tree = renderer.create(<IndexPage />).toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders about unchanged", () => {
  const tree = renderer.create(<AboutPage />).toJSON();
  expect(tree).toMatchSnapshot();
});
