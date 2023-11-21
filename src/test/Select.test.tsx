/**
 * @vitest-environment jsdom
 */

import { beforeEach, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Select from "../Select";

beforeEach(() => {
  const state = { value: "" };

  const setState = (arg: string) => {
    state.value = arg;
  };

  const options = [
    { value: "1", labor: "Un" },
    { value: "2", labor: "Deux" },
  ];

  render(
    <Select
      inputsState={state}
      inputState="state"
      setInputsState={setState}
      id="number"
      label="Select a number"
      placeholder="Choose"
      options={options}
    />
  );
});

it("Should be rendered", () => {
  const label = screen.queryByText(/Select a number/i);
  expect(label).toBeInTheDocument();
});
