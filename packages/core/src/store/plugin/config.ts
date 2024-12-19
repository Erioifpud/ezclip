interface BaseField {
  label: string;
  name: string;
  required?: boolean;
  validator?: (value: any) => boolean | string;
}

interface TextField extends BaseField {
  type: 'text';
  defaultValue?: string;
  props?: {
    placeholder?: string;
    maxLength?: number;
    minLength?: number;
  };
}

interface NumberField extends BaseField {
  type: 'number';
  defaultValue?: number;
  props?: {
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
  };
}

interface SelectField extends BaseField {
  type: 'select';
  defaultValue?: any;
  options: Array<{
    label: string;
    value: any;
  }>;
  props?: {
    multiple?: boolean;
    searchable?: boolean;
  };
}

interface SwitchField extends BaseField {
  type: 'switch';
  defaultValue?: boolean;
}

export type PluginFormField = 
  | TextField 
  | NumberField 
  | SelectField 
  | SwitchField;