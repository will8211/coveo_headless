import React from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {
  buildNumericFacet,
  buildNumericRange,
  NumericFacet,
  NumericFacetOptions,
  NumericFacetState
} from "@coveo/headless";
import { engine } from "../../engine";
import { generateRandomString } from "./CategoryFacet";

interface INumericFacetOption {
  facetId: string;
  field: string;
  generateAutomaticRanges: boolean;
}

class ReactNumericFacet extends React.Component<INumericFacetOption> {
  state!: NumericFacetState;
  private headlessNumericFacet!: NumericFacet;

  constructor(props: any) {
    super(props);
    const options: NumericFacetOptions = {
      field: props.field,
      facetId: props.facetId,
      numberOfValues: 4,
      generateAutomaticRanges: props.generateAutomaticRanges,
      currentValues: [
        buildNumericRange({
          start: 0,
          end: 1000
        }),
        buildNumericRange({
          start: 1001,
          end: 10000
        }),
        buildNumericRange({
          start: 10001,
          end: 10000
        })
      ]
    };
    this.headlessNumericFacet = buildNumericFacet(engine, { options });
    this.state = this.headlessNumericFacet.state;
  }

  componentDidMount() {
    this.headlessNumericFacet.subscribe(() => this.updateState());
  }

  private updateState() {
    this.setState(this.headlessNumericFacet.state);
  }
  private handleChange(e: any) {
    this.headlessNumericFacet.toggleSelect(e);
  }
  private allNumericFacetValues() {
    return this.state.values.map((item) => this.generatNumericRangeValue(item));
  }

  private generatNumericRangeValue(item: any) {
    const labelValue = `${item.start} - ${item.end}`;
    const isDateFacetLoaded = this.headlessNumericFacet.isValueSelected(item)
      ? "active"
      : "";
    const isSelected = this.headlessNumericFacet.isValueSelected(item);
    let nodeIdRandom = `${labelValue}${generateRandomString()}`;
    return (
      <FormControlLabel
        key={nodeIdRandom}
        control={
          <Checkbox
            className={isDateFacetLoaded}
            checked={isSelected}
            onChange={() => this.handleChange(item)}
            inputProps={{ "aria-label": "primary checkbox" }}
            color="primary"
            name="date"
          />
        }
        label={labelValue}
      />
    );
  }

  render() {
    return (
      <div>
        <h3>{this.props.facetId}</h3>
        <FormGroup row> {this.allNumericFacetValues()}</FormGroup>
      </div>
    );
  }
}

export default class AllNumericFacets extends React.Component {
  render() {
    return (
      <div>
        <ReactNumericFacet
          field="ytviewcount"
          facetId="YouTube_View_Count"
          generateAutomaticRanges={false}
        />
      </div>
    );
  }
}
