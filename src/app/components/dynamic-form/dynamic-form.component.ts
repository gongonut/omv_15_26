import {
  Component,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';

interface JsonFormValidators {
  min?: number;
  max?: number;
  required?: boolean;
  email?: boolean;
  pattern?: string;
  nullValidator?: boolean;
}

export interface SelOptions {
  key: string,
  value?: any;
}

export interface JsonFormControl {
  name: string;
  label: string;
  type: string;
  description?: string;
  sideBtn?: string; // si type Link, ruta
  style?: {};
  default?: any;
  selectOptions?: SelOptions[];
  totalRows?: number;
  validators: JsonFormValidators;
  disabled?: boolean;
  avalue?: string;
  tags?: { [index: string]: any }; // Información adicional
}
export interface JsonFormData {
  controls?: JsonFormControl[];
}
@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatIcon, MatCheckbox],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnChanges {
  @Input() jsonFormData!: JsonFormData;
  @Input() values: any = {};
  @Input() editBtn: string = '';
  @Input() reset: number = 0;
  @Output() result = new EventEmitter<any>();
  // @Output() valid = new EventEmitter<boolean>();
  checBoxLists: { [key: string]: boolean } = {}
  public dynaForm: FormGroup = this.fb.group({});
  // private bckjsonFormData: JsonFormData = {};
  // private resultList!: any;
  // private keyValues!: SelOptions[];

  constructor(private fb: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges) {
    
    // console.log(changes);
    if (changes['reset'] && !changes['reset'].firstChange && this.jsonFormData && this.jsonFormData.controls) {
      const currentValues = changes['values'] ? changes['values'].currentValue : this.values;
      this.createForm(this.jsonFormData.controls, currentValues);
    } else if (changes['jsonFormData'] && !changes['jsonFormData'].firstChange
      && this.jsonFormData && this.jsonFormData.controls
      && changes['values'] && !changes['values'].firstChange) {
      this.createForm(this.jsonFormData.controls, changes['values'].currentValue);
    } else if (changes['values'] && !changes['values'].firstChange) {
      this.editValues(changes['values'].currentValue);
    } else {
      if (this.jsonFormData && this.jsonFormData.controls) { this.createForm(this.jsonFormData.controls, null); }
    }
    this.onSetData();
    /*
    if (!changes['jsonFormData'].firstChange) {
      this.createForm(this.jsonFormData.controls);
    }
    */
  }

  private editValues(values: any) {
    this.dynaForm.patchValue(values);
  }

  private createForm(controls: JsonFormControl[], reset: any = null) {

    const deleteList = { ...this.dynaForm.value };
    const resultList = reset ? reset : JSON.parse(JSON.stringify(this.dynaForm.value));
    // const resultList = JSON.parse(JSON.stringify(this.dynaForm.value));
    for (const key in deleteList) { this.dynaForm.removeControl(key); }

    for (const control of controls) {
      const validatorsToAdd = [];
      for (const [key, value] of Object.entries(control.validators)) {
        switch (key) {
          case 'min':
            validatorsToAdd.push(Validators.min(value));
            break;
          case 'max':
            validatorsToAdd.push(Validators.max(value));
            break;
          case 'required':
            if (value) {
              validatorsToAdd.push(Validators.required);
            }
            break;
          case 'email':
            if (value) {
              validatorsToAdd.push(Validators.email);
            }
            break;
          case 'pattern':
            validatorsToAdd.push(Validators.pattern(value));
            break;
          case 'nullValidator':
            if (value) {
              validatorsToAdd.push(Validators.nullValidator);
            }
            break;
          default:
            break;
        }
      }

      
      if (resultList[control.name] && resultList[control.name].length > 0) {
        control.avalue = resultList[control.name];
      } else {
        if (this.values && this.values[control.name] !== undefined) {
          control.avalue = this.values[control.name]
        } else if (control.default) {
          control.avalue = control.default
        } else { control.avalue = '' }
      }
      
      if (!this.dynaForm.contains(control.name)) {
        this.dynaForm.addControl(control.name, this.fb.control(control.avalue, validatorsToAdd));

        if (control.disabled === true) { this.dynaForm.controls[control.name].disable(); }

      }
    }
  }

  ongetStyleClass(control: JsonFormControl): any {
    
    if (control.style) return control.style;
    return {};
  }

  onGetRouterLink(control: JsonFormControl) {
    this.dynaForm.patchValue({ [control.name]: true });
  }

  onSetData() {
    this.result.emit({ ...this.dynaForm.getRawValue(), _valid_: this.dynaForm.valid });
  }

  onSubmit() {
  
  }

  getBoolState(name: string): boolean {

    return this.checBoxLists[name] || false;
  }

  setBoolState(event: any, name: string) {

    this.checBoxLists[name] = event.checked;
    this.onSetData();
  }

  onBtnClick(event: any, control: JsonFormControl) {
    this.dynaForm.patchValue({ _btnclick_: control.name });
    this.dynaForm.patchValue({ _btnEvent_: event });
    this.onSetData();
  }

  getIcon(control: JsonFormControl): string {
    let icon = '';
    if (control.sideBtn && control.sideBtn.length > 0) { icon = control.sideBtn }
    else if (this.editBtn && this.editBtn.length > 0) { icon = this.editBtn }
    return icon;
  }
}
