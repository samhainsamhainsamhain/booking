import { categories } from "src/constants";

export type DateTime = {
  bookingDate: Date | null;
  bookingTime: Date | null;
};

export type Categories = (typeof categories)[number];
