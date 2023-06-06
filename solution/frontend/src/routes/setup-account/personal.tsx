import { QueryClient, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import ImageInput from "../../components/ImageInput";
import rolesQuery from "../../queries/rolesQuery";
import { maxBirthDate, minBirthDate, PersonalInfo, useSetupAccountContext } from "./setup-account";

import ReactDatePicker from "react-datepicker";
import { Controller, SubmitHandler } from "react-hook-form";

type LoaderData = Awaited<ReturnType<ReturnType<typeof loader>>>;

export function loader(queryClient: QueryClient) {
  return async () => {
    const data = queryClient.ensureQueryData(rolesQuery);

    if (!data) throw new Response("Worker roles not found", { status: 404 });
    return data;
  };
}

export default function PersonalInfo() {
  const initialData = useLoaderData() as LoaderData;
  const { data } = useQuery({ ...rolesQuery, initialData });

  const { personalInfoForm, accountForm } = useSetupAccountContext();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isValid },
  } = personalInfoForm;

  const imageBlob = watch("photo");

  const [validImg, setValidImg] = useState(true);
  const [wasValidated, setWasValidated] = useState(false);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<PersonalInfo> = (data) => {
    const formData = { ...data, accountType };
    setWasValidated(true);

    if (validImg) {
      // console.log(formData);
      console.log(formData.birthDate.toISOString());
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
        <legend className="h1">Worker Info</legend>
        <p className="text-muted required">Indicates a required field</p>

        <ImageInput imageField="photo" imageBlob={imageBlob} setValue={setValue} setValidImg={setValidImg} />

        <div className="row mb-3">
          <label htmlFor="profession" className="col-12 col-md-auto col-form-label required">
            Profession
          </label>
          <div className="col">
            <select id="profession" className="form-select" required {...register("profession")}>
              {data.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="firstName" className="col-12 col-md-auto col-form-label required">
            First Name
          </label>
          <div className="col">
            <input
              type="text"
              id="firstName"
              className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
              pattern="^[A-Z][\w]{1,}"
              autoCapitalize="words"
              title="First name must be capitalized"
              aria-describedby="firstNameFeedback"
              aria-invalid={errors.firstName ? "true" : "false"}
              required
              {...register("firstName")}
            />
            {errors.firstName && (
              <div id="firstNameFeedback" className="invalid-feedback">
                First name must be capitalized.
              </div>
            )}
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="lastName" className="col-12 col-md-auto col-form-label required">
            Last Name
          </label>
          <div className="col">
            <input
              type="text"
              id="lastName"
              className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
              pattern="^[A-Z][\w]{1,}"
              autoCapitalize="words"
              title="Last name must be capitalized"
              aria-describedby="lastNameFeedback"
              aria-invalid={errors.lastName ? "true" : "false"}
              required
              {...register("lastName")}
            />
            {errors.lastName && (
              <div id="lastNameFeedback" className="invalid-feedback">
                First name must be capitalized.
              </div>
            )}
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="birthDate" className="col-12 col-md-auto col-form-label required">
            Birth Date
          </label>
          <div className="col">
            <Controller
              control={control}
              name="birthDate"
              rules={{ required: true }}
              render={({ field }) => (
                <ReactDatePicker
                  id="birthDate"
                  selected={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  showPopperArrow={false}
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  placeholderText="Click to select your birthdate"
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  autoComplete="bday"
                  minDate={minBirthDate}
                  maxDate={maxBirthDate}
                />
              )}
            />

            {errors.birthDate && (
              <div id="birthDateFeedback" className="invalid-feedback">
                {errors.birthDate.message}
              </div>
            )}
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="phone" className="col-12 col-md-auto col-form-label required">
            Phone
          </label>
          <div className="col">
            <input
              type="tel"
              id="phone"
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              pattern="^(\d{1,3})(\d{2})(\d{9})$"
              required
              aria-describedby="phoneFeedback"
              aria-invalid={errors.phone ? "true" : "false"}
              {...register("phone")}
            />
            <small className="form-text">
              Type the numbers only. Required format: (Country Code)(Region Code)(Phone number).
            </small>
            {errors.phone && (
              <div id="phoneFeedback" className="invalid-feedback">
                Invalid phone number.
              </div>
            )}
          </div>
        </div>
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
          <label htmlFor="aboutMe" className="col-12 col-md-auto col-form-label">
            About me
          </label>
          <div className="col">
            <textarea id="aboutMe" {...register("aboutMe")} rows={3} className="form-control"></textarea>
          </div>
        </div>

        <div className="d-flex gap-4 justify-content-md-end mt-2 mb-3 p-0">
          <button type="button" className="btn btn-primary flex-grow-1 flex-md-grow-0 px-4 position-relative">
            <Link to={".."} className="stretched-link btn-link-custom">
              Back
            </Link>
          </button>
          <button
            type="submit"
            className="btn btn-primary flex-grow-1 flex-md-grow-0 px-4 position-relative"
            disabled={!isValid}
          >
            Submit
          </button>
        </div>
      </fieldset>
    </form>
  );
}
