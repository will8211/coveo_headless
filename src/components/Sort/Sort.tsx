import "./Sort.css";
import React from "react";
import { engine } from "../../engine";
import {
  Sort,
  SortState,
  SortInitialState,
  buildRelevanceSortCriterion,
  buildDateSortCriterion,
  buildFieldSortCriterion,
  buildSort,
  SortOrder,
  buildQueryRankingExpressionSortCriterion,
  buildNoSortCriterion
} from "@coveo/headless";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";

export enum SortOption {
  Relevance = "relevance",
  Newest = "newest",
  Oldest = "oldest",
  Size = "size",
  Date = "date",
  QRE = "QRE",
  NoSort = "nosort"
}

export function generateSortCriterion(val: any) {
  switch (val) {
    case SortOption.Relevance:
      return buildRelevanceSortCriterion();

    case SortOption.Newest:
      return buildDateSortCriterion(SortOrder.Descending);

    case SortOption.Oldest:
      return buildDateSortCriterion(SortOrder.Ascending);

    case SortOption.Size:
      return buildFieldSortCriterion("size", SortOrder.Descending);

    case SortOption.Date:
      return buildFieldSortCriterion("date", SortOrder.Ascending);

    case SortOption.QRE:
      return buildQueryRankingExpressionSortCriterion();

    case SortOption.NoSort:
      return buildNoSortCriterion();

    default:
      return buildRelevanceSortCriterion();
  }
}

export default class ReactSort extends React.Component {
  state!: SortState;
  private headlessSort!: Sort;

  constructor(props) {
    super(props);
    const initialState: SortInitialState = {
      criterion: generateSortCriterion(SortOption.Relevance)
    };
    this.headlessSort = buildSort(engine, { initialState });
    this.state = this.headlessSort.state;
  }
  componentDidMount() {
    this.headlessSort.subscribe(() => this.updateState());
  }

  private updateState() {
    this.setState(this.headlessSort.state);
  }

  private handleChange(e: any) {
    const value = (e.target as HTMLButtonElement).value;
    this.headlessSort.sortBy(generateSortCriterion(value));
  }

  render() {
    return (
      <FormControl variant="filled">
        <InputLabel htmlFor="filled-age-native-simple">Sort</InputLabel>
        <Select
          native
          onChange={(e) => {
            this.handleChange(e);
          }}
        >
          <option aria-label="Sort dropdown" value="" />
          <option value={SortOption.Relevance}>Relevance</option>
          <option value={SortOption.Newest}>Newest</option>
          <option value={SortOption.Oldest}>Oldest</option>
          <option value={SortOption.Size}>Size</option>
        </Select>
      </FormControl>
    );
  }
}
