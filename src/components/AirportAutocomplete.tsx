import * as React from 'react';
import {
  Autocomplete,
  Box,
  Grid,
  TextField,
  Typography,
}from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import parse from "autosuggest-highlight/parse";
import { useDebouncedCallback } from 'use-debounce';

import airports from '../airports.json';

import type { PlaceType } from '../types';

type Props = {
  value: PlaceType | null;
  setValue: (value: PlaceType | null) => void;
  placeholder?: string;
}
export function AirportAutocomplete({ value, setValue, placeholder }: Props) {
  const [inputValue, setInputValue] = React.useState<string>('');
  const [options, setOptions] = React.useState<readonly PlaceType[]>([]);
  
  const debounced = useDebouncedCallback(
    (value) => {
      setInputValue(value);
    },
    500
  );

  React.useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    if (active) {
      let newOptions: readonly PlaceType[] = [];

      if (value) {
        newOptions = [value];
      }

      const inValue = inputValue.toUpperCase();
      const results = airports.filter((data: PlaceType) =>
        data.LocationID.includes(inValue) || data.FacilityName.includes(inValue)
      );
      if (results) {
        newOptions = [...newOptions, ...results];
      }

      setOptions(newOptions);
    }

    return () => {
      active = false;
    };
  }, [value, inputValue]);

  return (
    <Autocomplete
      sx={{ minWidth: 300 }}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : `${option.FacilityName} (${option.LocationID})`
      }
      filterOptions={(x) => x}
      noOptionsText="Type Airport Name or Code"
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      onChange={(_: any, newValue: PlaceType | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
      }}
      onInputChange={(_, newInputValue) => {
        if (newInputValue.length > 1) debounced(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label={placeholder || "Add a location"} fullWidth />
      )}
      renderOption={(props, option) => {
        const text = `${option.FacilityName} (${option.LocationID})`;
        const matches: [number, number][] = [];
        let i = 0;
        while (~(i = text.toUpperCase().indexOf(inputValue.toUpperCase(), i))) {
          matches.push([i, i += inputValue.length]);
        }
        const parts = parse(text, matches);

        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item>
                <Box
                  component={LocationOnIcon}
                  sx={{ color: 'text.secondary', mr: 2 }}
                />
              </Grid>
              <Grid item xs>
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{
                      fontWeight: part.highlight ? 700 : 400
                    }}
                  >
                    {part.text}
                  </span>
                ))} <br />
                <Typography variant="body2" color="text.secondary">
                  {option.County}, {option.City}, {option.State}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}
