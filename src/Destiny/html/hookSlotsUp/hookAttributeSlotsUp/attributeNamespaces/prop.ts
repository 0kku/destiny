import { IValueProps } from "../../_hookSlotsUp.js";
import { kebabToCamel } from "../../../../utils/kebabToCamel.js";

/**
 * prop:<PropertyName> takes in any property and assigns it to
 * the element in JS.
 * 
 * Note that property names need to use kebab-case because HTML
 * is case-insensitive. The library will automatically convert
 * properties to camelCase. For example, to assign a Date object
 * to a date input (input.valueAsDate = new Date), you can do:
 * 
 *    <inpyt type=date prop:value-as-date=${new Date}>
 */
export const prop = (
  {
    element,
    attributeName,
    valueStart,
    valueSlot,
    valueEnd,
  }: IValueProps,
) => {
  const value = (
    valueStart || valueEnd
    ? `${valueStart}${valueSlot}${valueEnd}`
    : valueSlot
  );
  //@ts-ignore TODO gotta figure out later if this can be resolved properly by TS lol.
  element[kebabToCamel(attributeName)] = value;
};
