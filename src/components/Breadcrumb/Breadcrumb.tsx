import React from "react";
import { engine } from "../../engine";
import {
  Breadcrumb,
  BreadcrumbManager,
  BreadcrumbManagerState,
  buildBreadcrumbManager
} from "@coveo/headless";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { generateRandomString } from "../Facet/CategoryFacet";
import Button from "@material-ui/core/Button";

export enum FacetType {
  Facet = "facetBreadcrumbs",
  NumeroicFacet = "numericFacetBreadcrumbs",
  DateFacet = "dateFacetBreadcrumbs",
  CategoryFacet = "categoryFacetBreadcrumbs"
}
export default class ReactBreadcrumb extends React.Component {
  state!: BreadcrumbManagerState;
  private headlessBreadCrumb!: BreadcrumbManager;

  constructor(props: any) {
    super(props);
    this.headlessBreadCrumb = buildBreadcrumbManager(engine);
    this.state = this.headlessBreadCrumb.state;
  }
  componentDidMount() {
    this.headlessBreadCrumb.subscribe(() => this.updateState());
  }

  private updateState() {
    this.setState(this.headlessBreadCrumb.state);
  }

  private generateFacetBreadcrumbs(facetType: string) {
    let facetState: any;
    if (facetType === FacetType.Facet) {
      facetState = this.state.facetBreadcrumbs;
    } else if (facetType === FacetType.NumeroicFacet) {
      facetState = this.state.numericFacetBreadcrumbs;
    } else if (facetType === FacetType.DateFacet) {
      facetState = this.state.dateFacetBreadcrumbs;
    }
    return facetState.map((item: any) => {
      return (
        <div key={generateRandomString()}>
          <b>{item.field.toUpperCase()} </b>
          {this.buildListCheckboxBreadcrumb(facetType, item)}
        </div>
      );
    });
  }

  private buildListCheckboxBreadcrumb(facetType: string, items: any) {
    return items.values.map((item: any) => {
      let nodeIdRandom = `${item.value.value}${generateRandomString()}`;
      let labelItem;
      if (facetType === FacetType.Facet) {
        labelItem = item.value.value;
      } else if (
        facetType === FacetType.NumeroicFacet ||
        facetType === FacetType.DateFacet
      ) {
        labelItem = `${item.value.start} - ${item.value.end}`;
      }

      return (
        <FormControlLabel
          key={nodeIdRandom}
          control={
            <Checkbox
              key={nodeIdRandom}
              checked
              onClick={item.deselect}
              inputProps={{ "aria-label": "primary checkbox" }}
              name={labelItem}
              color="primary"
            />
          }
          label={labelItem}
        />
      );
    });
  }

  private generateCategoryFacetBreadcrumbs() {
    return this.state.categoryFacetBreadcrumbs.map((item: any) => {
      let nodeIdRandom = `${generateRandomString()}`;

      let labelItem = "";
      item.path.forEach((item: any) => {
        labelItem = `${labelItem}${item.value} > `;
      });
      labelItem = labelItem.slice(0, -2);

      return (
        <div key={generateRandomString()}>
          <b>{item.field.toUpperCase()} </b>
          <FormControlLabel
            key={nodeIdRandom}
            control={
              <Checkbox
                key={nodeIdRandom}
                checked
                onClick={item.deselect}
                inputProps={{ "aria-label": "primary checkbox" }}
                name={labelItem}
                color="primary"
              />
            }
            label={labelItem}
          />
        </div>
      );
    });
  }
  private desellectAll() {
    return (
      <div>
        <Button
          variant="contained"
          onClick={() => {
            this.headlessBreadCrumb.deselectAll();
          }}
        >
          Reset Breadcrumb
        </Button>
      </div>
    );
  }
  render() {
    const isBreadcrumbActivate =
      this.state.facetBreadcrumbs.length !== 0 ||
      this.state.categoryFacetBreadcrumbs.length !== 0 ||
      this.state.dateFacetBreadcrumbs.length !== 0 ||
      this.state.numericFacetBreadcrumbs.length !== 0;
    if (!isBreadcrumbActivate) {
      return (
        <div>
          <b>BreadCrumb Not Activated</b>
        </div>
      );
    } else {
      return (
        <div>
          <b>BREADCRUMB ACTIVATED</b>
          {this.desellectAll()}
          {this.generateFacetBreadcrumbs(FacetType.Facet)}
          {this.generateFacetBreadcrumbs(FacetType.NumeroicFacet)}
          {this.generateFacetBreadcrumbs(FacetType.DateFacet)}
          {this.generateCategoryFacetBreadcrumbs()}
        </div>
      );
    }
  }
}
