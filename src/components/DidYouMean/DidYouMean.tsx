import React from "react";
import { engine } from "../../engine";
import { buildDidYouMean, DidYouMean, DidYouMeanState } from "@coveo/headless";

export default class ReadtDidYouMean extends React.Component {
  state!: DidYouMeanState;
  private headlessDidYouMean!: DidYouMean;

  constructor(props: any) {
    super(props);
    this.headlessDidYouMean = buildDidYouMean(engine);
    this.state = this.headlessDidYouMean.state;
  }

  componentDidMount() {
    this.headlessDidYouMean.subscribe(() => this.updateState());
  }

  private updateState() {
    this.setState(this.headlessDidYouMean.state);
  }

  private renderQueryCorrectionTrue() {
    return (
      <div>
        Text was corrected to: <b>{this.state.wasCorrectedTo}</b>
      </div>
    );
  }

  render() {
    if (this.state.hasQueryCorrection === false) {
      return (null);
    } else {
      return <div>{this.renderQueryCorrectionTrue()}</div>;
    }
  }
}
