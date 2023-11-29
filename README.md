![coverage](https://img.shields.io/badge/for-React-blue)
![coverage](https://img.shields.io/badge/version-1.0.0-yellow)
![coverage](https://img.shields.io/badge/coverage-100-green)

# React Custom Select Input

This package is part of a student project, translating an [original idea](https://css-tricks.com/striking-a-balance-between-native-and-custom-select-elements/) by [Sandrina Pereira](https://www.sandrina-p.net/).

This library aims to provide a select input which can be styled without sacrificing accessibility.
To achieve this, a custom element is superimposed on a native input.
When users interact with the component using assistive technologies, they face the native selecti. If they use a mouse, they will face the custom element.

My contribution lies in porting the code to a reusable React component as well as adding TypeScript support, and complete coverage of the component by integration tests (vitest).

## Setup

This is a controlled input component.

props :

- `inputsState` - A state in the form of an `object` containing all the inputs values;
- `inputState` - A `string` representing the state property which will be assigned;
- `setInputsState` - The state setter;
- `id` : `string`;
- `label` : `string`;
- `placeholder` : `string`;
- `options` - An array of objects representing the values and names of the proposed options : `{ value: string; labor: string; }`;
- `showValidation` - A `boolean` to know whenever the warning message should be displayed or not;
- `validationMsg` - A `string` representing the warning message.

```js
import { useState } from "react";
import Select from "caver-react-select";

import "caver-react-select/src/stylesheets/select.css";

function Example() {
  const [state, setState] = useState({ number: "" });
  const [showValidation, setShowValidation] = useState({ number: false });

  const validation = () => {
    if (state.number === "") setShowValidation((state) => ({ ...state, number: true }));
    else setShowValidation((state) => ({ ...state, number: false }));
  };

  const options = [
    { value: "1", labor: "One" },
    { value: "2", labor: "Two" },
    { value: "3", labor: "Three" },
    { value: "4", labor: "Four" },
    { value: "5", labor: "Five" },
    { value: "6", labor: "Six" },
  ];

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          validation();
        }}
      >
        <Select
          inputsState={state}
          inputState="number"
          setInputsState={setState}
          id="number"
          label="Select a number"
          placeholder="Choose"
          options={options}
          showValidation={showValidation.number}
          validationMsg="Please select a number."
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
```
