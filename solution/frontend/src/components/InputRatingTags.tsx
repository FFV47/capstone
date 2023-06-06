import { Row } from "react-bootstrap";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import StarFilledIcon from "../icons/StarFilledIcon";

type Props<T extends FieldValues> = {
  title: string;
  register: UseFormRegister<T>;
  fieldName: keyof T;
  selectedTag: string | undefined;
};

export default function InputRatingTags<T extends FieldValues>({
  title,
  fieldName,
  selectedTag,
  register,
}: Props<T>) {
  return (
    <fieldset className="mt-3">
      <legend className="text-center">{title}</legend>
      <Row className="gap-2 mt-3">
        {[1, 2, 3, 4, 5].map((rating) => (
          <label
            key={rating}
            className={`btn w-auto rounded-pill rating-label ${
              Number(selectedTag) === rating ? "modal-item-selected" : ""
            }`}
          >
            <input
              type="radio"
              className="btn-check"
              autoComplete="off"
              value={rating}
              {...register(fieldName as Path<T>)}
            />
            <div className="star-wrapper">
              {[...Array(rating)].map((_, i) => (
                <StarFilledIcon key={rating * 10 + i} />
              ))}
            </div>
          </label>
        ))}
      </Row>
    </fieldset>
  );
}
