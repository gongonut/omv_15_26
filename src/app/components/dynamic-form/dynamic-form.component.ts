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
import { MatInputModule } from '@angular/material/input';
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
  style?: any;
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
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIcon, MatCheckbox],
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
    debugger;
    const jsonChanged = !!changes['jsonFormData'];
    const resetTriggered = !!changes['reset'] && !changes['reset'].firstChange;
    const valuesChanged = !!changes['values'] && !changes['values'].firstChange;

    // Recreamos el formulario si cambia la estructura (jsonFormData) o si se pide un reset
    if (jsonChanged || resetTriggered) {
      if (this.jsonFormData && this.jsonFormData.controls) {
        this.createForm(this.jsonFormData.controls, this.values);
      }
    } 
    // Si solo cambian los valores y el formulario ya existe, actualizamos los campos
    else if (valuesChanged) {
      this.editValues(this.values);
    }
    this.onSetData();
  }

  private editValues(values: any) {
    this.dynaForm.patchValue(values);
  }

  private createForm(controls: JsonFormControl[], reset: any = null) {
    // Limpiamos los controles actuales para evitar duplicados al recrear
    Object.keys(this.dynaForm.controls).forEach(key => {
      this.dynaForm.removeControl(key);
    });

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

      
      if (reset && reset[control.name] !== undefined) {
        control.avalue = reset[control.name];
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
