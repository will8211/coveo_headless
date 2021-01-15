import React from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {
  buildDateFacet,
  buildDateRange,
  DateFacet,
  DateFacetOptions,
  DateFacetState,
} from "@coveo/headless";
import { engine } from "../../engine";

interface IDateRange {
  facetId: string;
  field: string;
  generateAutomaticRanges: boolean;
}

class ReactDateFacet extends React.Component<IDateRange> {
  state!: DateFacetState;
  private headlessDateRange!: DateFacet;

  constructor(props: any) {
    super(props);
    const options: DateFacetOptions = {
      field: props.field,
      facetId: props.facetId,
      generateAutomaticRanges: props.generateAutomaticRanges,
      currentValues: [
        buildDateRange({
          start: "2006/01/01",
          end: "2009/01/01"
          // endInclusive: false,
        }),
        buildDateRange({
          start: "2009/01/01",
          end: "2019/01/01"
          // endInclusive: false,
        })
      ]
    };
    this.headlessDateRange = buildDateFacet(engine, { options });
    this.state = this.headlessDateRange.state;
  }

  componentDidMount() {
    this.headlessDateRange.subscribe(() => this.updateState());
  }

  private updateState() {
    this.setState(this.headlessDateRange.state);
  }
  private handleChange(e: any) {
    this.headlessDateRange.toggleSelect(e);
  }
  private allDateFacetValues() {
    return this.state.values.map((item) => this.generateDateRangeValue(item));
  }

  private generateDateRangeValue(item: any) {
    const labelValue = `${item.start} - ${item.end}`;
    const isDateFacetLoaded = this.headlessDateRange.isValueSelected(item)
      ? "active"
      : "";
    const isSelected = this.headlessDateRange.isValueSelected(item);
    let nodeIdRandom = `${item.start}${Math.floor(Math.random()).toString()}`;
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
        <h3>DateFacet - {this.props.facetId}</h3>
        <FormGroup row> {this.allDateFacetValues()}</FormGroup>
      </div>
    );
  }
}

export default class AllDateFacets extends React.Component {
  render() {
    return (
      <div>
        <ReactDateFacet
          field="date"
          facetId="Date"
          generateAutomaticRanges={true}
        />
        <ReactDateFacet
          field="indexeddate"
          facetId="IndexedDate"
          generateAutomaticRanges={false}
        />
      </div>
    );
  }
}
