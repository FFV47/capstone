import { Row } from "react-bootstrap";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

type Props<T extends FieldValues> = {
  title: string;
  fieldName: keyof T;
  tags: string[];
  selectedTags: string[];
  register: UseFormRegister<T>;
};

export default function InputTextTags<T extends FieldValues>({
  title,
  fieldName,
  tags,
  selectedTags,
  register,
}: Props<T>) {
  return (
    <fieldset className="mb-3">
      <legend className="text-center">{title}</legend>
      <Row className="gap-2 mt-3">
        {tags.map((tag) => (
          <label
            key={tag}
            className={`btn w-auto rounded-pill ${selectedTags.includes(tag) ? "modal-item-selected" : ""}`}
          >
            <input
              type="checkbox"
              className="btn-check"
              autoComplete="off"
              defaultChecked={selectedTags.includes(tag)}
              value={tag}
              {...register(fieldName as Path<T>)}
            />
            {tag}
          </label>
        ))}
      </Row>
    </fieldset>
  );
}
