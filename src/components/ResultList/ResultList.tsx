import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { engine } from "../../engine";
import {
  buildResultList,
  ResultList,
  ResultListState,
  ResultAnalyticsActions,
  ResultTemplatesHelpers,
  ResultTemplatesManager,
  Result,
  buildResultTemplatesManager
} from "@coveo/headless";
import { generateRandomString } from "../Facet/CategoryFacet";

export default class ReactResultList extends React.Component {
  state!: ResultListState;
  private headlessResultList!: ResultList;
  private headlessResultListManager!: ResultTemplatesManager<
    (result: Result) => React.ReactNode
  >;

  constructor(props: any) {
    super(props);
    const options = { fieldsToInclude: ["@date", "filetype", "author"] };

    this.headlessResultList = buildResultList(engine, { options });
    this.state = this.headlessResultList.state;
    this.headlessResultListManager = buildResultTemplatesManager(engine);

    this.headlessResultListManager.registerTemplates({
      conditions: [],
      priority: 1,
      content: (result) => (
        <Card key={generateRandomString()}>
          <CardContent className="list">
            <Typography
              variant="h5"
              component="h4"
              onClick={() => {
                engine.dispatch(ResultAnalyticsActions.logDocumentOpen(result));
                window.open(`${result.ClickUri}`, "_blank");
              }}
            >
              {result.title} _ Date: {this.convertDate(result.raw.date)}
            </Typography>
            <Typography variant="body2" component="p">
              {result.excerpt}
            </Typography>
          </CardContent>
        </Card>
      )
    });
    this.headlessResultListManager.registerTemplates({
      conditions: [ResultTemplatesHelpers.fieldMustMatch("filetype", ["pdf"])],
      priority: 2,
      content: (result) => (
        <Card key={generateRandomString()}>
          <CardContent className="list">
            <Typography
              variant="h5"
              component="h4"
              onClick={() => window.open(`${result.ClickUri}`, "_blank")}
            >
              {result.title} _ Another Template
            </Typography>
          </CardContent>
        </Card>
      )
    });
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
  }

  private conditionCustom(result: any) {}
  private results() {
    return (
      <div>
        {this.state.results.map((result) => {
          console.log(result);
          const template = this.headlessResultListManager.selectTemplate(
            result
          );
          return template ? template(result) : null;
        })}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.results()}
      </div>
    );
  }
}
