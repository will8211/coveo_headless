import React from "react";
import {
  buildCategoryFacet,
  CategoryFacet,
  CategoryFacetOptions,
  CategoryFacetState
} from "@coveo/headless";
import { engine } from "../../engine";
// import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

// const useStyles = makeStyles({
//   root: {
//     height: 240,
//     flexGrow: 1,
//     maxWidth: 400
//   }
// });

export function generateRandomString() {
  const randomNumber = Math.random().toString();
  return `${randomNumber}${randomNumber}`;
}

class CategoryFacetHeadless extends React.Component {
  state!: CategoryFacetState;
  private headlessCategoryFacet!: CategoryFacet;
  constructor(props: any) {
    super(props);
    const options: CategoryFacetOptions = {
      field: "geographicalhierarchy",
      delimitingCharacter: ";",
      numberOfValues: 3,
      facetSearch: {
        numberOfValues: 3
      },
      basePath: ["North America"],
      filterByBasePath: false
    };
    this.headlessCategoryFacet = buildCategoryFacet(engine, { options });
    this.state = this.headlessCategoryFacet.state;
  }
  componentDidMount() {
    this.headlessCategoryFacet.subscribe(() => this.updateState());
  }

  private updateState() {
    this.setState(this.headlessCategoryFacet.state);
  }

  private generateCF() {
    if (this.state.parents.length === 0) {
      return this.generateMultipChild(this.state.values);
    } else if (this.state.parents.length === 1) {
      return this.generateParentL1();
    } else if (this.state.parents.length === 2) {
      return this.generateParentL2();
    } else if (this.state.parents.length === 3) {
      return this.generateParentL3();
    }
  }
  private reset() {
    if (this.state.hasActiveValues === true) {
      return (
        <Button
          variant="contained"
          onClick={() => this.headlessCategoryFacet.deselectAll()}
        >
          Reset
        </Button>
      );
    } else {
      return null;
    }
  }

  private goToParentLevel(buttonText: string, item?: any) {
    return (
      <Button
        variant="contained"
        onClick={() => this.onSelectFacetCategory(item)}
      >
        {buttonText}
      </Button>
    );
  }
  private showMoreFacetButton() {
    if (this.state.canShowMoreValues) {
      return (
        <Button
          variant="contained"
          onClick={() => {
            this.headlessCategoryFacet.showMoreValues();
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
            this.headlessCategoryFacet.showLessValues();
          }}
        >
          Show Less Facets
        </Button>
      );
    } else {
      return null;
    }
  }
  private generateParentL1() {
    const lvl1Parent = `${this.state.parents[0].value}  (${this.state.parents[0].numberOfResults})`;
    const keyP1 = `${generateRandomString()}`;
    return (
      <div>
        <TreeItem key={keyP1} nodeId={keyP1} label={lvl1Parent}>
          {this.generateMultipChild(this.state.values)}
        </TreeItem>
        {this.showMoreFacetButton()}
        {this.showLessFacetButton()}
      </div>
    );
  }

  private generateParentL2() {
    const lvl1Parent = `${this.state.parents[0].value}  (${this.state.parents[0].numberOfResults})`;
    const keyP1 = `${generateRandomString()}`;
    const lvl2Parent = `${this.state.parents[1].value}  (${this.state.parents[1].numberOfResults})`;
    const keyP2 = `${generateRandomString()}`;
    return (
      <div>
        {this.goToParentLevel(`Back ${lvl1Parent}`, this.state.parents[0])}
        <TreeItem key={keyP1} nodeId={keyP1} label={lvl1Parent}>
          <TreeItem key={keyP2} nodeId={keyP2} label={lvl2Parent}>
            {this.generateMultipChild(this.state.values)}
          </TreeItem>
        </TreeItem>
        {this.showMoreFacetButton()}
        {this.showLessFacetButton()}
      </div>
    );
  }

  private generateParentL3() {
    const lvl1Parent = `${this.state.parents[0].value}  (${this.state.parents[0].numberOfResults})`;
    const keyP1 = `${lvl1Parent}${generateRandomString()}`;
    const lvl2Parent = `${this.state.parents[1].value}  (${this.state.parents[1].numberOfResults})`;
    const keyP2 = `${lvl1Parent}${generateRandomString()}`;
    const lvl3Parent = `${this.state.parents[2].value}  (${this.state.parents[2].numberOfResults})`;
    const keyP3 = `${lvl1Parent}${generateRandomString()}`;
    return (
      <div>
        {this.goToParentLevel(`Back ${lvl1Parent}`, this.state.parents[0])}
        {this.goToParentLevel(`Back ${lvl2Parent}`, this.state.parents[1])}
        <TreeItem
          key={keyP1}
          nodeId={generateRandomString()}
          label={lvl1Parent}
        >
          <TreeItem
            key={keyP2}
            nodeId={generateRandomString()}
            label={lvl2Parent}
          >
            <TreeItem
              key={keyP3}
              nodeId={generateRandomString()}
              label={lvl3Parent}
            >
              {this.generateMultipChild(this.state.values)}
            </TreeItem>
          </TreeItem>
        </TreeItem>
        {this.showMoreFacetButton()}
        {this.showLessFacetButton()}
      </div>
    );
  }
  private generateMultipChild(itemArray: any) {
    return itemArray.map((item: any) => this.generateChildLevel(item));
  }

  private generateChildLevel(item: any) {
    const uniqueID = `${item.value}${generateRandomString()}`;
    const childLabel = `${item.value}  (${item.numberOfResults})`;
    if (item.isLeafValue === true) {
      return (
        <TreeItem
          key={uniqueID}
          nodeId={uniqueID}
          label={childLabel}
        ></TreeItem>
      );
    } else {
      return (
        <TreeItem
          key={uniqueID}
          nodeId={uniqueID}
          label={childLabel}
          onClick={() => this.onSelectFacetCategory(item)}
        ></TreeItem>
      );
    }
  }

  private onSelectFacetCategory(e: any) {
    this.headlessCategoryFacet.toggleSelect(e);
  }
  private selectOnFocus(e: React.MouseEvent) {
    // const value = (e.target as HTMLButtonElement).value;
    // this.headlessCategoryFacet.facetSearch.select(value);
  }

  private facetCateporySearchBox() {
    return (
      <Autocomplete
        id="CategorySearch"
        freeSolo
        options={this.headlessCategoryFacet.state.facetSearch.values.map(
          (suggestion: any) => suggestion.displayValue
        )}
        onInputChange={(event, newInputValue) => {
          this.headlessCategoryFacet.facetSearch.updateText(newInputValue);
        }}
        onChange={() => {
          this.headlessCategoryFacet.facetSearch.search();
        }}
        onClick={(e) => this.selectOnFocus(e)}
        onFocus={() => {
          this.headlessCategoryFacet.facetSearch.showMoreResults();
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

  render() {
    return (
      <div>
        {this.facetCateporySearchBox()}
        {this.reset()}
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {this.generateCF()}
        </TreeView>
      </div>
    );
  }
}

export default class AllCategoryFacet extends React.Component {
  render() {
    return (
      <div>
        <h3>CategoryFacet</h3>
        <CategoryFacetHeadless />
      </div>
    );
  }
}
