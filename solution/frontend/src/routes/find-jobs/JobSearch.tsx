import { formatISO, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import CurrencyInput from "react-currency-input-field";
import ReactDatePicker from "react-datepicker";
import { Controller, FormProvider, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { BsFilter } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";
import InputFilterTextTags from "../../components/InputFilterTextTags";
import StyledSelect from "../../components/StyledSelect";
import ClockIcon from "../../icons/ClockIcon";
import CloseIcon from "../../icons/CloseIcon";
import SearchIcon from "../../icons/SearchIcon";
import { FindJobsQuery } from "../../queries/findJobsQuery";
import { StateHookType } from "../../utils/utils";
import JobFilterModal from "./JobFilterModal";

export type JobSearchForm = {
  jobSearch?: string;
  scheduleFrom?: Date;
  scheduleTo?: Date;
  salaryMin?: string;
  salaryMax?: string;
  typesSelected: string[];
  shiftsSelected: string[];
  scheduleSelected: string[];
  tagsSelected: string[];
  sortBy: "default" | "title" | "location" | "salary" | "datePosted";
};

type TargetForm = {
  [prop in keyof JobSearchForm]: HTMLInputElement | HTMLSelectElement;
} & HTMLFormElement;

function getMinutesFromISO(date: Date | string) {
  // ISO time is in the format '19:00:52Z'
  const isoTime =
    typeof date === "string"
      ? formatISO(parseISO(date), { representation: "time" })
      : formatISO(date, { representation: "time" });

  const [hour, min] = isoTime.split(":");
  return parseInt(hour, 10) * 60 + parseInt(min, 10);
}

function checkTime(scheduleStart: string, scheduleEnd: string, selectedStart?: Date, selectedEnd?: Date) {
  const scheduleStartMin = getMinutesFromISO(scheduleStart);
  const scheduleEndMin = getMinutesFromISO(scheduleEnd);

  if (selectedStart) {
    const selectedStartMin = getMinutesFromISO(selectedStart);

    return scheduleStartMin <= selectedStartMin;
  }

  if (selectedEnd) {
    const selectedEndMin = getMinutesFromISO(selectedEnd);

    return scheduleEndMin >= selectedEndMin;
  }

  if (selectedStart && selectedEnd) {
    const selectedStartMin = getMinutesFromISO(selectedStart);
    const selectedEndMin = getMinutesFromISO(selectedEnd);

    return scheduleStartMin <= selectedStartMin && scheduleEndMin >= selectedEndMin;
  }
}

type Props = {
  setFilteredJobs: StateHookType<FindJobsQuery["jobs"]>;
  jobs: FindJobsQuery["jobs"];
};

export default function JobSearch({ setFilteredJobs, jobs }: Props) {
  // RHF
  const formMethods = useForm<JobSearchForm>({
    defaultValues: {
      jobSearch: "",
      salaryMin: "",
      salaryMax: "",
      typesSelected: [],
      shiftsSelected: [],
      scheduleSelected: [],
      tagsSelected: [],
      sortBy: "default",
    },
  });

  const [, setSearchParams] = useSearchParams();

  const { register, reset, control, handleSubmit, resetField, getValues } = formMethods;

  const { jobSearch } = { ...useWatch({ control }), ...getValues() };

  // State
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const formEl = useRef<HTMLFormElement>(null);

  // Effects
  useEffect(() => {
    // Debounced search field
    const timer = setTimeout(() => {
      formSubmit();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [jobSearch]);

  // Functions
  const formSubmit = () => formEl.current?.requestSubmit();

  const handleFormSubmit: SubmitHandler<JobSearchForm> = (
    data,
    e: React.BaseSyntheticEvent<object, unknown, TargetForm> | undefined
  ) => {
    let selectedJobs = jobs;

    if (data.jobSearch) {
      const param = data.jobSearch.toLowerCase();

      selectedJobs = selectedJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(param) ||
          job.description.toLowerCase().includes(param) ||
          job.location.toLowerCase().includes(param) ||
          (job.responsibilities && job.responsibilities.some((r) => r.toLowerCase().includes(param))) ||
          (job.qualifications && job.qualifications.some((r) => r.toLowerCase().includes(param)))
      );
    }

    if (data.typesSelected.length) {
      selectedJobs = selectedJobs.filter((job) =>
        job.types.some((jobType) => data.typesSelected.includes(jobType))
      );
    }

    if (data.shiftsSelected.length) {
      selectedJobs = selectedJobs.filter((job) =>
        job.shifts.some((shift) => data.shiftsSelected.includes(shift))
      );
    }

    if (data.tagsSelected.length) {
      selectedJobs = selectedJobs.filter((job) => job.tags?.some((tag) => data.tagsSelected.includes(tag)));
    }

    // Salary filter
    if (data.salaryMin && !data.salaryMax) {
      const salaryMin = parseInt(data.salaryMin.replace(".", "").replace(",", "."), 10);

      selectedJobs = selectedJobs.filter((job) =>
        job.salaryRange?.min ? job.salaryRange.min >= salaryMin : true
      );
    } else if (!data.salaryMin && data.salaryMax) {
      const salaryMax = parseInt(data.salaryMax.replace(".", "").replace(",", "."), 10);

      selectedJobs = selectedJobs.filter((job) =>
        job.salaryRange?.max ? job.salaryRange.max <= salaryMax : true
      );
    } else if (data.salaryMin && data.salaryMax) {
      const salaryMin = parseInt(data.salaryMin.replace(".", "").replace(",", "."), 10);
      const salaryMax = parseInt(data.salaryMax.replace(".", "").replace(",", "."), 10);

      selectedJobs = selectedJobs.filter((job) =>
        job.salaryRange?.max && job.salaryRange.min
          ? job.salaryRange.min >= salaryMin && job.salaryRange.max <= salaryMax
          : true
      );
    }

    // Schedule filter
    if (data.scheduleFrom && !data.scheduleTo) {
      selectedJobs = selectedJobs.filter((job) =>
        job.workSchedules?.length
          ? job.workSchedules?.some((item) => checkTime(item.from, item.to, data.scheduleFrom))
          : true
      );
    } else if (!data.scheduleFrom && data.scheduleTo) {
      selectedJobs = selectedJobs.filter((job) =>
        job.workSchedules?.length
          ? job.workSchedules?.some((item) => checkTime(item.from, item.to, data.scheduleTo))
          : true
      );
    } else if (data.scheduleFrom && data.scheduleTo) {
      selectedJobs = selectedJobs.filter((job) =>
        job.workSchedules?.length
          ? job.workSchedules?.some((item) =>
              checkTime(item.from, item.to, data.scheduleFrom, data.scheduleTo)
            )
          : true
      );
    }

    setFilteredJobs(selectedJobs);

    // Update URL
    const queryString = new URLSearchParams();
    for (const [key, value] of new FormData(e?.target).entries()) {
      if (!value || value === "default") continue;
      queryString.append(key, typeof value === "string" ? value : value.name);
    }

    setSearchParams(queryString);
  };

  return (
    <>
      <FormProvider {...formMethods}>
        <JobFilterModal {...{ showModal, setShowModal, formSubmit, setFiltersApplied }} />
      </FormProvider>
      <form
        ref={formEl}
        className="d-flex flex-column align-items-stretch mb-4"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        {/* Search field */}
        <InputGroup className="search-group input-rounded mb-3">
          <InputGroup.Text id="searchIcon">
            <SearchIcon />
          </InputGroup.Text>
          <FormControl
            type="search"
            placeholder="Search"
            aria-describedby="searchIcon"
            aria-label="Search Jobs"
            {...register("jobSearch")}
          ></FormControl>
        </InputGroup>
        {/* Schedule */}
        <InputGroup as="div" className="flex-nowrap mb-3">
          <InputGroup.Text id="clockIcon">
            <ClockIcon />
          </InputGroup.Text>
          <InputGroup.Text className="flex-grow-1">
            <Controller
              control={control}
              name="scheduleFrom"
              render={({ field }) => (
                <ReactDatePicker
                  id="scheduleFrom"
                  selected={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  showPopperArrow={false}
                  className="form-control"
                  showTimeSelect
                  showTimeSelectOnly
                  dateFormat="HH:mm"
                  timeFormat="HH:mm"
                  timeCaption="From"
                  timeIntervals={60}
                  placeholderText="From"
                  ariaLabelClose="Close time picker"
                />
              )}
            />
            <button className="btn p-0 border-0 ms-1" onClick={() => resetField("scheduleFrom")}>
              <CloseIcon />
            </button>
          </InputGroup.Text>
          <InputGroup.Text className="flex-grow-1">
            <Controller
              control={control}
              name="scheduleTo"
              render={({ field }) => (
                <ReactDatePicker
                  id="scheduleTo"
                  selected={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  showPopperArrow={false}
                  className="form-control"
                  showTimeSelect
                  showTimeSelectOnly
                  dateFormat="HH:mm"
                  timeFormat="HH:mm"
                  timeCaption="To"
                  timeIntervals={60}
                  placeholderText="To"
                  ariaLabelClose="Close time picker"
                />
              )}
            />
            <button className="btn p-0 ms-1" onClick={() => resetField("scheduleTo")}>
              <CloseIcon />
            </button>
          </InputGroup.Text>
        </InputGroup>
        {/* <div className="input-group flex-nowrap mb-3"></div> */}
        {/* Salary */}
        <InputGroup className="mb-3">
          <InputGroup.Text>$</InputGroup.Text>
          <CurrencyInput
            className="form-control"
            groupSeparator="."
            decimalSeparator=","
            decimalsLimit={2}
            decimalScale={2}
            maxLength={10}
            step={1000}
            min={0}
            aria-label="Minimum salary"
            placeholder="Min Salary"
            {...register("salaryMin")}
          />
          <CurrencyInput
            className="form-control"
            groupSeparator="."
            decimalSeparator=","
            decimalsLimit={2}
            decimalScale={2}
            maxLength={10}
            step={1000}
            min={0}
            aria-label="Maximum salary"
            placeholder="Max Salary"
            {...register("salaryMax")}
          />
        </InputGroup>

        {/* Filter field */}
        <div className="filter-group d-flex">
          <button type="button" className="btn nowrap ps-3" onClick={() => setShowModal(true)}>
            <BsFilter className="heroicon" />
            <span className="d-inline-block ms-2 h-auto">Filters</span>
          </button>
          {filtersApplied && (
            <div className="d-flex flex-wrap align-items-center gap-2 p-1">
              <InputFilterTextTags
                formMethods={formMethods}
                fieldName="typesSelected"
                formSubmit={formSubmit}
              />
              <InputFilterTextTags
                formMethods={formMethods}
                fieldName="shiftsSelected"
                formSubmit={formSubmit}
              />
              <InputFilterTextTags
                formMethods={formMethods}
                fieldName="scheduleSelected"
                formSubmit={formSubmit}
              />
              <InputFilterTextTags
                formMethods={formMethods}
                fieldName="tagsSelected"
                formSubmit={formSubmit}
              />
            </div>
          )}
        </div>
        <small className="text-muted ps-3 mb-2 mt-1">Click on the icon to select filters</small>
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
              default: "Sort jobs by...",
              title: "Job Title",
              location: "Location",
              salary: "Salary",
              datePosted: "Date posted",
            }}
          />
        </div>
        {/* Buttons wrap */}
        <div className="form-btn-wrap d-flex gap-3 mt-3">
          <Button type="submit" variant="primary" className="rounded-pill flex-grow-1">
            Apply Filters
          </Button>
          <Button
            type="button"
            variant="primary"
            className="rounded-pill flex-grow-1"
            onClick={() => {
              reset();
              formSubmit();
            }}
          >
            Reset
          </Button>
        </div>
      </form>
    </>
  );
}
