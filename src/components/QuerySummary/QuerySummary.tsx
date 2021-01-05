import React from "react";
// import TextField from "@material-ui/core/TextField";
// import Autocomplete from "@material-ui/lab/Autocomplete";
import { engine } from "../../engine";
import {
  QuerySummary,
  QuerySummaryState,
  buildQuerySummary
} from "@coveo/headless";
import "./QuerySummary.css";

export default class ReactQuerySummary extends React.Component {
  state!: QuerySummaryState;
  private headlessQuerySummary!: QuerySummary;

  constructor(props) {
    super(props);
    this.headlessQuerySummary = buildQuerySummary(engine);
    this.state = this.headlessQuerySummary.state;
  }

  componentDidMount() {
    this.headlessQuerySummary.subscribe(() => this.updateState());
  }

  private updateState() {
    this.setState(this.headlessQuerySummary.state);
  }

  render() {
    if (!this.state.hasResults) {
      return this.renderNoResults();
    }
    return this.renderHasResults();
  }

  private renderNoResults() {
    return (
      <span>
        No results{this.renderQuery()} {this.renderDuration()}
      </span>
    );
  }

  private renderHasResults() {
    return (
      <span>
        Results{this.renderRange()}
        {this.renderTotal()} search results {this.renderQuery()}
        {this.renderDuration()}
      </span>
    );
  }

  private renderQuery() {
    if (this.state.hasQuery) {
      return <span> for "{this.renderBold(this.state.query)}"</span>;
    }
    return "";
  }
  private renderBold(input: string) {
    return <span className="bold">{input}</span>;
  }
  private renderRange() {
    return this.renderBold(
      ` ${this.state.firstResult} - ${this.state.lastResult} of`
    );
  }
  private renderTotal() {
    return <span> {this.renderBold(this.state.total.toString())}</span>;
  }
  private renderDuration() {
    if (this.state.hasDuration) {
      return ` in ${this.state.durationInSeconds} seconds or in ${this.state.durationInMilliseconds} ms`;
    }
    return "";
  }
}
