import { CSSProperties, useEffect, useRef, useState } from "react";
import { FormProvider, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { BsFilter } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";
import SearchFilterButton from "../../components/SearchFilterButton";
import StyledSelect from "../../components/StyledSelect";
import SearchIcon from "../../icons/SearchIcon";
import type { TJobRoles } from "../Root";
import type { TWorkerProfiles } from "../../queries/workerQuery";
import type { TStateHook } from "../../utils/utils";
import WorkerFilterModal, { TWorkerFilterModalRef } from "./WorkerFilterModal";

export type TWorkersSearchForm = {
  workerSearch?: string;
  selectedRoles: string[];
  selectedRating?: string;
  hasVerifiedID?: boolean;
  hasDrivingLicense?: boolean;
  sortBy: "default" | "name" | "role" | "rating" | "reviewCount" | "jobsDone" | "location";
};

type TTargetForm = {
  [prop in keyof TWorkersSearchForm]: HTMLInputElement | HTMLSelectElement;
} & HTMLFormElement;

type TProps = {
  queryProfiles: TWorkerProfiles;
  setFilteredProfiles: TStateHook<TWorkerProfiles>;
  roles: TJobRoles;
};

export default function WorkerSearch({ queryProfiles, setFilteredProfiles, roles }: TProps) {
  // Router
  const [searchParams, setSearchParams] = useSearchParams();

  // React-Hook-Form
  const formMethods = useForm<TWorkersSearchForm>({
    defaultValues: {
      workerSearch: "",
      selectedRoles: [],
      selectedRating: "",
      hasVerifiedID: false,
      hasDrivingLicense: false,
      sortBy: "default",
    },
  });

  const { register, getValues, setValue, reset, handleSubmit, control } = formMethods;

  const { workerSearch, selectedRoles, selectedRating, hasVerifiedID, hasDrivingLicense } = {
    ...useWatch({ control }),
    ...getValues(),
  };

  // Component state
  const [style, setStyle] = useState<CSSProperties>({});
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [updateURL, setUpdateURL] = useState(false);

  const formEl = useRef<HTMLFormElement>(null);
  const modalRef = useRef<TWorkerFilterModalRef>(null);

  // Effects
  useEffect(() => {
    if (searchParams.toString()) {
      const role = searchParams.get("selectedRoles");
      if (role) {
        setValue("selectedRoles", [role]);
        setFiltersApplied(true);
        formSubmit(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // https://developer.mozilla.org/en-US/docs/Web/CSS/will-change
  useEffect(() => {
    setStyle({ willChange: "transform" });

    return () => {
      setStyle({ willChange: "auto" });
    };
  }, []);

  useEffect(() => {
    // Debounced search field
    const timer = setTimeout(() => {
      formSubmit();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [workerSearch]);

  // Functions
  const formSubmit = (update = true) => {
    setUpdateURL(update);
    formEl.current?.requestSubmit();
  };

  const removeRole = (role: string) => {
    const newRoles = selectedRoles.filter((item) => item !== role);
    setValue("selectedRoles", newRoles);
  };

  const handleValidForm: SubmitHandler<TWorkersSearchForm> = (data, e) => {
    const target = e?.target as TTargetForm;

    let profiles = queryProfiles;

    if (data.workerSearch) {
      const param = data.workerSearch.toLowerCase();

      profiles = profiles.filter(
        (profile) =>
          profile.name.toLowerCase().includes(param) ||
          profile.role.toLowerCase().includes(param) ||
          profile.about.toLowerCase().includes(param) ||
          profile.location.toLowerCase().includes(param)
      );
    }

    if (data.selectedRoles.length) {
      profiles = profiles.filter((profile) => data.selectedRoles.includes(profile.role));
    }

    if (data.selectedRating) {
      profiles = profiles.filter((profile) => profile.rating === Number(data.selectedRating));
    }

    if (data.hasVerifiedID) {
      profiles = profiles.filter((profile) => profile.verifiedID === data.hasVerifiedID);
    }

    if (data.hasDrivingLicense) {
      profiles = profiles.filter((profile) => profile.drivingLicense === data.hasDrivingLicense);
    }

    if (data.sortBy) {
      const sortBy = data.sortBy;

      profiles.sort((a, b) => {
        const x = a[sortBy as keyof TWorkerProfiles[number]];
        const y = b[sortBy as keyof TWorkerProfiles[number]];

        if (typeof x === "string" && typeof y === "string") {
          return x.localeCompare(y, "en", { sensitivity: "base" });
        } else {
          if (x > y) return -1;
          if (x < y) return 1;
          return 0;
        }
      });
    }

    setFilteredProfiles(profiles);

    // Update URL
    if (updateURL) {
      const queryString = new URLSearchParams();
      for (const [key, value] of new FormData(target).entries()) {
        if (!value || value === "default") continue;
        queryString.append(key, typeof value === "string" ? value : value.name);
      }

      setSearchParams(queryString);
    }
  };

  return (
    <div id="worker-search" style={style}>
      <FormProvider {...formMethods}>
        <WorkerFilterModal
          ref={modalRef}
          setFiltersApplied={setFiltersApplied}
          formSubmit={formSubmit}
          roles={roles}
        />
      </FormProvider>
      <form
        ref={formEl}
        className="d-flex flex-column align-items-stretch mt-3 mb-3"
        onSubmit={handleSubmit(handleValidForm)}
      >
        {/* Search field */}
        <div className="search-group input-group input-rounded">
          <span className="input-group-text">
            <SearchIcon />
          </span>
          <input
            type="search"
            className="form-control"
            placeholder="Search"
            aria-describedby="searchIcon"
            aria-label="Search Workers"
            {...register("workerSearch")}
          />
        </div>
        {/* Filter field */}
        <div className="filter-group d-flex mt-3">
          <button
            type="button"
            className="btn nowrap ps-3"
            onClick={() => modalRef.current?.showModal()}
          >
            <BsFilter className="heroicon" />
            <span className="d-inline-block ms-2 h-auto">Filter</span>
          </button>
          {filtersApplied && (
            <div className="d-flex flex-wrap align-items-center gap-2 p-1">
              {selectedRoles.length > 0 &&
                selectedRoles.map((role) => (
                  <SearchFilterButton
                    key={role}
                    register={register}
                    fieldName="selectedRoles"
                    label={role}
                    value={role}
                    handleClick={() => {
                      removeRole(role);
                      formSubmit();
                    }}
                  />
                ))}
              {selectedRating !== "" && (
                <SearchFilterButton
                  register={register}
                  fieldName="selectedRating"
                  value={selectedRating}
                  selectedRating={selectedRating}
                  handleClick={() => {
                    setValue("selectedRating", "");
                    formSubmit();
                  }}
                />
              )}
              {hasVerifiedID && (
                <SearchFilterButton
                  register={register}
                  fieldName="hasVerifiedID"
                  label="ID Verified"
                  value={1}
                  handleClick={() => {
                    setValue("hasVerifiedID", false);
                    formSubmit();
                  }}
                />
              )}
              {hasDrivingLicense && (
                <SearchFilterButton
                  register={register}
                  fieldName="hasDrivingLicense"
                  label="Driving License"
                  value={1}
                  handleClick={() => {
                    setValue("hasDrivingLicense", false);
                    formSubmit();
                  }}
                />
              )}
            </div>
          )}
        </div>
        <small className="text-muted ps-3 mt-1">Click on the icon to select filters</small>
        {/* Sort by field */}
        <div className="mt-1">
          <label htmlFor="sortBy" className="visually-hidden">
            Sort By
          </label>
          <StyledSelect
            className="form-select input-rounded"
            register={register}
            fieldName="sortBy"
            onChange={formSubmit}
            options={{
              default: "Sort workers by...",
              name: "Name",
              role: "Role",
              rating: "Rating",
              reviewCount: "Review Count",
              jobsDone: "Jobs Done",
              location: "Location",
            }}
          />
        </div>
        {/* Buttons wrap */}
        <div className="form-btn-wrap d-flex gap-3 mt-3">
          <button type="submit" className="btn btn-primary rounded-4">
            Apply filters
          </button>
          <button
            type="button"
            className="btn btn-primary rounded-4"
            onClick={() => {
              reset();
              formSubmit();
            }}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
