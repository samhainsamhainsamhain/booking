import { format, formatISO, isBefore, parse } from "date-fns";
import { FC, useEffect, useState } from "react";
import ReactCalendar from "react-calendar";
import { useRouter } from "next/router";

import { Day } from "@prisma/client";
import { DateTime } from "@types";

import { getOpeningTimes, roundUpToNearestMinutes } from "src/utils/helpers";
import { INTERVAL, now } from "../constants";

type CalendarProps = {
  days: Day[];
  closedDays: string[];
};

const Calendar: FC<CalendarProps> = ({ days, closedDays }) => {
  const router = useRouter();

  const today = days.find((day) => day.dayOfWeek === now.getDay());
  const rounded = roundUpToNearestMinutes(now, INTERVAL);
  const closing = parse(today!.closeTime, "kk:mm", now);
  const tooLate = !isBefore(rounded, closing);
  if (tooLate) closedDays.push(formatISO(new Date().setHours(0, 0, 0, 0)));

  const [date, setDate] = useState<DateTime>({
    bookingDate: null,
    bookingTime: null,
  });

  useEffect(() => {
    if (date.bookingTime) {
      localStorage.setItem("selectedTime", date.bookingTime.toISOString());
      router.push("/menu");
    }
  }, [date.bookingTime]);

  const times = date.bookingDate && getOpeningTimes(date.bookingDate, days);

  function chooseBookingDate(date: Date) {
    setDate((prev) => ({ ...prev, bookingDate: date }));
  }

  function chooseBookingTime(time: Date) {
    setDate((prev) => ({ ...prev, bookingTime: time }));
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {date.bookingDate ? (
        <div className="flex flex-row items-center justify-center">
          {times?.map((time, i) => (
            <div className="m-2 rounded-xl bg-cyan-400 p-2" key={`time-${i}`}>
              <button onClick={() => chooseBookingTime(time)}>
                {format(time, "kk:mm")}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <ReactCalendar
          className="REACT-CALENDAR p-2"
          view="month"
          tileDisabled={({ date }) => closedDays.includes(formatISO(date))}
          onClickDay={chooseBookingDate}
          minDate={new Date()}
          locale="en-GB"
        />
      )}
    </div>
  );
};

export default Calendar;
