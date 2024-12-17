const validationRegex = {
    emailRegex: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i,
    nameRegex:/^[a-zA-Z\s]+$/,
    emptyStringRegex: /^\s*$/,
    mobileRegex: /^[6-9]\d{9}$/,
    upercaseRegex: /[a-zA-Z0-9_.-]*$/,
    floatRegex:/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
    numberRegex:/^(0|[1-9][0-9]*)$/,
    nonzeroFloatRegex:/^-?(0\.\d*[1-9]\d*|[1-9]\d*(\.\d+)?)$/,
    employeeIdRegex:/^WIT\d{3,5}$/i,
    passwordRegex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    imeiRegex: /[a-zA-Z0-9_.-]*$/,
    alphaNumericRegex:/[A-Z]{5}[0-9]{4}[A-Z]{1}/,
    adhaarCardRegex:/[2-9]{1}[0-9]{11}$/,
    ifscCodeRegex: /^[A-Za-z]{4}\d{7}$/,
};

export default validationRegex;