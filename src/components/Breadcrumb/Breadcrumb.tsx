import React from "react";
import { engine } from "../../engine";
import {
  BreadcrumbManager,
  BreadcrumbManagerState,
  buildBreadcrumbManager
} from "@coveo/headless";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { generateRandomString } from "../Facet/CategoryFacet";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from '@material-ui/core/Grid';

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
          <b>{this.capitalise(item.field)} </b>
          {this.buildListCheckboxBreadcrumb(facetType, item)}
        </div>
      );
    });
  }
  private capitalise(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
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
          <b>{item.field.toLowerCase()} </b>
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
        <Link
          onClick={() => {
            this.headlessBreadCrumb.deselectAll();
          }}
        >
          Clear all filters
        </Link>
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
      return (null);
    } else {
      return (
        <div>
          <Grid container justify="space-between">
            <Grid item>
              {this.generateFacetBreadcrumbs(FacetType.Facet)}
              {this.generateFacetBreadcrumbs(FacetType.NumeroicFacet)}
              {this.generateFacetBreadcrumbs(FacetType.DateFacet)}
              {this.generateCategoryFacetBreadcrumbs()}
            </Grid>
            <Grid item>
              {this.desellectAll()}
            </Grid>
          </Grid>
          <hr />
        </div>

      );
    }
  }
}
