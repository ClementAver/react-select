![coverage](https://img.shields.io/badge/for-React-blue)
![coverage](https://img.shields.io/badge/version-1.0.0-yellow)
![coverage](https://img.shields.io/badge/coverage-100-green)

# React Custom Select Input

This package is part of a student project, translating an original idea by Sandrina Pereira (https://css-tricks.com/striking-a-balance-between-native-and-custom-select-elements/).

This library aims to provide a select input which can be styled without sacrificing accessibility.
To achieve this, a custom element is superimposed on a native input.
When users interact with the component using assistive technologies, they face the native selecti. If they use a mouse, they will face the custom element.

My contribution lies in porting the code to a reusable React component as well as adding TypeScript support, and complete coverage of the component by integration tests (vitest).

## Setup

This is a controlled input component.

props :

- `inputsState` a state : `object`;
- `inputState` a `string` representing the state property which will be assigned;
- `setInputsState` a setter used to do the above;
- `id` : `string`;
- `label` : `string`;
- `placeholder` : `string`;
- `options` an array of objects representing the values and names of the proposed options : `{ value: string; labor: string; }`;
- `showValidation` a `boolean` to know whenever the warning message should be displayed or not;
- `validationMsg` a `string` representing the warning message.

```js
import React, { useState } from "react";
import Select from "react-select";

import "react-select/src/stylesheets/select.css";

const Example = () => {
  const [state, setState] = useState({ number: "" });
  const [showValidation, setShowValidation] = useState({ number: false });

  const options = [
    { value: "1", labor: "One" },
    { value: "2", labor: "Two" },
  ];

  return (
    <Select
      inputsState={state}
      inputState="number"
      setInputsState={setState}
      id="number"
      label="Select a number"
      placeholder="Choose"
      options={options}
      showValidation={showValidation.number}
      validationMsg="warning"
    />
  );
};
```
