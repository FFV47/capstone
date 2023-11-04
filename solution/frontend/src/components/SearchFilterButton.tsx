import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import CloseIcon from "../icons/CloseIcon";
import StarFilledIcon from "../icons/StarFilledIcon";

type TProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  handleClick: () => void;
  fieldName: keyof T;
  label?: string;
  value: string | number | readonly string[] | undefined;
  selectedRating?: string;
};

export default function SearchFilterButton<T extends FieldValues>({
  register,
  fieldName,
  label,
  value,
  handleClick,
  selectedRating,
}: TProps<T>) {
  return (
    <button
      type="button"
      className="btn rounded-pill btn-filter d-flex align-items-center"
      onClick={handleClick}
    >
      <label>
        <input
          type="checkbox"
          className="btn-check"
          value={value}
          readOnly
          checked
          name={register(fieldName as Path<T>).name}
        />
        {selectedRating && (
          <div className="star-wrapper">
            {[...Array(Number(selectedRating))].map((_, i) => (
              <StarFilledIcon key={Number(selectedRating) * 10 + i} />
            ))}
          </div>
        )}
        {label}
      </label>
      <CloseIcon extraClass="ms-1" />
    </button>
  );
}
