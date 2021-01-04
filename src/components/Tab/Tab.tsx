import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { buildTab, Tab as TabCoveo, TabState, TabProps } from "@coveo/headless";
import { engine } from "../../engine";
import { makeStyles, createStyles } from "@material-ui/core/styles";

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
        className={this.state.isActive ? "active" : ""}
        onFocus={(e) => {
          this.handleChange(e);
        }}
      />
    );
  }
}
const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});
function StyledPaper(props: any) {
  const classes = useStyles();
  return <Paper className={classes.root} {...props}></Paper>;
}

export default class AllTabs extends React.Component {
  render() {
    return (
      <StyledPaper square>
        <Tabs indicatorColor="primary" textColor="primary">
          <ReactTabs tabExpression="" label="All" defaultTab={true} />
          <ReactTabs tabExpression="@filetype==pdf" label="PDF" />
          <ReactTabs tabExpression="@filetype==txt" label="Txt" />
          <ReactTabs tabExpression="@filetype==noresult" label="NoResult" />
        </Tabs>
      </StyledPaper>
    );
  }
}
