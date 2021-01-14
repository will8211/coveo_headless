import React from "react";
import "./App.css";
import { AnalyticsActions, SearchActions } from "@coveo/headless";
import { engine } from "./engine";
import AllTabs from "./components/Tab/Tab";
import ReactFacetManager from "./components/Facet/FacetManager";
import AllFacets from "./components/Facet/DynamicFacet";
import AllDateFacets from "./components/Facet/DateFacet";
import ReactSearchBox from "./components/SearchBox/SearchBox";
import ReactResultList from "./components/ResultList/ResultList";
import ReactSortCheckbox from "./components/Sort/SortCheckbox";
import ReactPager from "./components/Pager/Pager";
import ReactResultPerPage from "./components/ResultPerPage/ResultPerPage";
import ReactQuerySummary from "./components/QuerySummary/QuerySummary";
import AllNumericFacets from "./components/Facet/NumericFacet";
import AllCategoryFacet from "./components/Facet/CategoryFacet";
import ReactQueryError from "./components/QueryError/QueryError";
import ReactDidYouMean from "./components/DidYouMean/DidYouMean";
import ReactBreadCrumb from "./components/Breadcrumb/Breadcrumb";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import ReactHistory from "./components/History/History";



export default class App extends React.Component {
  componentDidMount() {
    const { dispatch } = engine;
    const action = SearchActions.executeSearch(
      AnalyticsActions.logInterfaceLoad()
    ) as any;
    dispatch(action);
  }

  render() {
    return (
      <React.Fragment>
        <div className="row">
          <AllTabs />
        </div>
        <Container>
          <Container maxWidth="md">
            <div className="row">
              <ReactSearchBox />
              <ReactDidYouMean />
            </div>
          </Container>

          <Grid container className="row">

            <Grid item xs={3} className="columnFacet">
              <ReactFacetManager>
                <AllFacets />
                <AllCategoryFacet />
                <AllNumericFacets />
              </ReactFacetManager>
            </Grid>

            <Grid item xs={9} className="columnResultList">
              <div className="row">
                <ReactBreadCrumb />
              </div>
              <Grid container justify="space-between" className="querySummaryClass">
                <Grid item>
                  <ReactQuerySummary />
                </Grid>
                <Grid item>
                  <ReactSortCheckbox />
                </Grid>
              </Grid>
              <div className="resultListClass">
                <ReactResultList />
              </div>
              <Grid container justify="space-between">
                <Grid item className="pagerClass">
                  <ReactPager />
                </Grid>
                <Grid item className="resultPerPageClass">
                  <ReactResultPerPage />
                </Grid>
              </Grid>
            </Grid>

          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}
