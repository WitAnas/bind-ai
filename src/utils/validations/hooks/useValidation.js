import { useState, useRef } from 'react';
import { validationUtils, useDeepEffect } from '@/lib/utils';

const useValidation = (data, validators, validateForm, getExternalContext) => {
    const [values, setValues] = useState({ ...data });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    useDeepEffect(() => {
        setValues({ ...values, ...data });
    }, [data]);

    const getFieldData = (event) => {
        const { name, value } = event.target;
        const fieldName = name;
        const fieldValue = value;
        return { fieldName, fieldValue };
    };

    const handleChange = (event) => {
        const { fieldName, fieldValue } = getFieldData(event);
        setValues({ ...values, [fieldName]: fieldValue });
    };

    const handleBlur = async (event) => {
        if (event.relatedTarget && event.relatedTarget.type === 'submit') {
            return; // prevent field level validation on submit click
        }
        const { fieldName, fieldValue } = getFieldData(event);
        updateTouched(fieldName);
        const fieldError = await validateField(fieldName, fieldValue);
        updateFormErrors(fieldName, fieldError);
    };

    const validateField = async (fieldName, fieldValue)=> {
        let fieldError = {};
        const externalContext = getExternalContext();
        if (Object.keys(validators).includes(fieldName)) {
            if (validators[fieldName].constructor.name === 'AsyncFunction') {
                fieldError = await validators[fieldName](fieldValue, externalContext);
            } else {
                fieldError = validators[fieldName](fieldValue, externalContext);
            }
        }
        return fieldError;
    };

    const updateTouched = (fieldName) => {
        if (validationUtils.isEmpty(touched) || Object.keys(touched).indexOf(fieldName) === -1) {
            setTouched({ ...touched, [fieldName]: true });
        }
    };

    const updateFormErrors = (fieldName, fieldError) => {
        if (validationUtils.isEmpty(fieldError)) {
            const updatedErrors = { ...errors };
            delete updatedErrors[fieldName];
            setErrors(updatedErrors);
        } else {
            setErrors({ ...errors, ...fieldError });
        }
    };

    const markAllTouched = () => {
        const touchedData = {};
        Object.keys(data).forEach((key) => {
            touchedData[key] = true;
        });
        setTouched(touchedData);
    };

    const validateFormData = async () => {
        let isValid = false;
        const validationErrors = await validateForm(values);
        setErrors(validationErrors);
        focusFirstFieldWithError(validationErrors);
        isValid = validationUtils.isEmpty(validationErrors);
        return isValid;
    };

    const focusFirstFieldWithError = (validationErrors) => {
        if (!validationUtils.isEmpty(validationErrors)) {
            const firstFieldWithError = Object.keys(validationErrors)[0];
            if (fieldDomRefs[firstFieldWithError]?.current) {
                fieldDomRefs[firstFieldWithError].current.focus();
            }
        }
    };

    const resetForm = () => {
        setValues(data);
        setErrors({});
        setTouched({});
    };

    return [
        errors,
        values,
        touched,
        markAllTouched,
        handleChange,
        handleBlur,
        resetForm,
        setErrors,
    ];
};

export default useValidation;
