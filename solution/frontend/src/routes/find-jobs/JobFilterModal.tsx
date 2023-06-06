import { Container, Modal } from "react-bootstrap";

import { SubmitHandler, useFormContext, useWatch } from "react-hook-form";
import InputTextTags from "../../components/InputTextTags";
import { StateHookType } from "../../utils/utils";
import { JobSearchForm } from "./JobSearch";
import { useRouteLoaderData } from "react-router-dom";
import { FindJobsLoaderData } from "./find-jobs";

type Props = {
  showModal: boolean;
  setShowModal: StateHookType<boolean>;
  setFiltersApplied: StateHookType<boolean>;
  formSubmit: () => void | undefined;
};

export default function JobFilterModal({ showModal, setShowModal, setFiltersApplied, formSubmit }: Props) {
  const { availableJobTypes, availableTags, availableSchedule, availableShifts } = useRouteLoaderData(
    "find-jobs"
  ) as FindJobsLoaderData;

  const { register, getValues, handleSubmit, control } = useFormContext<JobSearchForm>();

  const { typesSelected, scheduleSelected, shiftsSelected, tagsSelected } = {
    ...useWatch({ control }),
    ...getValues(),
  };

  // Handlers
  const handleFormSubmit: SubmitHandler<JobSearchForm> = () => {
    setFiltersApplied(true);
    setShowModal(false);
    formSubmit();
  };

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
        <Container className="d-flex flex-column align-items-center">
          <form id="modal-filter-form" className="w-100" onSubmit={handleSubmit(handleFormSubmit)}>
            {/* Job Types */}
            <InputTextTags
              title="Job Types"
              register={register}
              fieldName="typesSelected"
              tags={availableJobTypes}
              selectedTags={typesSelected}
            />
            {/* Work Shifts */}
            <InputTextTags
              title="Work Shifts"
              register={register}
              fieldName="shiftsSelected"
              tags={availableShifts}
              selectedTags={shiftsSelected}
            />
            {/* Schedule */}
            <InputTextTags
              title="Schedule"
              register={register}
              fieldName="scheduleSelected"
              tags={availableSchedule}
              selectedTags={scheduleSelected}
            />
            {/* Tags*/}
            <InputTextTags
              title="Extra"
              register={register}
              fieldName="tagsSelected"
              tags={availableTags}
              selectedTags={tagsSelected}
            />
          </form>
        </Container>
      </Modal.Body>
      <Modal.Footer className="justify-content-center p-0">
        <button type="submit" form="modal-filter-form" className="btn flex-grow-1 m-0">
          Apply Filters
        </button>
      </Modal.Footer>
    </Modal>
  );
}
