import { useEffect, useReducer, useRef } from "react";
import { CloseButton, Col, Form, FormText, Row } from "react-bootstrap";
import { FieldValues, Path, PathValue, UseFormSetValue } from "react-hook-form";
import { TStateHook } from "../utils/utils";

type TProps<T extends FieldValues> = {
  label: string;
  imageField: "photo" | "logo" | "personalPhoto";
  imageBlob: File | undefined;
  setValue: UseFormSetValue<T>;
  setValidImg: TStateHook<boolean>;
};

type TReducer = {
  fileError: string;
  uploadedImg: File | undefined;
  preview: string;
};

function validImageFile(file: File | undefined) {
  if (!file) {
    return { success: false, error: "No file provided." };
  }

  const fileSizeThreshold = 2 * 1024 * 1024;
  if (file.size > fileSizeThreshold) {
    return {
      success: false,
      error: `File size limit is 2 MB. Uploaded file is ${formatFileSize(file.size)}.`,
    };
  }

  const fileTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!fileTypes.includes(file.type)) {
    return { success: false, error: "File type is not allowed." };
  }

  return { success: true, error: "" };
}

function formatFileSize(byteSize: number) {
  if (byteSize < 1024) {
    return `${byteSize} bytes`;
  } else if (byteSize >= 1024 && byteSize < 1048576) {
    return `${(byteSize / 1024).toFixed(1)} KB`;
  } else if (byteSize >= 1048576) {
    return `${(byteSize / 1048576).toFixed(1)} MB`;
  } else {
    return "Invalid file";
  }
}

function reducer(state: TReducer, payload: Partial<TReducer>) {
  return {
    ...state,
    ...payload,
  };
}

const initialState: TReducer = {
  fileError: "",
  uploadedImg: undefined,
  preview: "",
};

export default function ImageInput<T extends FieldValues>({
  label,
  imageField,
  imageBlob,
  setValue,
  setValidImg,
}: TProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const imageURL = imageBlob ? URL.createObjectURL(imageBlob) : "";
  const [{ fileError, uploadedImg, preview }, dispatch] = useReducer(reducer, {
    ...initialState,
    preview: imageURL,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { success, error } = validImageFile(e.target.files?.[0]);
    setValidImg(success);
    dispatch({ fileError: error });

    if (!success) {
      setValue(imageField as Path<T>, "" as PathValue<T, Path<T>>);
    } else if (e.currentTarget.files?.length) {
      const imgFile = e.currentTarget.files[0];

      dispatch({ uploadedImg: imgFile });
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      if (fileError) {
        inputRef.current.setCustomValidity(fileError);
      } else {
        inputRef.current.setCustomValidity("");
      }
    }
  }, [fileError]);

  useEffect(() => {
    if (!uploadedImg) return;

    const fileURL = URL.createObjectURL(uploadedImg);

    const canvasImg = new Image();
    canvasImg.src = fileURL;

    canvasImg.addEventListener("load", function () {
      // Release the object URL since it's no longer needed once the image has
      // been loaded
      URL.revokeObjectURL(fileURL);

      // Resize image in canvas
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx)
          throw new Error("This browser does not support 2-dimensional canvas rendering contexts.");

        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

        // Convert canvas to image, then set image as form field and preview
        canvas.toBlob((blob) => {
          if (blob) {
            // Django doesn't accept blob for file upload
            const file = new File([blob], "photo.jpg", { type: "image/jpg" });
            setValue(imageField as Path<T>, file as PathValue<T, Path<T>>);

            const url = URL.createObjectURL(blob);
            dispatch({ preview: url });
          }
        });
      }
    });
  }, [imageField, setValue, uploadedImg]);

  useEffect(() => {
    URL.revokeObjectURL(preview);
    return () => {
      URL.revokeObjectURL(imageURL);
    };
  }, [imageURL, preview]);

  return (
    <>
      {/* Image View */}
      <canvas ref={canvasRef} width={1024} height={1024} className="visually-hidden"></canvas>
      {!fileError && preview && (
        <div className="d-flex flex-wrap justify-content-center mb-3">
          <span className="upload-span text-center flex-grow-1 flex-md-grow-0 me-md-5 mb-2 mb-md-0">
            Preview
          </span>
          <img
            src={preview}
            alt="uploaded file"
            className="img-thumbnail flex-md-grow-0 uploaded-img"
          />
        </div>
      )}

      <Form.Group as={Row} className="mb-3" controlId={imageField}>
        <Form.Label column xs={12} md={3}>
          {label}
        </Form.Label>

        <Col md={9}>
          <div className="input-file-wrapper">
            <CloseButton
              onClick={() => {
                if (inputRef.current) {
                  inputRef.current.value = "";
                  dispatch({ fileError: "", preview: "" });
                }
              }}
            />
            <Form.Control
              type="file"
              ref={inputRef}
              onChange={handleFileUpload}
              accept="image/png, image/jpg, image/webp"
              isInvalid={Boolean(fileError)}
              aria-invalid={Boolean(fileError)}
            />
            <Form.Control.Feedback type="invalid">{fileError}</Form.Control.Feedback>
          </div>
          <FormText>Only PNG, JPEG and WEBP accepted</FormText>
        </Col>
      </Form.Group>
    </>
  );
}
