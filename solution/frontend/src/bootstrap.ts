import "bootstrap";

import "react-datepicker/dist/react-datepicker.css";
import "./styles/main.css";

type FormElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | HTMLFieldSetElement
  | HTMLButtonElement;

// Bootstrap Form Validation
document.addEventListener("DOMContentLoaded", () => {
  // Fetch all the forms we want to apply custom Bootstrap validation styles to

  const forms = document.querySelectorAll<HTMLFormElement>(".needs-validation");

  // Loop over them and prevent submission
  forms.forEach((form) => {
    [...form.elements].forEach((element) => addOnInputValidation(element.id));

    form.addEventListener("submit", (event) => {
      validateEmailUsername("email_username");

      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();

        // Update invalidation message for each input on submit
        [...form.elements].forEach((element) => validateInput(element.id));
      }

      form.classList.add("was-validated");
    });
  });
});

function validateInput(fieldID: string) {
  if (!fieldID) return;

  const field = document.querySelector<FormElement>(`#${fieldID}`);
  const fieldValidation = document.querySelector<HTMLDivElement>(`${fieldID}Validation`);

  if (!field || !fieldValidation) return;

  updateMessageField(field, fieldValidation);
}

function addOnInputValidation(fieldID: string) {
  if (!fieldID) return;

  const field = document.querySelector<FormElement>(`#${fieldID}`);
  const fieldValidation = document.querySelector<HTMLDivElement>(`${fieldID}Validation`);
  if (!field || !fieldValidation) return;

  field && field.addEventListener("input", () => updateMessageField(field, fieldValidation));
}

function updateMessageField(field: FormElement, fieldValidation: HTMLDivElement) {
  if (field.validationMessage) {
    fieldValidation.textContent = field.validationMessage;
  } else {
    fieldValidation.textContent = "";
    field.setCustomValidity("");
  }
}

function validateEmailUsername(fieldID: string) {
  const field = document.querySelector<HTMLInputElement>(`#${fieldID}`);
  const fieldValidation = document.querySelector<HTMLDivElement>(`${fieldID}Validation`);

  const emailRegExp =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gim;
  const userRegExp = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gim;

  if (field && fieldValidation) {
    if (field.value.includes("@") && !emailRegExp.test(field.value)) {
      field.setCustomValidity("Enter a valid email address.");
    } else if (!userRegExp.test(field.value)) {
      field.setCustomValidity("Enter a valid username.");
    }
  }
}
