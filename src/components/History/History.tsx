import React from "react";
import { engine } from "../../engine";
import { buildHistory, HistoryState, History } from "@coveo/headless";
import { generateRandomString } from "../Facet/CategoryFacet";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";


export default class ReactHistory extends React.Component {
  state!: HistoryState;
  private headlessHistory!: History;
  constructor(props: any) {
    super(props);
    this.headlessHistory = buildHistory(engine);
    this.state = this.headlessHistory.state;
  }
  componentDidMount() {
    this.headlessHistory.subscribe(() => this.updateState());
  }

  private updateState() {
    this.setState(this.headlessHistory.state);
  }
  private goBack() {
    if (this.state.past.length === 0) {
      return null;
    } else {
      return (
        <ButtonGroup
          color="primary"
          aria-label="outlined primary button group"
          key={generateRandomString()}
        >
          <Button onClick={() => this.headlessHistory.back()}>BACK</Button>
        </ButtonGroup>
      );
    }
  }
  private goForward() {
    if (this.state.future.length === 0) {
      return null;
    } else {
      return (
        <ButtonGroup
          color="primary"
          aria-label="outlined primary button group"
          key={generateRandomString()}
        >
          <Button onClick={() => this.headlessHistory.forward()}>
            FORWARD
          </Button>
        </ButtonGroup>
      );
    }
  }
  render() {
    return (
      <div>
        <h2>History Management Section</h2>
        {this.goBack()}
        {this.goForward()}
      </div>
    );
  }
}
