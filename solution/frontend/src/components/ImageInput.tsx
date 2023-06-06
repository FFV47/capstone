import { useEffect, useLayoutEffect, useReducer, useRef } from "react";
import { FieldValues, Path, PathValue, UseFormSetValue } from "react-hook-form";
import { StateHookType } from "../utils/utils";

type Props<T extends FieldValues> = {
  imageField: TImageKeys;
  imageBlob: Blob | undefined;
  setValue: UseFormSetValue<T>;
  setValidImg: StateHookType<boolean>;
};

type Reducer = {
  fileError: string;
  uploadedImg: Blob | undefined;
  preview: string;
};

type TImageKeys = "photo" | "companyRepPhoto" | "companyLogo";

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

function reducer(state: Reducer, payload: Partial<Reducer>) {
  return {
    ...state,
    ...payload,
  };
}

const initialState: Reducer = { fileError: "", uploadedImg: undefined, preview: "" };

export default function ImageInput<T extends FieldValues>({
  imageField,
  imageBlob,
  setValue,
  setValidImg,
}: Props<T>) {
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
    return () => {
      URL.revokeObjectURL(imageURL);
    };
  }, [imageURL]);

  useLayoutEffect(() => {
    if (!uploadedImg) return;
    const fileURL = URL.createObjectURL(uploadedImg);

    // Show image on the page
    dispatch({ preview: fileURL });

    const canvasImg = new Image();
    canvasImg.src = fileURL;
    canvasImg.addEventListener("load", function () {
      URL.revokeObjectURL(fileURL);
      // Resize image in canvas for upload
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) throw new Error("This browser does not support 2-dimensional canvas rendering contexts.");

        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          blob && setValue(imageField as Path<T>, blob as PathValue<T, Path<T>>);
        });

        // setValue(imageField as Path<T>, canvas.toDataURL("image/jpg", 1) as PathValue<T, Path<T>>);
      }
    });

    // return () => {
    //   URL.revokeObjectURL(fileURL);
    // };
  }, [imageField, setValue, uploadedImg]);

  return (
    <>
      {/* Image View */}
      {!fileError && preview && (
        <div className="d-flex flex-wrap justify-content-center mb-3">
          <span className="upload-span text-center flex-grow-1 flex-md-grow-0 me-md-5 mb-2 mb-md-0">
            Preview
          </span>
          <canvas ref={canvasRef} width={384} height={384} className="visually-hidden"></canvas>
          <img src={preview} alt="uploaded file" className="img-thumbnail flex-md-grow-0 uploaded-img" />
        </div>
      )}

      <div className="row mb-3">
        <label htmlFor={imageField} className="col-12 col-md-auto col-form-label">
          Company Logo
        </label>
        <div className="col">
          <input
            type="file"
            id={imageField}
            ref={inputRef}
            className={`form-control ${fileError ? "is-invalid" : ""}`}
            name={imageField}
            onChange={handleFileUpload}
            accept="image/png, image/jpg, image/webp"
            aria-describedby="formFileHelp imageUploadFeedback"
          />
          {fileError && (
            <span className="invalid-feedback" id="imageUploadFeedback" aria-live="polite">
              {fileError}
            </span>
          )}
          <span id="formFileHelp" className="form-text d-inline-block mt-1">
            Only PNG, JPEG and WEBP accepted
          </span>
        </div>
      </div>
    </>
  );
}
