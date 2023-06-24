import { Container, Modal } from "react-bootstrap";

import { forwardRef, useImperativeHandle, useState } from "react";
import { SubmitHandler, useFormContext, useWatch } from "react-hook-form";
import InputBoolTags from "../../components/InputBoolTags";
import InputRatingTags from "../../components/InputRatingTags";
import InputTextTags from "../../components/InputTextTags";
import type { JobRoles } from "../Root";
import type { StateHookType } from "../../utils/utils";
import type { WorkersSearchForm } from "./WorkerSearch";

type Props = {
  setFiltersApplied: StateHookType<boolean>;
  formSubmit: () => void | undefined;
  roles: JobRoles;
};

export type WorkerFilterModalRef = {
  showModal: () => void;
};

const WorkerFilterModal = forwardRef<WorkerFilterModalRef, Props>(
  ({ setFiltersApplied, formSubmit, roles }, ref) => {
    const { register, handleSubmit, control, getValues } = useFormContext<WorkersSearchForm>();

    const { selectedRoles, selectedRating, hasVerifiedID, hasDrivingLicense } = {
      ...useWatch({ control }),
      ...getValues(),
    };

    const [showModal, setShowModal] = useState(false);

    // Just for fun, modal control should use prop
    // https://react.dev/reference/react/useImperativeHandle
    useImperativeHandle(ref, () => {
      return {
        showModal: () => setShowModal(true),
      };
    });

    // Handlers
    const handleFormSubmit: SubmitHandler<WorkersSearchForm> = () => {
      setFiltersApplied(true);
      setShowModal(false);
      formSubmit();
    };

    return (
      <Modal
        ref={ref}
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
        <Modal.Body>
          <Container className="d-flex flex-column align-items-center">
            <form
              id="modal-filter-form"
              className="w-100"
              onSubmit={handleSubmit(handleFormSubmit)}
            >
              <InputTextTags
                title="Job Types"
                register={register}
                fieldName="selectedRoles"
                tags={roles}
                selectedTags={selectedRoles}
              />
              <InputRatingTags
                title="Rating"
                register={register}
                fieldName="selectedRating"
                selectedTag={selectedRating}
              />
              <InputBoolTags
                title="Others"
                register={register}
                fieldNames={["Verified ID", "Driving License"]}
                tags={["hasVerifiedID", "hasDrivingLicense"]}
                selectedTags={[hasVerifiedID, hasDrivingLicense]}
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
);
WorkerFilterModal.displayName = "WorkerFilterModal";

export default WorkerFilterModal;
