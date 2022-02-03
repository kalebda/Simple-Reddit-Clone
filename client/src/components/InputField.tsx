import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";
import { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  textArea?: boolean;
};

function InputField({ label, size: _, textArea, ...props }: InputFieldProps) {
  const [field, { error }] = useField(props);
  let TextAreaOrInputField: any = Input;
  if (textArea) {
    TextAreaOrInputField = Textarea;
  }
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <TextAreaOrInputField
        {...field}
        {...props}
        id={field.name}
        placeholder={props.placeholder}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
}

export default InputField;
