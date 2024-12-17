import Image from "next/image";

const Button = ({
  type = "button",
  disabled = false,
  size = "small",
  variant = "primary",
  className,
  onClick,
  children,
  precedingText,
  icon,
  iconAltText,
  loading = false,
  visible = true,
  onSubmit = false,
  onlyIcon = false,
  width,
  height,
}) => {
  return (
    <div className={`${precedingText && "mt-6 flex"} ${!visible && "hidden"}`}>
      {precedingText && <p className="text-sm mr-1">{precedingText}</p>}
      <button
        type={type}
        className={`${variant !== "link" && size} ${variant} btn-style flex ${
          onSubmit && !loading && "cursor-not-allowed"
        } justify-center items-center border-box ${className} ${
          loading && "pointer-events-none"
        } `}
        onClick={onClick}
        disabled={onSubmit ? onSubmit : loading ? loading : disabled}
      >
        {icon && (
          <Image
            src={icon}
            alt={iconAltText || "icon"}
            width={width || 20}
            height={height || 20}
            className="mr-2"
          />
        )}
        {!onlyIcon && children}
      </button>

      <style jsx>
        {`
          .btn-style {
            font-size: 14px;
            font-weight: 600;
          }
          .fully-rounded {
            border-radius: 60px !important;
          }
          .primary {
            color: #fff;
            background: #4529fa;
            border-radius: 4px;
            box-shadow: 0px 2px 4px 0px rgba(28, 39, 76, 0.07);
          }
          .secondary {
            background: #fff;
            border: 1px solid #e4e7eb;
            border-radius: 4px;
            font-weight: 400;
          }
          .tertiary {
            border: 1px solid rgb(69, 41, 250);
            border-radius: 8px;
            box-shadow: 0px 2px 4px 0px rgba(28, 39, 76, 0.07);
            background: rgba(69, 41, 250, 0.16);
            font-weight:500;
            color: rgb(69, 41, 250);
          }
          .small {
            padding-left: 11px;
            padding-right: 11px;
            height: 32px;
          }
          .medium {
            height: 40px;
            padding-left: 30px;
            padding-right: 30px;
          }
          .large {
            padding-left: 38px;
            padding-right: 38px;
            height: 48px;
          }
          .link {
            color: #1c274c;
          }
        `}
      </style>
    </div>
  );
};

export default Button;
