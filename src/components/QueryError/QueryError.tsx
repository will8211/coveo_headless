import React from "react";
import { engine } from "../../engine";
import { buildQueryError, QueryError, QueryErrorState } from "@coveo/headless";

export default class ReactQueryError extends React.Component {
  state!: QueryErrorState;
  private headlessQueryError!: QueryError;

  constructor(props: any) {
    super(props);
    this.headlessQueryError = buildQueryError(engine);
    this.state = this.headlessQueryError.state;
  }
  componentDidMount() {
    this.headlessQueryError.subscribe(() => this.updateState());
  }

  private updateState() {
    this.setState(this.headlessQueryError.state);
  }
  render() {
    if (this.state.hasError === false) {
      return (
        <div>
          <b>No Error in QueryError</b>
        </div>
      );
    } else {
      return (
        <div>
          ========================== <br />
          <b>Query Error Section</b> <br />
          Message: {this.state.error?.message} <br />
          Code: {this.state.error?.statusCode}
          <br />
          ==========================
        </div>
      );
    }
  }
}
