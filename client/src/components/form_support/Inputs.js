/* ----------- 
FORM HELPER COMPONENTS (inputs)
----------- */

// Dependencies
import React from "react";
import { Form } from "react-bootstrap";

// reusable input component
export const TextAndNumberInput = ({
    type,
    title,
    maxLength,
    register,
    label,
    required,
    placeholder,
    minLength,
    pattern,
    validate,
    step,
    onInput,
    onBlur,
    disabled,
}) => {
    return (
        <Form.Group controlId={title} className="form-group-div">
            <Form.Label>{title}</Form.Label>
            <Form.Control
                type={type}
                step={step}
                maxLength={maxLength}
                {...register(label, {
                    required,
                    pattern,
                    minLength,
                    validate,
                })}
                placeholder={placeholder}
                onInput={onInput}
                onBlur={onBlur}
                autoComplete="off"
                disabled={disabled}
            />
        </Form.Group>
    );
};

// reusable select component
export const SetectInput = ({
    title,
    label,
    register,
    required,
    placeholder,
    values,
    watch,
    validate,
    disabled,
}) => {
    // function to return a list of options with data from array of values
    const options = values.map((value) => {
        return (
            <option key={value} value={value}>
                {value}
            </option>
        );
    });
    // colorize the selected option from grey (as default) to black (as active)
    const changeColor = (e) => {
        if (watch(label) !== "") {
            document.getElementById(label).classList.add("black");
        }
    };

    return (
        <Form.Group controlId={title} className="form-group-div">
            <Form.Label>{title}</Form.Label>
            <Form.Select
                onClick={(e) => changeColor(e)}
                {...register(label, { required, validate })}
                className="item-select-options"
                id={label}
                disabled={disabled}>
                {/* if placeholder exists, it is like a default value in options */}
                {placeholder ? (
                    <option value="" disabled className="default-option">
                        {placeholder}
                    </option>
                ) : null}
                {options}
            </Form.Select>
        </Form.Group>
    );
};

// warning message for validation under an input
export const RequiredMessage = ({ errors, label }) => {
    const error = errors[label];
    return (
        <p className={error?.message ? "form-warnings" : "form-warnings closed"}>
            {error?.message}
        </p>
    );
};

// when call Edit Form, color inputs in black and grey
export function colorizeInputs() {
    // some inputs are filled and select options are chosen, so they should be black
    const allInputs = document.querySelectorAll(".form-inputs input");
    const allSelects = document.querySelectorAll(".form-inputs select");
    for (let i = 0; i < allInputs.length - 1; i++) {
        // for those inputs that weren't filled and for Card Number or Name inputs, color is grey
        allInputs[i].value !== "" && allInputs[i].id !== "Card Number" && allInputs[i].id !== "Name"
            ? allInputs[i].classList.add("black-color")
            : allInputs[i].classList.add("grey-color");
    }
    // all selects are black
    [...allSelects].forEach((select) =>
        select.id === "currency"
            ? select.classList.add("grey-color")
            : select.classList.add("black-color")
    );
}
