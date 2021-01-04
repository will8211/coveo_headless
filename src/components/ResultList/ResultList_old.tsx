import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { engine } from "../../engine";
import {
  buildResultList,
  ResultList,
  ResultListState,
  FieldsActions
} from "@coveo/headless";
import { generateRandomString } from "../Facet/CategoryFacet";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

export default class ReactResultList extends React.Component {
  state!: ResultListState;
  private headlessResultList!: ResultList;

  constructor(props: any) {
    super(props);
    this.headlessResultList = buildResultList(engine);
    this.state = this.headlessResultList.state;
  }
  componentDidMount() {
    this.headlessResultList.subscribe(() => this.updateState());
  }

  private updateState() {
    this.setState(this.headlessResultList.state);
  }
  private convertDate(dateString: number) {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10);
    return date;
  }

  private results() {
    console.log(this.state.results);
    return this.state.results.map((result) => {
      let keyId = `${generateRandomString()}`;
      return (
        <Card key={keyId}>
          <CardContent className="list">
            <Typography
              variant="h5"
              component="h4"
              onClick={() => window.open(`${result.ClickUri}`, "_blank")}
            >
              {/* {result.title} _Date: {this.convertDate(result.raw.date)} */}
              {result.title}
            </Typography>
            <Typography variant="body2" component="p">
              {result.excerpt}
            </Typography>
          </CardContent>
        </Card>
      );
    });
  }

  render() {
    return (
      <div>
        {this.results()}
        <ButtonGroup
          color="primary"
          aria-label="outlined primary button group"
          key={generateRandomString()}
        >
          <Button
            key="FetchMoreResult"
            onClick={() => {
              this.headlessResultList.fetchMoreResults();
            }}
          >
            More Results
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}
