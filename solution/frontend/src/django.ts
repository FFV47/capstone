import axios from "axios";
type DjangoUserData = {
  username: string;
  authenticated: boolean;
  hasAccount: boolean;
};

export const djangoUserData = JSON.parse(
  document.getElementById("userData")?.textContent as string
) as DjangoUserData;

const csrftoken = document.querySelector<HTMLInputElement>("[name=csrfmiddlewaretoken]")?.value;

axios.defaults.headers.common["X-CSRFToken"] = csrftoken;

// try {
//   const data = await axios.get("solution-api/roles");
//   console.log(data);
// } catch (error) {
//   console.log(error);
// }

// try {
//   const data = await axios.post("solution-api/test", {
//     "name": "fernando",
//     "password": "1234",
//   });
//   console.log(data);
// } catch (error) {
//   console.log(error);
// }
