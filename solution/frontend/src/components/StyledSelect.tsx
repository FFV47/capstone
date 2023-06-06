import React, { useState } from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

type Option = {
  "default": string;
  [key: string]: string;
};

type Props<T extends FieldValues> = {
  register: UseFormRegister<T>;
  fieldName: keyof T;
  onChange: () => void | undefined;
  options: Option;
  className?: string;
};

export default function StyledSelect<T extends FieldValues>({
  register,
  fieldName,
  onChange,
  options,
  className,
}: Props<T>) {
  const [selectedOption, setSelectedOption] = useState("default");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange();
    setSelectedOption(e.target.value || options["default"]);
  };

  const htmlOptions = [];

  for (const [value, label] of Object.entries(options)) {
    htmlOptions.push(
      <option key={value} value={value}>
        {label}
      </option>
    );
  }

  return (
    <select
      id={fieldName.toString()}
      className={className}
      {...register(fieldName as Path<T>, { onChange: handleChange })}
      style={{ "color": selectedOption === "default" ? "#6c757d" : "black" }}
    >
      {htmlOptions}
    </select>
  );
}
