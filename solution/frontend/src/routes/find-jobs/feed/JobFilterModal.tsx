import { Container, Modal, Spinner } from "react-bootstrap";

import { useQuery } from "@tanstack/react-query";
import { SubmitHandler, useFormContext, useWatch } from "react-hook-form";
import InputTextTags from "../../../components/InputTextTags";
import { TStateHook } from "../../../utils/utils";
import { TJobSearchForm } from "./JobSearch";
import axios from "axios";
import { z } from "zod";

// *** data fetch ***
const jobDataSchema = z.object({
  job_types: z.array(z.string()),
  shifts: z.array(z.string()),
  days_schedule: z.array(z.string()),
  tags: z.array(z.string()),
});

const jobDataQuery = {
  queryKey: ["jobData"],
  queryFn: async () => {
    const { data } = await axios.get("solution-api/job-data");
    return jobDataSchema.parse(data);
  },
};

// *** BS Modal ***
interface TModalProps {
  showModal: boolean;
  setShowModal: TStateHook<boolean>;
  setFiltersApplied: TStateHook<boolean>;
  children?: React.ReactNode;
}

function ModalBlueprint({ showModal, setShowModal, setFiltersApplied, children }: TModalProps) {
  return (
    <Modal
      id="search-modal"
      show={showModal}
      onHide={() => setShowModal(false)}
      onShow={() => setFiltersApplied(false)}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton className="p-2 px-3">
        <Modal.Title>Filters</Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-0 pt-3">
        <Container className="d-flex flex-column align-items-center">{children}</Container>
      </Modal.Body>
      <Modal.Footer className="justify-content-center p-0">
        <button type="submit" form="modal-filter-form" className="btn flex-grow-1 m-0">
          Apply Filters
        </button>
      </Modal.Footer>
    </Modal>
  );
}

// *** Component ***
interface TProps extends TModalProps {
  formSubmit: () => void | undefined;
}

export default function JobFilterModal({
  showModal,
  setShowModal,
  setFiltersApplied,
  formSubmit,
}: TProps) {
  const { data, error, isLoading, isError } = useQuery({ ...jobDataQuery });

  const { register, getValues, handleSubmit, control } = useFormContext<TJobSearchForm>();

  const { typesSelected, scheduleSelected, shiftsSelected, tagsSelected } = {
    ...useWatch({ control }),
    ...getValues(),
  };

  // Handlers
  const handleFormSubmit: SubmitHandler<TJobSearchForm> = () => {
    setFiltersApplied(true);
    setShowModal(false);
    formSubmit();
  };

  const modalProps = { showModal, setShowModal, setFiltersApplied };

  if (isLoading) {
    return (
      <ModalBlueprint {...modalProps}>
        <Spinner animation="border" role="status" className="custom-spinner mb-3">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </ModalBlueprint>
    );
  }

  if (isError) {
    console.log(error);
    return <ModalBlueprint {...modalProps}>Something went wrong!</ModalBlueprint>;
  }

  const { job_types: jobTypes, shifts, days_schedule: schedule, tags } = data;

  return (
    <ModalBlueprint {...modalProps}>
      <form id="modal-filter-form" className="w-100" onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Job Types */}
        <InputTextTags
          title="Job Types"
          register={register}
          fieldName="typesSelected"
          tags={jobTypes}
          selectedTags={typesSelected}
        />
        {/* Work Shifts */}
        <InputTextTags
          title="Work Shifts"
          register={register}
          fieldName="shiftsSelected"
          tags={shifts}
          selectedTags={shiftsSelected}
        />
        {/* Schedule */}
        <InputTextTags
          title="Schedule"
          register={register}
          fieldName="scheduleSelected"
          tags={schedule}
          selectedTags={scheduleSelected}
        />
        {/* Tags*/}
        <InputTextTags
          title="Extra"
          register={register}
          fieldName="tagsSelected"
          tags={tags}
          selectedTags={tagsSelected}
        />
      </form>
    </ModalBlueprint>
  );
}
