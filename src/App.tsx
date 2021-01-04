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
import ReactSort from "./components/Sort/Sort";
import ReactSortCheckbox from "./components/Sort/SortCheckbox";
import ReactPager from "./components/Pager/Pager";
import ReactResultPerPage from "./components/ResultPerPage/ResultPerPage";
import Pager2 from "./components/Pager/Pager2";
import ReactQuerySummary from "./components/QuerySummary/QuerySummary";
import AllNumericFacets from "./components/Facet/NumericFacet";
import AllCategoryFacet from "./components/Facet/CategoryFacet";
import ReactQueryError from "./components/QueryError/QueryError";
import ReactDidYouMean from "./components/DidYouMean/DidYouMean";
import ReactBreadCrumb from "./components/Breadcrumb/Breadcrumb";
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
          <ReactHistory />
        </div>
        <div className="row">
          <AllTabs />
        </div>
        <div className="row">
          <ReactSearchBox />
        </div>
        <div className="row">
          <ReactSort />
          <ReactSortCheckbox />
        </div>
        <div className="row">
          <ReactBreadCrumb />
        </div>

        <div className="row">
          <div className="columnFacet">
            <ReactFacetManager>
              <AllFacets />
              <AllCategoryFacet />
              <AllNumericFacets />
              <AllDateFacets />
            </ReactFacetManager>
          </div>
          <div className="columnResultList">
            <div className="pagerClass">
              <ReactPager />
            </div>
            <div className="resultPerPageClass">
              <ReactResultPerPage />
            </div>
            <div className="querySummaryClass">
              <ReactDidYouMean />
              <ReactQueryError />
              <ReactQuerySummary />
            </div>
            <div className="resultListClass">
              <ReactResultList />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
