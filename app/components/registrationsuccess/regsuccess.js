export default function RegSuccess(user) {
  sessionStorage.setItem("currentUser", JSON.stringify(user));
}
