import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import ImageInput from "../../../components/ImageInput";
import { CompanyInfo, useSetupAccountContext } from "../setup-account";

export default function CompanyInfo() {
  const { accountForm, companyInfoForm } = useSetupAccountContext();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = companyInfoForm;

  const imageBlob = watch("companyLogo");
  const [validImg, setValidImg] = useState(true);
  const [wasValidated, setWasValidated] = useState(false);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<CompanyInfo> = () => {
    setWasValidated(true);

    if (validImg) {
      navigate("../business-rep");
    }
  };

  const accountType = accountForm.getValues("accountType");

  useEffect(() => {
    if (!accountType) {
      navigate("..");
    }
  }, [accountType, navigate]);

  return (
    <form
      className={`container-sm needs-validation ${wasValidated ? "was-validated" : ""}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset>
        <legend className="h1">Company Information</legend>
        <p className="text-muted required">Indicates a required field</p>

        <ImageInput
          imageField="companyLogo"
          imageBlob={imageBlob}
          setValue={setValue}
          setValidImg={setValidImg}
        />

        <div className="row mb-3">
          <label htmlFor="companyName" className="col-12 col-md-auto col-form-label required">
            Company Name
          </label>
          <div className="col">
            <input
              type="text"
              id="companyName"
              className={`form-control ${errors.companyName ? "is-invalid" : ""}`}
              pattern="^[A-Z][\w\s.]{1,}"
              autoCapitalize="words"
              title="Company name must be capitalized"
              placeholder="Brave, Microsoft..."
              aria-describedby="companyNameFeedback"
              aria-invalid={errors.companyName ? "true" : "false"}
              required
              {...register("companyName")}
            />
            {errors.companyName && (
              <div id="companyNameFeedback" className="invalid-feedback">
                Company name must be capitalized
              </div>
            )}
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="companyAddress" className="col-12 col-md-auto col-form-label required">
            Company Address
          </label>
          <div className="col">
            <input
              type="text"
              id="companyAddress"
              className={`form-control ${errors.companyAddress ? "is-invalid" : ""}`}
              pattern="[\w\d\s.#]{2,}"
              title="At least 2 characters"
              placeholder="30 Frank Lloyd Wright Drive..."
              aria-describedby="companyAddressFeedback"
              aria-invalid={errors.companyAddress ? "true" : "false"}
              required
              {...register("companyAddress")}
            />
            {errors.companyAddress && (
              <div id="companyAddressFeedback" className="invalid-feedback">
                Invalid address
              </div>
            )}
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="legalName" className="col-12 col-md-auto col-form-label required">
            Legal/Trading Name
          </label>
          <div className="col">
            <input
              type="text"
              id="legalName"
              className={`form-control ${errors.legalName ? "is-invalid" : ""}`}
              pattern="^[A-Z][\w\s.]{1,}"
              autoCapitalize="words"
              title="Legal name must be capitalized"
              aria-describedby="legalNameFeedback"
              aria-invalid={errors.legalName ? "true" : "false"}
              required
              {...register("legalName")}
            />
            {errors.legalName && (
              <div id="legalNameFeedback" className="invalid-feedback">
                Legal name must be capitalized
              </div>
            )}
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="industry" className="col-12 col-md-auto col-form-label required">
            Industry
          </label>
          <div className="col">
            <input
              type="text"
              id="industry"
              className={`form-control ${errors.industry ? "is-invalid" : ""}`}
              list="industryOptions"
              pattern="^[A-Z][\w\s.,]{1,}"
              autoCapitalize="words"
              placeholder="Construction, Food Service, Transportation & Logistics..."
              title="Industry must be capitalized"
              aria-describedby="industryFeedback"
              aria-invalid={errors.industry ? "true" : "false"}
              required
              {...register("industry")}
            />
            {errors.industry && (
              <div id="industryFeedback" className="invalid-feedback">
                Industry must be capitalized
              </div>
            )}
            <datalist id="industryOptions">
              <option value="Agriculture" />
              <option value="Arts, Entertainment & Recreation" />
              <option value="Construction, Repair & Maintenance Services" />
              <option value="Education" />
              <option value="Energy, Mining & Utilities" />
              <option value="Financial Services" />
              <option value="Government & Public Administration" />
              <option value="Healthcare" />
              <option value="Hotels & Travel" />
              <option value="Human Resources & Staffing" />
              <option value="Information Technology" />
              <option value="Insurance" />
              <option value="Legal" />
              <option value="Management & Consulting" />
              <option value="Manufacturing" />
              <option value="Media & Communication" />
              <option value="Nonprofit & NGO" />
              <option value="Personal Consumer Services" />
              <option value="Pharmaceutical" />
              <option value="Real Estate" />
              <option value="Restaurants & Food Service" />
              <option value="Retail & Wholesale" />
              <option value="Telecommunications" />
              <option value="Transportation & Logistics" />
            </datalist>
          </div>
        </div>
        <fieldset className="mb-3">
          <legend className="required fs-6">Company Size</legend>
          <div className="form-check">
            <input
              id="tiny"
              className={`form-check-input ${errors.companySize ? "is-invalid" : ""}`}
              type="radio"
              aria-describedby="companySizeFeedback"
              value="tiny"
              required
              {...register("companySize")}
            />
            <label className="form-check-label" htmlFor="tiny">
              1 to 2 people
            </label>
          </div>
          <div className="form-check">
            <input
              id="small"
              className={`form-check-input ${errors.companySize ? "is-invalid" : ""}`}
              type="radio"
              aria-describedby="companySizeFeedback"
              value="small"
              {...register("companySize")}
            />
            <label className="form-check-label" htmlFor="small">
              3 to 10 people
            </label>
          </div>
          <div className="form-check">
            <input
              id="medium"
              className={`form-check-input ${errors.companySize ? "is-invalid" : ""}`}
              type="radio"
              aria-describedby="companySizeFeedback"
              value="medium"
              {...register("companySize")}
            />
            <label className="form-check-label" htmlFor="medium">
              11 to 20 people
            </label>
          </div>
          <div className="form-check">
            <input
              id="big"
              className={`form-check-input ${errors.companySize ? "is-invalid" : ""}`}
              type="radio"
              aria-describedby="companySizeFeedback"
              value="big"
              {...register("companySize")}
            />
            <label className="form-check-label" htmlFor="big">
              21 or more people
            </label>
          </div>
          {errors.companySize && (
            <div id="companySizeFeedback" className="invalid-feedback">
              Company size is required
            </div>
          )}
        </fieldset>
        <div className="row mb-3">
          <label htmlFor="location" className="col-12 col-md-auto col-form-label required">
            Location
          </label>
          <div className="col">
            <input
              type="text"
              id="location"
              className={`form-control ${errors.location ? "is-invalid" : ""}`}
              pattern="^[A-Z][\w\s.,]{1,}"
              autoCapitalize="words"
              title="Location must be capitalized"
              placeholder="New York, London..."
              aria-describedby="locationFeedback"
              aria-invalid={errors.location ? "true" : "false"}
              required
              {...register("location")}
            />
            {errors.location && (
              <div id="locationFeedback" className="invalid-feedback">
                Location must be capitalized
              </div>
            )}
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="companyLink" className="col-12 col-md-auto col-form-label">
            Website URL
          </label>
          <div className="col">
            <input
              type="url"
              id="companyLink"
              className="form-control"
              pattern="https://.*"
              placeholder="https://example.com"
              {...register("companyLink")}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="description" className="col-12 col-md-auto col-form-label">
            Description
          </label>
          <div className="col">
            <textarea
              id="description"
              {...register("description")}
              rows={3}
              className="form-control"
            ></textarea>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6 d-flex">
            <button
              type="button"
              className="btn btn-primary flex-grow-1 flex-md-grow-0 align-self-center px-4"
              onClick={() => reset()}
            >
              Reset
            </button>
          </div>
          <div className="col-12 col-md-5 offset-md-1 d-flex justify-content-between gap-3 mt-3 mb-3">
            <button type="button" className="btn btn-primary flex-grow-1 position-relative">
              <Link to={".."} className="stretched-link btn-link-custom">
                Back
              </Link>
            </button>

            <button type="submit" className="btn btn-primary flex-grow-1" disabled={!isValid}>
              Next
            </button>
          </div>
        </div>
      </fieldset>
    </form>
  );
}
