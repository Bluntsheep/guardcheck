import ResetPasswordClient from "./ResetPasswordClient";

export default function ResetPasswordPage({ searchParams }) {
  const token = searchParams?.token || ""; // get token from URL
  return <ResetPasswordClient token={token} />;
}
