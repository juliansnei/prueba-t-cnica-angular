import { ValidatorFn } from "@angular/forms";

export interface FormModel {
    key: string;
  label: string;
  type: 'text' | 'email' | 'dropdown' | 'calendar' | 'textarea';
  validator?: ValidatorFn[];
  options?: { label: string; value: any }[];
}