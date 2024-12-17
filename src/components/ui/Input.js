import { useState } from "react";
import { NotificationManager } from "react-notifications";

const Input = ({
  name,
  variant = "border",
  label,
  type = "text",
  value,
  autoSuggest,
  suggestionList,
  width = "100%",
  inputStyle,
  error,
  placeholder,
  forwardedRef,
  touched = false,
  className,
  maxLength,
  pattern,
  onChange,
  onKeyDown,
  onBlur,
  visible = true,
  disablePaste,
  disabled = false,
  ...props
})=> {
  const [keycode, setKeycode] = useState();
  const [show, setShow] = useState(type);
  const handleKeyPress = (event) => {
    const startPos = event.target.selectionStart;
    setKeycode(event.which);
    if (event.which === 32 && startPos === 0) {
      event.preventDefault();
      return;
    }

    if (type === "number") {
      if (["e", "E", "+", "-"].includes(event.key)) {
        event.preventDefault();
        return;
      }
    }
    if (typeof onKeyDown === "function") onKeyDown(event);
  };

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
    setShow(show == type ? "text" : type);
  };

  return (
    <>
      <div className={`${className} ${!visible && " hidden"}`}>
        <div className={`${label && "flex"} relative`}>
          {label && <label className={`mr-2`}>{label}</label>}
          <input
            className={`text-sm ${
              variant === "border"
                ? "border border-dark input"
                : "border-0 outline-0 w-full"
            } ${disabled && !(error && touched) && "class-disable"} ${
              error && touched && "border border-error"
            } ${inputStyle}`}
            id={name}
            name={name}
            type={type === "password" ? show : type}
            placeholder={placeholder}
            disabled={disabled}
            onChange={onChange}
            onKeyDown={handleKeyPress}
            ref={forwardedRef}
            onPaste={
              disablePaste
                ? (e) => e.preventDefault()
                : () => {
                    /** do nothing * */
                  }
            }
            onBlur={onBlur}
            value={value}
            {...props}
            maxLength={maxLength}
          />
          {autoSuggest && suggestionList}
          {type === "password" && !disablePaste && (
            <span
              onClick={togglePasswordVisibility}
              className="absolute end-0 eye-icon cursor-pointer"
            >
              {/* {passwordVisible ? (
                <AiFillEye style={{ color: `${COLOR.GREEN_LIGHT_1}` }} />
              ) : (
                <AiFillEyeInvisible
                  style={{ color: `${COLOR.GREEN_LIGHT_1}` }}
                />
              )} */}
            </span>
          )}
        </div>
        {error && <p className="text-red-600 text-sm mt-1 font-medium pl-2">{error}</p>}
      </div>

      <style jsx>{`
        .input {
          border-radius: 6px;
          height: 49px;
          width: ${width};
          border: 1px solid rgb(228, 229, 234);
          box-shadow: 0px 2px 4px 0px rgba(28, 39, 76, 0.07);
          padding:10px 15px;
          box-sizing: border-box;
        }
        .eye-icon {
          padding: 1rem 24px 24px 0px;
        }
        @media screen and (max-width: 768px) {
          .input {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default Input;
