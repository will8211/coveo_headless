import "./Pager.css";
import React from "react";
import { engine } from "../../engine";
import { Pager, PagerState, buildPager } from "@coveo/headless";
import Pagination from "@material-ui/lab/Pagination";
import { generateRandomString } from "../Facet/CategoryFacet";

export default class HeadlessPager extends React.Component {
  state!: PagerState;
  private headlessPager!: Pager;

  constructor(props: any) {
    super(props);
    this.headlessPager = buildPager(engine);
    this.state = this.headlessPager.state;
  }
  componentDidMount() {
    this.headlessPager.subscribe(() => this.updateState());
  }

  private updateState() {
    this.setState(this.headlessPager.state);
  }
  private pagerCount() {
    return this.state.maxPage;
  }

  handlePageChange(page: number) {
    this.headlessPager.selectPage(page);
  }

  render() {
    return (
      <Pagination
        key={generateRandomString()}
        className="pager"
        page={this.state.currentPage}
        count={this.pagerCount()}
        variant="outlined"
        color="primary"
        onChange={(e, page) => this.handlePageChange(page)}
      />
    );
  }
}
