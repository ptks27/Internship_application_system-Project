const BASE_URL =
  window.location.protocol === "https:"
    ? "https://thetraineepj.in.th/api/v1"
    : "http://localhost:9000/api/v1";

const USER_API_END_POINT = `${BASE_URL}/user`;
export const JOB_ALL_API = `${BASE_URL}/job`;
export const COMPANY_ALL_API = `${BASE_URL}/company`;
export const Application_API = `${BASE_URL}/application`;
export const NOTIFICATION_API = `${BASE_URL}/notifications`;

export { USER_API_END_POINT };
