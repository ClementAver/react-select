/**
 * @vitest-environment jsdom
 */

import { beforeEach, expect, it, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useState } from "react";

import Select from "../Select";

beforeEach(() => {
  function App() {
    const [state, setState] = useState({ number: "" });

    return (
      <Select
        inputsState={state}
        inputState="number"
        setInputsState={setState}
        id="number"
        label="Select a number"
        placeholder="Choose"
        options={options}
      />
    );
  }

  const options = [
    { value: "1", labor: "Un" },
    { value: "2", labor: "Deux" },
  ];

  render(<App />);
});

it("Should be rendered.", () => {
  const label = screen.queryByText(/Select a number/i);
  expect(label).toBeInTheDocument();
});

describe("Given I am an user.", () => {
  describe("When I click on the custom select.", () => {
    test("Then the dropdown opens.", async () => {
      const selectCustomTrigger = document.getElementsByClassName("selectCustom-trigger")[0] as HTMLDivElement;
      await userEvent.click(selectCustomTrigger);

      const selectCustom = document.getElementsByClassName("selectCustom")[0] as HTMLDivElement;
      expect(selectCustom.classList.contains("isActive")).toBeTruthy();
    });

    test("Then no option is showcased (gray background) or designated ('✓').", async () => {
      const selectCustomTrigger = document.getElementsByClassName("selectCustom-trigger")[0] as HTMLDivElement;
      await userEvent.click(selectCustomTrigger);
      const selectCustomOptions = document.getElementsByClassName("selectCustom-option");

      for (let option of selectCustomOptions) {
        expect(option.classList.contains("isHover")).not.toBeTruthy();
      }

      for (let option of selectCustomOptions) {
        expect(option.classList.contains("isActive")).not.toBeTruthy();
      }
    });

    describe("When I click a second time on the custom select.", () => {
      test("Then the dropdown is closed.", async () => {
        const selectCustomTrigger = document.getElementsByClassName("selectCustom-trigger")[0] as HTMLDivElement;
        await userEvent.click(selectCustomTrigger);
        await userEvent.click(selectCustomTrigger);

        const selectCustom = document.getElementsByClassName("selectCustom")[0] as HTMLDivElement;
        expect(selectCustom.classList.contains("isActive")).not.toBeTruthy();
      });
    });
  });

  describe("When I select an option using the custom select.", () => {
    test("Then the component is updated.", async () => {
      const selectCustomOptions = document.getElementsByClassName("selectCustom-option");
      const un = selectCustomOptions[0];
      await userEvent.click(un);

      // Is the select input value updated ?
      const selectNative = document.getElementsByClassName("selectNative")[0] as HTMLSelectElement;
      expect(selectNative.value).toBe("1");

      // Is the custom select div textContent updated ?
      const selectCustomTrigger = document.getElementsByClassName("selectCustom-trigger")[0] as HTMLDivElement;
      expect(selectCustomTrigger.textContent).toBe("Un");
    });

    describe("When I click on the custom select.", () => {
      test("Then one option is showcased (gray background) and designated ('✓').", async () => {
        const selectCustomOptions = document.getElementsByClassName("selectCustom-option");
        const un = selectCustomOptions[0];
        await userEvent.click(un);

        const selectCustomTrigger = document.getElementsByClassName("selectCustom-trigger")[0] as HTMLDivElement;
        await userEvent.click(selectCustomTrigger);

        let isHover = 0;
        let isActive = 0;
        for (let option of selectCustomOptions) {
          if (option.classList.contains("isHover")) isHover++;
          if (option.classList.contains("isActive")) isActive++;
        }

        expect(isHover).toBe(1);
        expect(isActive).toBe(1);
      });
    });

    describe("When I select another option.", () => {
      test("Then the first option is no longer designated ('✓').", async () => {
        const selectCustomOptions = document.getElementsByClassName("selectCustom-option");
        const un = selectCustomOptions[0];
        const deux = selectCustomOptions[1];

        await userEvent.click(un);
        await userEvent.click(deux);

        expect(un.classList.contains("isActive")).not.toBeTruthy();
      });
    });
  });

  // describe("When I target the native input using tabulation.", () => {
  //   describe("When I select the first option using 'ArrowDown' key.", () => {
  //     test("Then the first option should be assigned as the native input value.", async () => {
  //       // Focuses on input
  //       await userEvent.tab();

  //       //!\ The following does not works.
  //       await userEvent.keyboard("{arrowdown}");

  //       const selectCustomTrigger = document.getElementsByClassName("selectCustom-trigger")[0] as HTMLDivElement;
  //       expect(selectCustomTrigger.textContent).toBe("Un");
  //     });
  //   });
  // });

  describe("When I select the first option of the native select.", () => {
    test("Then this option is assigned to the custom select.", async () => {
      const selectNative = screen.getByTestId("native-select") as HTMLSelectElement;
      await userEvent.selectOptions(selectNative, ["Un"]);

      const selectCustomTrigger = document.getElementsByClassName("selectCustom-trigger")[0] as HTMLDivElement;
      expect(selectCustomTrigger.textContent).toBe("Un");
    });
  });
});
