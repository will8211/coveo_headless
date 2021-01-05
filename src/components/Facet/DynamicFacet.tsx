import React from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox /*, { CheckboxProps }*/ from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";

import {
  buildFacet,
  Facet,
  FacetOptions,
  FacetSortCriterion,
  FacetState,
  FacetValue
} from "@coveo/headless";
import { engine } from "../../engine";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { generateRandomString } from "./CategoryFacet";
export enum FacetSortOption {
  Automatic = "automatic",
  Occurrences = "occurrences",
  Score = "score",
  Alphanumeric = "alphanumeric"
}
interface ICheckboxControlProps {
  field: string;
  facetId: string;
  numberOfValues?: number;
  sortCriteria?: string;
}

class DynamicFacet extends React.Component<ICheckboxControlProps> {
  state!: FacetState;
  private headlessFacet!: Facet;

  constructor(props: any) {
    super(props);

    const options: FacetOptions = {
      field: props.field,
      facetId: props.facetId,
      numberOfValues: props.numberOfValues ? props.numberOfValues : 8,
      // delimitingCharacter: ";",
      // filterFacetCount: false,
      // injectionDepth: 5,
      sortCriteria: props.sortCriteria ? props.sortCriteria : "automatic",
      facetSearch: {
        // captions: "Search",
        numberOfValues: 5
      }
    };

    this.headlessFacet = buildFacet(engine, { options });
    this.state = this.headlessFacet.state;
  }

  componentDidMount() {
    this.headlessFacet.subscribe(() => this.updateState());
  }

  private updateState() {
    this.setState(this.headlessFacet.state);
  }

  private handleChange(e: any) {
    this.headlessFacet.toggleSelect(e);
  }
  private allFacetValues() {
    return this.state.values.map((listItem) => this.buildFacetValue(listItem));
  }

  private showMoreFacetButton() {
    if (this.state.canShowMoreValues) {
      return (
        <Button
          variant="contained"
          onClick={() => {
            this.headlessFacet.showMoreValues();
          }}
        >
          Show more Facets
        </Button>
      );
    } else {
      return null;
    }
  }

  private showLessFacetButton() {
    if (this.state.canShowLessValues) {
      return (
        <Button
          variant="contained"
          onClick={() => {
            this.headlessFacet.showLessValues();
          }}
        >
          Show Less Facets
        </Button>
      );
    } else {
      return null;
    }
  }

  private desellectAllFacet() {
    if (this.state.hasActiveValues) {
      return (
        <Button
          variant="contained"
          onClick={() => {
            this.headlessFacet.deselectAll();
          }}
        >
          Reset
        </Button>
      );
    } else {
      return null;
    }
  }
  private selectOnFocus(e: any) {
    // let value = (e.target as HTMLButtonElement).value;
    this.headlessFacet.facetSearch.select(e);
  }
  private facetSearchBox() {
    return (
      <Autocomplete
        id="facetSearch"
        freeSolo
        options={this.state.facetSearch.values.map(
          (suggestion: any) => suggestion.displayValue
        )}
        onInputChange={(event, newInputValue) => {
          this.headlessFacet.facetSearch.updateText(newInputValue);
        }}
        onChange={() => {
          this.headlessFacet.facetSearch.search();
        }}
        onClick={(e) => this.selectOnFocus(e)}
        onFocus={() => {
          this.headlessFacet.facetSearch.showMoreResults();
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Facet"
            margin="normal"
            variant="outlined"
          />
        )}
      />
    );
  }

  private buildFacetValue(item: FacetValue) {
    const isSelected = this.headlessFacet.isValueSelected(item);
    const facetValue = item.value;
    const finalLabel = `${facetValue}   (${item.numberOfResults} items)`;
    let nodeIdRandom = `${item.value}${generateRandomString()}`;
    return (
      <FormControlLabel
        key={nodeIdRandom}
        control={
          <Checkbox
            key={item.numberOfResults}
            checked={isSelected}
            onChange={() => this.handleChange(item)}
            inputProps={{ "aria-label": "primary checkbox" }}
            name={facetValue}
            color="primary"
          />
        }
        label={finalLabel}
      />
    );
  }

  private handleFacetSortChange(e: any) {
    const value = (e.target as HTMLButtonElement).value as FacetSortCriterion;
    this.headlessFacet.sortBy(value);
  }

  private facetSortDropdown() {
    return (
      <FormControl variant="filled">
        <InputLabel htmlFor="filled-age-native-simple">Facet Sort</InputLabel>
        <Select
          native
          onChange={(e) => {
            this.handleFacetSortChange(e);
          }}
        >
          <option aria-label="Sort dropdown" value="" />
          <option value={FacetSortOption.Automatic}>Automatic</option>
          <option value={FacetSortOption.Occurrences}>Occurrences</option>
          <option value={FacetSortOption.Score}>Score</option>
          <option value={FacetSortOption.Alphanumeric}>Alphanumeric</option>
        </Select>
      </FormControl>
    );
  }

  render() {
    return (
      <div>
        <h3>StandardFacet - {this.props.facetId}</h3>
        {this.facetSortDropdown()}
        {this.desellectAllFacet()}
        {this.facetSearchBox()}
        <FormGroup row> {this.allFacetValues()}</FormGroup>
        {this.showMoreFacetButton()}
        {this.showLessFacetButton()}
      </div>
    );
  }
}

export default class AllFacets extends React.Component {
  render() {
    return (
      <div>
        <DynamicFacet
          field="source"
          facetId="Source"
          sortCriteria="alphanumeric"
          numberOfValues={5}
        />
        <DynamicFacet
          field="language"
          facetId="Language"
          sortCriteria="alphanumeric"
        />
        <DynamicFacet field="filetype" facetId="FileType" />
        <DynamicFacet
          field="author"
          facetId="Author"
          sortCriteria="occurrences"
        />
      </div>
    );
  }
}
