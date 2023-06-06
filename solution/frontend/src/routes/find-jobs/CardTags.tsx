import { format } from "date-fns";
import { Alert } from "react-bootstrap";
import { IoMdClock } from "react-icons/io";
import { IoPeopleSharp } from "react-icons/io5";
import BriefcaseIcon from "../../icons/BriefcaseIcon";
import ClockFillIcon from "../../icons/ClockFillIcon";
import ClockIcon from "../../icons/ClockIcon";
import CurrencyIcon from "../../icons/CurrencyIcon";
import InfoFillIcon from "../../icons/InfoFillIcon";
import { FindJobsQuery } from "../../queries/findJobsQuery";

type Props = {
  job: FindJobsQuery["jobs"][number];
  unwrapTags?: boolean;
};

export default function CardTags({ job, unwrapTags }: Props) {
  let allSchedules: string[] = [];

  job.workSchedules?.forEach((item) => (allSchedules = allSchedules?.concat(item.schedules)));

  const salaryPeriodSuffix = `a${job.salaryRange?.period === "hour" ? "n" : ""} ${job.salaryRange?.period}`;

  return (
    <>
      <div className={unwrapTags ? "" : "d-flex flex-wrap gap-2"}>
        {unwrapTags ? (
          <>
            {/* Job Types */}
            <div className="d-flex align-items-center">
              <BriefcaseIcon />
              <p className="h6 mb-0 ms-1">Job Type</p>
            </div>
            <div className="d-flex flex-wrap gap-2 mt-1">
              {job.types.map((jobType, i) => (
                <Alert key={i} variant="primary" className="job-card-tag">
                  {jobType}
                </Alert>
              ))}
            </div>

            {/* Shifts and Schedule */}
            <div className="d-flex align-items-center mt-2">
              <ClockIcon />
              <p className="h6 mb-0 ms-1">Shifts and Schedule</p>
            </div>
            <div className="d-flex flex-wrap gap-2 mt-1">
              {job.shifts.map((shift, i) => (
                <Alert key={i} variant="secondary" className="job-card-tag">
                  {shift}
                </Alert>
              ))}
              {job.workSchedules?.map((item) =>
                item.schedules.map((schedule, i) => (
                  <Alert key={i} variant="secondary" className="job-card-tag">
                    {schedule} from {format(new Date(item.from), "HH:mm")} to{" "}
                    {format(new Date(item.to), "HH:mm")}
                  </Alert>
                ))
              )}
            </div>

            {/* Job Types */}
            <div className="d-flex flex-wrap align-items-center mt-2">
              <CurrencyIcon />
              <p className="h6 mb-0 ms-1">Salary</p>
            </div>
            <Alert variant="success" className="d-inline-block job-card-tag mt-1">
              {job.salaryRange?.max
                ? `${job.salaryRange?.min} - ${job.salaryRange?.max} ${salaryPeriodSuffix}`
                : `${job.salaryRange?.min} ${salaryPeriodSuffix}`}
            </Alert>
          </>
        ) : (
          <>
            <Alert variant="primary" className="job-card-tag">
              <BriefcaseIcon />
              <span className="ms-1">
                {job.types.length > 1 ? `${job.types.at(0)} +${job.types.length - 1}` : job.types.at(0)}
              </span>
            </Alert>
            <Alert variant="secondary" className="job-card-tag">
              <ClockIcon />
              <span className="ms-1">
                {job.shifts.length > 1 ? `${job.shifts.at(0)} +${job.shifts.length - 1}` : job.shifts.at(0)}
              </span>
            </Alert>
            <Alert variant="secondary" className="job-card-tag">
              {job.tags?.includes("")}
              <IoMdClock className="heroicon" />
              <span className="ms-1">
                {allSchedules.length > 1
                  ? `${allSchedules.at(0)} +${allSchedules.length - 1}`
                  : allSchedules.at(0)}
              </span>
            </Alert>
            <Alert variant="success" className="job-card-tag">
              <CurrencyIcon />
              <span className="ms-1">
                {job.salaryRange?.max
                  ? `${job.salaryRange?.min} - ${job.salaryRange?.max} ${salaryPeriodSuffix}`
                  : `${job.salaryRange?.min} ${salaryPeriodSuffix}`}
              </span>
            </Alert>
          </>
        )}
      </div>
      <div className={`${unwrapTags ? "d-flex flex-wrap" : "border-bottom"} mt-2`}>
        {job.tags?.includes("Urgently hiring") && (
          <Alert variant="danger" className="job-card-tag extra-tag mb-1 ps-0">
            <ClockFillIcon />
            <span className="ms-1">Urgently hiring</span>
          </Alert>
        )}
        {job.tags?.includes("Temporary") && (
          <Alert variant="warning" className="job-card-tag extra-tag mb-1 ps-0">
            <InfoFillIcon />
            <span className="ms-1">Temporary</span>
          </Alert>
        )}
        {job.tags?.includes("Hiring multiple candidates") && (
          <Alert variant="info" className="job-card-tag extra-tag mb-1 ps-0">
            <IoPeopleSharp className="heroicon" />
            <span className="ms-1">Hiring multiple candidates</span>
          </Alert>
        )}
      </div>
    </>
  );
}
