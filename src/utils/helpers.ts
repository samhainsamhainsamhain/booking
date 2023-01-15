import { categories } from "src/constants";

export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const selectOptions = categories.map((category) => ({
  value: category,
  label: capitalize(category),
}));
