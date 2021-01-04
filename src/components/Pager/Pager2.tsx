import React from "react";
import { engine } from "../../engine";
import { Pager, PagerState, buildPager } from "@coveo/headless";
import "./Pager.css";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

export default class Pager2 extends React.Component {
  state!: PagerState;
  private headlessPager!: Pager;

  constructor(props:any) {
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

  handlePageChange(page: number) {
    this.headlessPager.selectPage(page);
  }

  private pagerBackArrow() {
    if (!this.state.hasPreviousPage) {
      return null;
    }
    return (
      <PaginationItem>
        <PaginationLink
          value="prev"
          onClick={() => {
            this.headlessPager.previousPage();
          }}
        >
          Previous Page
        </PaginationLink>
      </PaginationItem>
    );
  }

  private pagerNextArrow() {
    if (!this.state.hasNextPage) {
      return null;
    }
    return (
      <PaginationItem>
        <PaginationLink
          value="next"
          onClick={() => {
            this.headlessPager.nextPage();
          }}
        >
          Next Page
        </PaginationLink>
      </PaginationItem>
    );
  }

  private pages() {
    const pages = this.state.currentPages;
    return pages.map((page) => this.listPager(page));
  }

  private listPager(page: number) {
    return (
      <PaginationItem>
        <PaginationLink
          value="{page}"
          onClick={() => this.handlePageChange(page)}
        >
          {page}
        </PaginationLink>
      </PaginationItem>
    );
  }

  private pagerResult() {
    return (
      <nav>
        <Pagination>
          {this.pagerBackArrow()}
          {this.pages()}
          {this.pagerNextArrow()}
        </Pagination>
      </nav>
    );
  }
  render() {
    return this.pagerResult();
  }
}
