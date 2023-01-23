import {
  add,
  addMinutes,
  getHours,
  getMinutes,
  isBefore,
  isEqual,
  parse,
} from "date-fns";
import { categories, INTERVAL, now } from "src/constants";
import { Day } from "@prisma/client";

export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const selectOptions = categories.map((category) => ({
  value: category,
  label: capitalize(category),
}));

export const weekdayIndexToName = (index: number) => {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return days[index];
};

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function roundUpToNearestMinutes(date: Date, interval: number) {
  const minutesLeftUntilNextInterval = interval - (getMinutes(date) % interval);
  return addMinutes(date, minutesLeftUntilNextInterval);
}

export function getOpeningTimes(startDate: Date, dbDays: Day[]) {
  const dayOfWeek = startDate.getDay();
  const isToday = isEqual(
    startDate,
    new Date("January 15, 2023, 12:00:00").setHours(0, 0, 0, 0)
  );

  const today = dbDays.find((day) => day.dayOfWeek === dayOfWeek);
  if (!today) throw new Error("This day does not exist in the database");

  const openingTime = parse(today.openTime, "kk:mm", startDate);
  const closingTime = parse(today.closeTime, "kk:mm", startDate);

  let hours: number, minutes: number;

  if (isToday) {
    const rounded = roundUpToNearestMinutes(now, INTERVAL);
    const tooLate = !isBefore(rounded, closingTime);
    if (tooLate) throw new Error("No more bookings today");
    console.log("rounded", rounded);

    const isBeforeOpening = isBefore(rounded, openingTime);

    hours = getHours(isBeforeOpening ? openingTime : rounded);
    minutes = getMinutes(isBeforeOpening ? openingTime : rounded);
  } else {
    hours = getHours(openingTime);
    minutes = getMinutes(openingTime);
  }

  const beginning = add(startDate, { hours, minutes });
  const end = add(startDate, { hours: getHours(closingTime) });
  const interval = INTERVAL;

  const times = [];
  for (let i = beginning; i <= end; i = add(i, { minutes: interval })) {
    times.push(i);
  }

  return times;
}
