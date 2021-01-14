import "./ResultPerPage.css";
import React from "react";
import {
  ResultsPerPage,
  ResultsPerPageState,
  buildResultsPerPage,
  ResultsPerPageInitialState
} from "@coveo/headless";
import { engine } from "../../engine";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { generateRandomString } from "../Facet/CategoryFacet";

const defaultValue = [5, 25, 50, 100];

export default class ReactResultPerPage extends React.Component {
  state!: ResultsPerPageState;
  private headlessResultPerPage!: ResultsPerPage;

  constructor(props: any) {
    super(props);
    const initialState: ResultsPerPageInitialState = { numberOfResults: 5};
    this.headlessResultPerPage = buildResultsPerPage(engine, { initialState });
    this.state = this.headlessResultPerPage.state;
  }

  componentDidMount() {
    this.headlessResultPerPage.subscribe(() => this.updateState());
  }

  private updateState() {
    this.setState(this.headlessResultPerPage.state);
  }

  private buttons() {
    return defaultValue.map((num) => {
      const isSelected = this.headlessResultPerPage.isSetTo(num);
      const className = isSelected ? "active" : "";
      const keyId = `${num}${generateRandomString()}`;

        return (
          <ButtonGroup
            color="primary"
            aria-label="outlined primary button group"
            className={className}
            key={keyId}
          >
            <Button onClick={() => this.headlessResultPerPage.set(num)}>
              {num}
            </Button>
          </ButtonGroup>
        );
    });
  }

  render() {
    return ( 
    <div>
      Results per page: {this.buttons()}
    </div>
    )
  }
}
