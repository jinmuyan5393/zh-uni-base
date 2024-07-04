export interface IOption {
  label: string;
  value: stringOrnumber;
}
export type stringOrnumber = string | number | undefined;
export interface IProp {
  modelValue: stringOrnumber;
  optionList: IOption[];
  multiple?: boolean;
}
