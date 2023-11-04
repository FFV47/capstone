import { Row } from "react-bootstrap";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

type TProps<T extends FieldValues> = {
  title: string;
  register: UseFormRegister<T>;
  fieldNames: string[];
  tags: (keyof T)[];
  selectedTags: (boolean | undefined)[];
};

export default function InputBoolTags<T extends FieldValues>({
  title,
  register,
  fieldNames,
  tags,
  selectedTags,
}: TProps<T>) {
  return (
    <fieldset className="mb-3">
      <legend className="text-center">{title}</legend>
      <Row className="gap-2 mt-3">
        {tags.map((tag, index) => (
          <label
            key={index}
            className={`btn w-auto rounded-pill ${
              selectedTags[index] ? "modal-item-selected" : ""
            }`}
          >
            <input
              type="checkbox"
              className="btn-check"
              value={1}
              autoComplete="off"
              defaultChecked={Boolean(selectedTags[index])}
              {...register(tag as Path<T>)}
            />
            {fieldNames[index]}
          </label>
        ))}
      </Row>
    </fieldset>
  );
}
