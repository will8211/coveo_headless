import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { engine } from "../../engine";
import {
  buildSearchBox,
  SearchBoxState,
  SearchBox,
  SearchBoxOptions
} from "@coveo/headless";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

export default class ReactSearchBox extends React.Component {
  state!: SearchBoxState;

  private headlessSearchBox!: SearchBox;

  constructor(props: any) {
    super(props);
    const options: SearchBoxOptions = {
      numberOfSuggestions: 3,
      enableQuerySyntax: true
    };
    this.headlessSearchBox = buildSearchBox(engine, { options });
    this.state = this.headlessSearchBox.state;
  }

  componentDidMount() {
    this.headlessSearchBox.subscribe(() => this.updateState());
  }

  private updateState() {
    this.setState(this.headlessSearchBox.state);
  }
  private selectOnFocus(e: React.MouseEvent) {
    const value = (e.target as HTMLButtonElement).value;
    this.headlessSearchBox.selectSuggestion(value);
  }

  render() {
    return (
      <div>
        <Autocomplete
          inputValue={this.state.value}
          onInputChange={(event, newInputValue) => {
            this.headlessSearchBox.updateText(newInputValue);
          }}
          onClick={(e) => this.selectOnFocus(e)}
          onChange={() => {
            this.headlessSearchBox.submit();
          }}
          onFocus={() => {
            this.headlessSearchBox.showSuggestions();
          }}
          id="ReactSearchHeadless"
          freeSolo
          options={this.state.suggestions.map(
            (suggestion) => suggestion.rawValue
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search"
              label="freeSolo"
              margin="normal"
              variant="outlined"
            />
          )}
          // highlighting
          renderOption={(option, { inputValue }) => {
            const matches = match(option, inputValue);
            const parts = parse(option, matches);

            return (
              <div>
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{
                      fontWeight: part.highlight || !inputValue ? 400 : 600
                    }}
                  >
                    {part.text}
                  </span>
                ))}
              </div>
            );
          }}
        />
      </div>
    );
  }
}
