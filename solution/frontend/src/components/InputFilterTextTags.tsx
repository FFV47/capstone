import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import CloseIcon from "../icons/CloseIcon";

type Props<T extends FieldValues> = {
  fieldName: keyof T;
  formMethods: UseFormReturn<T>;
  formSubmit: () => void | undefined;
};

export default function InputFilterTextTags<T extends FieldValues>({
  fieldName,
  formMethods,
  formSubmit,
}: Props<T>) {
  const { register, setValue, watch } = formMethods;

  const tagsSelected = watch(fieldName as Path<T>) as string[];

  const removeTag = (tag: string) => {
    const newTags = tagsSelected.filter((item) => item !== tag);
    setValue(fieldName as Path<T>, newTags as PathValue<T, Path<T>>);
  };

  return (
    <>
      {tagsSelected.length > 0 &&
        tagsSelected.map((tag) => (
          <button
            key={tag}
            type="button"
            className="btn rounded-pill btn-filter d-flex align-items-center"
            onClick={() => {
              removeTag(tag);
              formSubmit();
            }}
          >
            <label>
              <input
                type="checkbox"
                className="btn-check"
                value={tag}
                readOnly
                checked
                name={register(fieldName as Path<T>).name}
              />
              {tag}
            </label>
            <CloseIcon extraClass="ms-1" />
          </button>
        ))}
    </>
  );
}
