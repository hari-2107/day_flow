// constants/fields.js
// Every fixed dropdown / enum value referenced in the requirements doc,
// in one place. Import this both on the backend (for validation) and
// send it to the frontend (for populating <select> options) so the two
// never drift out of sync.

// 3.1 Sign Up - Role
const ROLES = {
  ADMIN: "admin",     // HR Officer
  EMPLOYEE: "employee",
};

// 3.4.1 Attendance status types
const ATTENDANCE_STATUS = {
  PRESENT: "present",
  ABSENT: "absent",
  HALF_DAY: "half-day",
  LEAVE: "leave",
};

// 3.5.1 Leave type
const LEAVE_TYPE = {
  PAID: "paid",
  SICK: "sick",
  UNPAID: "unpaid",
};

// 3.5.1 / 3.5.2 Leave request status
const LEAVE_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

// 3.3.1 Employment type (job details)
const EMPLOYMENT_TYPE = {
  FULL_TIME: "full-time",
  PART_TIME: "part-time",
  CONTRACT: "contract",
  INTERN: "intern",
};

// 3.3.1 Gender (personal details) — free text is also accepted in the DB;
// these are just the suggested dropdown options
const GENDER_OPTIONS = ["male", "female", "other", "prefer-not-to-say"];

// 3.3.1 Document types (for the documents table)
const DOCUMENT_TYPES = {
  ID_PROOF: "id_proof",
  ADDRESS_PROOF: "address_proof",
  RESUME: "resume",
  OFFER_LETTER: "offer_letter",
  EDUCATION_CERTIFICATE: "education_certificate",
  OTHER: "other",
};

// Helper: turn any of the objects above into [{ value, label }] for a
// frontend <select>, e.g. toOptions(LEAVE_TYPE) ->
// [{ value: "paid", label: "Paid" }, { value: "sick", label: "Sick" }, ...]
function toOptions(enumObject) {
  return Object.values(enumObject).map((value) => ({
    value,
    label: value
      .split(/[-_]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
  }));
}

module.exports = {
  ROLES,
  ATTENDANCE_STATUS,
  LEAVE_TYPE,
  LEAVE_STATUS,
  EMPLOYMENT_TYPE,
  GENDER_OPTIONS,
  DOCUMENT_TYPES,
  toOptions,
};
