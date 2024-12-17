import React from "react";

const Checkbox = ({
  name,
  checked,
  className,
  label,
  value,
  forwardedRef,
  onChange,
  onBlur,
  visible,
  line,
  customCheckbox=true
}) => {
  return (
    <>
      <div
        className={`py-2 checkbox-container ${className} ${
          !visible && "hidden"
        }`}
      >
        <input
          type="checkbox"
          name={name}
          checked={checked}
          value={value}
          ref={forwardedRef}
          onClick={(e) => {
            onChange && onChange(e);
          }}
          onChange={() => {}}
          onBlur={onBlur}
        />
        <span className={`px-1 ml-3 ${checked ? "text-success" : "label"}`}>
          {label}
        </span> 

        <style jsx>
          {`
            input[type="checkbox"] {
              width: 15px;
              height: 15px;
              border: none;
              position: relative;
            }
            input[type="checkbox"]:checked{
              accent-color: green;
              opacity:0.7;
              width: ${customCheckbox &&'15px'};
              height: ${customCheckbox &&'15px'};
            }
            .label {
              color: #23232380;
            }
          `}
        </style>
      </div>
    </>
  );
};

export default Checkbox;