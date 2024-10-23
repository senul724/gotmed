"use client";

import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Field } from "formik";
import debounce from "lodash.debounce";
import { Cordinates } from "./MapView";

export default function PlaceSearch(
  props: {
    fieldName: string;
    setValue: (value: string) => void;
    setLocation: Dispatch<SetStateAction<Cordinates | null>>;
  },
) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const locationSuggestions = [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "San Antonio, TX",
    "San Diego, CA",
    "Dallas, TX",
    "San Jose, CA",
  ];

  const debouncedHandleInputChange = useCallback(
    debounce((value: string) => {
      if (value.length > 2) {
        const filteredSuggestions = locationSuggestions.filter((loc) =>
          loc.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    }, 300),
    [],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    props.setValue(value);
    if (!value) {
      return;
    }
    debouncedHandleInputChange(value);
    console.log(suggestions);
  };

  const handleSuggestionClick = (suggestion: string) => {
    props.setValue(suggestion);
    setSuggestions([]);
    // Set the selected suggestion as the input value (optional)
  };

  return (
    <div className="relative w-full">
      <Field
        name="location"
        type="text"
        placeholder={"enter place"}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleInputChange}
      />
      <ul className="absolute top-full left-0 z-10 w-full bg-white rounded-md shadow-md">
        {suggestions.map((suggestion, idx) => (
          <li
            key={suggestion + String(idx)}
            className="cursor-pointer px-3 py-2 hover:bg-gray-100"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
}
