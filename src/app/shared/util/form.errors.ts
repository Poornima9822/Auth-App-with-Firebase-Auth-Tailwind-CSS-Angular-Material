import { AbstractControl } from "@angular/forms";

export class FormValidationError {
  static getFormControlErrorMessage(
    ctrl : AbstractControl,
    name : string
  ): string {
    const capitalizeName = name.charAt(0).toUpperCase() + name.slice(1);
    if (ctrl.hasError('required')) {
      return `${capitalizeName} is required!`;
    } else if (ctrl.hasError('email')) {
      return `${capitalizeName} is not a valid mail`;
    } else if (ctrl.hasError('minlength')) {
      return `${capitalizeName} must be atleast ${ctrl.getError('minlength').requiredLength} characters long`;
    } else if (ctrl.hasError('maxlength')) {
      return `${capitalizeName} must be at most ${ctrl.getError('maxlength').requiredLength} characters long`;
    }else {
        return `${capitalizeName} has error`
    }

  }
}