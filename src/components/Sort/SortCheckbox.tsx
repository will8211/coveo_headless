import "./Sort.css";
import React /*, { SyntheticEvent } */ from "react";
import { engine } from "../../engine";
import { 
  Sort, 
  SortState, 
  // SortInitialState, 
  buildSort 
} from "@coveo/headless";
import FormControl from "@material-ui/core/FormControl";
import { generateSortCriterion, SortOption } from "./Sort";

import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Radio /*, { RadioProps } */ from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";

const useStyles = makeStyles({
  root: {
    "&:hover": {
      backgroundColor: "transparent"
    }
  },
  icon: {
    borderRadius: "50%",
    width: 16,
    height: 16,
    boxShadow:
      "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
    backgroundColor: "#f5f8fa",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
    "$root.Mui-focusVisible &": {
      outline: "2px auto rgba(19,124,189,.6)",
      outlineOffset: 2
    },
    "input:hover ~ &": {
      backgroundColor: "#ebf1f5"
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background: "rgba(206,217,224,.5)"
    }
  },
  checkedIcon: {
    backgroundColor: "#137cbd",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
    "&:before": {
      display: "block",
      width: 16,
      height: 16,
      backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
      content: '""'
    },
    "input:hover ~ &": {
      backgroundColor: "#106ba3"
    }
  }
});

function StyledRadio(props) {
  const classes = useStyles();

  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
}

export default class ReactSortCheckbox extends React.Component {
  state!: SortState;
  private headlessSort!: Sort;

  constructor(props) {
    super(props);
    // const initialState: SortInitialState = {
    //   criterion: generateSortCriterion(SortOption.Relevance)
    // };
    this.headlessSort = buildSort(engine, {});
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
  private defaultValue() {
    const stateDefault = this.state.sortCriteria;
    if (stateDefault === "relevancy") {
      return SortOption.Relevance;
    }
    if (stateDefault === "date ascending") {
      return SortOption.Oldest;
    }
  }
  render() {
    this.defaultValue();
    return (
      <FormControl component="fieldset"  className="sortCheckBoxPadding">
        <FormLabel component="legend" className="sortLabel">Sort</FormLabel>

        <RadioGroup
          row
          defaultValue={this.defaultValue()}
          aria-label="Sort"
          name="customized-radios"
          onChange={(val) => this.handleChange(val)}
        >
          <FormControlLabel
            value={SortOption.Relevance}
            control={<StyledRadio />}
            label="Relevance"
          />
          <FormControlLabel
            value={SortOption.Newest}
            control={<StyledRadio />}
            label="Newest"
          />
          <FormControlLabel
            value={SortOption.Oldest}
            control={<StyledRadio />}
            label="Oldest"
          />
        </RadioGroup>
      </FormControl>
    );
  }
}
