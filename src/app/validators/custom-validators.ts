import { FormControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  // whitespace validator
  static notOnlyWhitespace(control: FormControl): ValidationErrors {
    // check if field only has whitespace
    if (control.value != null && control.value.trim().length === 0) {
      // invalid return error object
      return { notOnlyWhitespace: true };
    } else {
      // valid, return null
      return null!;
    }
  }
}
