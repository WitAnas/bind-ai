const TextArea = ({
    name,
    value,
    label,
    placeholder = "type here",
    forwardedRef,
    error,
    touched = false,
    classname,
    width = "100%",
    onChange,
    disablePaste,
    disabled = false,
    maxLength,
    pattern,
    maskingPattern,
    onKeyDown,
    onBlur,
    autoComplete = "off",
    rows = 8,
    readOnly,
    ...props
  }) => {
    const handleKeyPress = (event) => {
      const startPos = event.target.selectionStart;
      if (event.which === 32 && startPos === 0) {
        event.preventDefault();
        return;
      }
  
      if (typeof onKeyDown === "function") onKeyDown(event);
    };
  
    return (
      <>
        <div>
          <textarea
            className={`border textarea rounded-lg pt-2 bg-white ${classname} ${
              readOnly && "class-disable"
            } ${disabled && !(error && touched) && "class-disable"} ${
              error && touched ? "border-error text-error" : ""
            }`}
            id={name}
            name={name}
            placeholder={placeholder}
            onChange={(e) => {
              onChange && onChange(e);
            }}
            onPaste={
              disablePaste
                ? (e) => e.preventDefault()
                : () => {
                    /** do nothing * */
                  }
            }
            onKeyDown={handleKeyPress}
            autoComplete={autoComplete}
            onBlur={onBlur}
            value={value}
            disabled={disabled}
            maxLength={maxLength}
            readOnly={readOnly}
            rows={rows}
            {...props}
          />
          {error && (
            <p className="text-red-600 text-sm mt-1 font-medium pl-2">{error}</p>
          )}
        </div>
        <style jsx>{`
          /* Make the label and field look identical on every browser */
          .textarea {
            resize: none;
            padding-left: 10px;
            outline: 0;
            font-size: 14px;
            width: ${width};
          }
          .class-disable {
            background: #c2c7d13d 0% 0% no-repeat padding-box;
            border: 1px solid #c2c7d17a;
            border-radius: 8px;
            opacity: 1;
          }
        `}</style>
      </>
    );
  };
  
  export default TextArea;
  