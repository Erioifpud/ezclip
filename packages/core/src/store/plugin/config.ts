interface BaseField<T> {
  label: string;
  name: string;
  required?: boolean;
  description?: string;
  validator?: (value: T) => boolean | string;
}

interface TextField extends BaseField<string> {
  type: 'text';
  defaultValue?: string;
  props?: {
    placeholder?: string;
    maxLength?: number;
    minLength?: number;
  };
}

interface TextareaField extends BaseField<string> {
  type: 'textarea';
  defaultValue?: string;
  props?: {
    placeholder?: string;
    maxLength?: number;
    minLength?: number;
    rows?: number;
  };
}

interface NumberField extends BaseField<number> {
  type: 'number';
  defaultValue?: number;
  props?: {
    placeholder?: string;
    min?: number;
    max?: number;
  };
}

interface SliderField extends BaseField<number> {
  type: 'slider';
  defaultValue?: number;
  props?: {
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
  };
}

interface SelectField extends BaseField<string> {
  type: 'select';
  defaultValue?: string;
  options: Array<{
    label: string;
    value: any;
  }>;
  props?: {
    placeholder?: string;
  };
}

interface SwitchField extends BaseField<boolean> {
  type: 'switch';
  defaultValue?: boolean;
}

interface DateField extends BaseField<string> {
  type: 'date';
  defaultValue?: string;
}

interface ColorField extends BaseField<string> {
  type: 'color';
  defaultValue?: string;
}

interface ListField extends BaseField<Array<string>> {
  type: 'list';
  defaultValue?: Array<string>;
  props?: {
    placeholder?: string;
    // 字符数限制
    minLength?: number;
    maxLength?: number;
    // 数组长度限制
    min?: number;
    max?: number;
  };
}

export type PluginFormField =
  | TextField
  | NumberField
  | SelectField
  | SwitchField
  | SliderField
  | ListField
  | TextareaField
  | DateField
  | ColorField;

type TypeMap = {
  text: string;
  number: number;
  select: string;
  switch: boolean;
  slider: number;
  list: string[];
  textarea: string;
  date: string;
  color: string;
};

export type FormValueType<T extends readonly PluginFormField[]> = {
  [K in T[number]['name']]: Extract<T[number], { name: K }>['type'] extends keyof TypeMap
    ? TypeMap[Extract<T[number], { name: K }>['type']]
    : never;
}