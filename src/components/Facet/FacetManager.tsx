import React from "react";
import { engine } from "../../engine";
import {
  buildFacetManager,
  FacetManager,
  FacetManagerState
} from "@coveo/headless";

export default class ReactFacetManager extends React.Component {
  state!: FacetManagerState;
  host!: HTMLDivElement;
  private headlessFacetManager!: FacetManager;
  constructor(props: any) {
    super(props);
    this.headlessFacetManager = buildFacetManager(engine);
    this.state = this.headlessFacetManager.state;
  }

  componentDidMount() {
    this.headlessFacetManager.subscribe(() => this.updateState());
  }

  private updateState() {
    this.setState(this.headlessFacetManager.state);
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}
