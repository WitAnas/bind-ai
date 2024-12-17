
const RadioButton = ({
  id,
  name,
  value,
  label,
  className,
  selectedChecked,
  checked = false,
  onChange,
  ...props
})=> {
  return (
    <div className={`w-full pl-5 flex items-center gap-3 ${selectedChecked && "bg-[#F8F7FD]"}`}>
      <input
        type="radio"
        id={id}
        name={name}
        checked={selectedChecked}
        value={value}
        onChange={onChange}
        {...props}
        className={`radio-oval w-[15px] ${className}`}
      />
      <p className="w-full font-medium cursor-pointer text-sm py-[14px]">{label}</p>

      <style jsx>
        {`
          .selected {
            cursor:pointer;
          }

        `}
      </style>
    </div>
  );
};

export default RadioButton;
