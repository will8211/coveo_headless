import "./Tab.css";
import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { buildTab, Tab as TabCoveo, TabState, TabProps } from "@coveo/headless";
import { engine } from "../../engine";

interface ITabControlProps {
  tabExpression: string;
  label: string;
  defaultTab?: boolean;
}

class ReactTabs extends React.Component<ITabControlProps> {
  state!: TabState;
  private headlessTab!: TabCoveo;
  private defaultTab = false;

  constructor(props: any) {
    super(props);

    const initTab: TabProps = {
      options: { expression: props.tabExpression },
      initialState: { isActive: props.defaultTab }
    };
    this.headlessTab = buildTab(engine, initTab);
    this.state = this.headlessTab.state;
  }

  componentDidMount() {
    this.headlessTab.subscribe(() => this.updateState());
  }
  private updateState() {
    this.setState(this.headlessTab.state);
  }

  private handleChange(event: React.ChangeEvent<{}>) {
    this.headlessTab.select();
  }
  render() {
    return (
      <Tab
        value={this.props.label}
        label={this.props.label}
        className={this.state.isActive ? "activeTab" : ""}
        onFocus={(e) => {
          this.handleChange(e);
        }}
      />
    );
  }
}


export default class AllTabs extends React.Component {
  render() {
    return (
      <AppBar color="inherit" position="static" style={{ alignItems: 'center' }}>
        <Tabs indicatorColor="secondary" textColor="primary">
          <ReactTabs tabExpression="" label="All Content" defaultTab={true} />
          <ReactTabs tabExpression="@filetype==youtubevideo" label="Youtube" />
          <ReactTabs tabExpression="@sfid" label="Salesforce" />
        </Tabs>
      </AppBar>
    );
  }
}
