import { InputHTMLAttributes } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";

interface Props<T extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  field: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  fieldError: FieldError | undefined;
  as?: React.ElementType;
  rows?: number;
}

export default function BsHorizonralInput<T extends FieldValues>({
  field,
  label,
  register,
  fieldError,
  as,
  rows,
  ...rest
}: Props<T>) {
  return (
    <Form.Group as={Row} className="mb-3" controlId={field}>
      <Form.Label column xs={12} md={3} className={rest.required ? "required" : ""}>
        {label}
      </Form.Label>
      <Col md={9}>
        {/* @ts-ignore */}
        <Form.Control
          as={as}
          rows={rows}
          isInvalid={Boolean(fieldError)}
          aria-invalid={Boolean(fieldError)}
          {...rest}
          {...register(field)}
        />
        <Form.Control.Feedback type="invalid">{fieldError?.message}</Form.Control.Feedback>
      </Col>
    </Form.Group>
  );
}
