import { useRef } from "react";
import { SelectProps, Option, State, Setter } from "./this";

// This component is based on the following article :
// https://css-tricks.com/striking-a-balance-between-native-and-custom-select-elements/

export default function Select({ inputsState, inputState, setInputsState, showValidation, id, label, placeholder, options, validationMsg }: SelectProps<State, Setter>) {
  /*
    This is a controlled input component.

    props :
      *a state - object;
      *a string representing the state property which will be assigned;
      *a setter used to do the above;
      *a boolean to know whenever the warning message should be displayed or not;
      *an id;
      *a label;
      *a placeholder string;
      *an array of objects representing the values and names of the proposed options;
      *a string representing the warning message.
  */

  // The main div for the native select element.
  const elSelectNative = useRef<HTMLSelectElement>(null);

  /*
  The main div for the custom select
  (We set the reference to null because the jsx isn't executed yet.
  We must also specify the expected type.)
  */
  const elSelectCustom = useRef<HTMLDivElement>(null);
  // The custom placeholder div.
  const elSelectCustomBox = useRef<HTMLDivElement>(null);
  // The custom container for the options.
  const elSelectCustomOpts = useRef<HTMLDivElement>(null);
  // The custom options elements.
  const customOptsList = useRef<HTMLDivElement[]>([]);
  // The total number of options.
  const optionsCount = Array.from(customOptsList.current).length;

  const optionChecked = useRef<string>("");
  const optionHoveredIndex = useRef<number>(-1);

  function updateCustomSelectChecked(value: string, text: string) {
    const prevValue = optionChecked.current;

    const elPrevOption = findOption("data-value", prevValue);
    const elOption = findOption("data-value", value);

    if (elPrevOption) {
      elPrevOption.classList.remove("isActive");
    }

    if (elOption) {
      elOption.classList.add("isActive");
    }

    if (elSelectCustomBox && elSelectCustomBox.current) elSelectCustomBox.current.textContent = text;
    optionChecked.current = value;
  }

  function findOption(attrName: string, attrValue: string): HTMLDivElement | null {
    const option = customOptsList.current.find((el) => {
      const value = el.getAttribute(attrName);
      return value === attrValue;
    });

    return option || null;
  }

  function updateCustomSelectHovered(newIndex: number) {
    const prevOption = customOptsList.current[optionHoveredIndex.current];
    const option = customOptsList.current[newIndex];

    if (prevOption) {
      prevOption.classList.remove("isHover");
    }
    if (option) {
      option.classList.add("isHover");
    }

    optionHoveredIndex.current = newIndex;
  }

  function openSelectCustom() {
    elSelectCustom.current?.classList.add("isActive");
    // Remove aria-hidden in case this was opened by a user
    // who uses AT (e.g. Screen Reader) and a mouse at the same time.
    elSelectCustom.current?.setAttribute("aria-hidden", "false");

    if (optionChecked) {
      const optionCheckedIndex = customOptsList.current.findIndex((el) => el.getAttribute("data-value") === optionChecked.current);
      updateCustomSelectHovered(optionCheckedIndex);
    }

    // Add related event listeners
    document.addEventListener("click", watchClickOutside);
    document.addEventListener("keydown", supportKeyboardNavigation);
  }

  function closeSelectCustom() {
    elSelectCustom.current?.classList.remove("isActive");
    elSelectCustom.current?.setAttribute("aria-hidden", "true");
    updateCustomSelectHovered(-1);
    // Remove related event listeners
    document.removeEventListener("click", watchClickOutside);
    document.removeEventListener("keydown", supportKeyboardNavigation);
  }

  function watchClickOutside(e: Event) {
    const didClickedOutside = !elSelectCustom.current?.contains(e.target as Node);
    if (didClickedOutside) {
      closeSelectCustom();
    }
  }

  function supportKeyboardNavigation(e: KeyboardEvent) {
    // press down -> go next
    if (e.key === "ArrowDown" && optionHoveredIndex.current < optionsCount - 1) {
      e.preventDefault(); // prevent page scrolling
      updateCustomSelectHovered(optionHoveredIndex.current + 1);
    }

    // press up -> go previous
    if (e.key === "ArrowUp" && optionHoveredIndex.current > 0) {
      e.preventDefault(); // prevent page scrolling
      updateCustomSelectHovered(optionHoveredIndex.current - 1);
    }

    // press Enter or space -> select the option
    if (e.key === "Enter" || e.key === "Space") {
      e.preventDefault();

      const option = customOptsList.current[optionHoveredIndex.current];
      const value = option && option.getAttribute("data-value");

      if (elSelectNative && elSelectNative.current && value) {
        elSelectNative.current.value = value;
        updateCustomSelectChecked(value, option.textContent as string);
      }
      closeSelectCustom();
    }

    // press ESC -> close selectCustom
    if (e.key === "Escape") {
      closeSelectCustom();
    }
  }

  return (
    <>
      <span
        className="selectLabel"
        id={id}
      >
        {label}
      </span>
      <div className="selectWrapper">
        <select
          data-testid="native-select"
          ref={elSelectNative}
          className="selectNative js-selectNative"
          aria-labelledby={id}
          name={id}
          value={inputsState[inputState as keyof typeof inputsState]}
          onChange={(e) => {
            // Update state
            setInputsState({ ...inputsState, [inputState]: e.target.value });
            // Update selectCustom value when selectNative is changed.
            const value = e.target.value;
            const elRespectiveCustomOption = findOption("data-value", value);
            if (elRespectiveCustomOption) {
              updateCustomSelectChecked(value, elRespectiveCustomOption.textContent as string);
            }
          }}
        >
          <option value="">{placeholder}</option>
          {options.map((option: Option, index: number) => (
            <option
              key={index}
              value={option.value}
            >
              {option.labor}
            </option>
          ))}
        </select>

        {/* Hide the custom select from AT (e.g. SR) using aria-hidden */}
        <div
          ref={elSelectCustom}
          className="selectCustom js-selectCustom"
          aria-hidden="true"
        >
          <div
            ref={elSelectCustomBox}
            className="selectCustom-trigger"
            onClick={() => {
              const isClosed = !elSelectCustom.current?.classList.contains("isActive");

              if (isClosed) {
                openSelectCustom();
              } else {
                closeSelectCustom();
              }
            }}
          >
            {placeholder}
          </div>
          <div
            ref={elSelectCustomOpts}
            className="selectCustom-options"
          >
            {options.map((option: Option, index: number) => (
              <div
                ref={(element) => element && customOptsList.current.push(element)}
                className="selectCustom-option"
                key={index}
                data-value={option.value}
                onClick={() => {
                  if (elSelectCustomBox && elSelectCustomBox.current) {
                    // Update custom select text too
                    elSelectCustomBox.current.textContent = option.labor;
                  }
                  if (elSelectCustom && elSelectCustom.current) {
                    // Close select
                    elSelectCustom.current.classList.remove("isActive");
                  }

                  // Sync native select to have the same value
                  if (elSelectNative.current) elSelectNative.current.value = option.value;

                  // Update State
                  setInputsState({ ...inputsState, [inputState]: option.value });
                  // Update checked icon
                  updateCustomSelectChecked(option.value, option.labor);
                  closeSelectCustom();
                }}
              >
                {option.labor}
              </div>
            ))}
          </div>
        </div>
        {showValidation && <p className="native-select__invalid-msg invalid">{validationMsg}</p>}
      </div>
    </>
  );
}
