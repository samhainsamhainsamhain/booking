import { FC, useState } from "react";
import ReactCalendar from "react-calendar";
import { add, format } from "date-fns";
import { CLOSING_HOUR, INTERVAL, OPENING_HOUR } from "../../constants";

type indexProps = {};

type BookingType = {
  bookingDate: Date | null;
  bookingTime: Date | null;
};

const index: FC<indexProps> = ({}: indexProps) => {
  const [date, setDate] = useState<BookingType>({
    bookingDate: null,
    bookingTime: null,
  });

  function getBookingTimes() {
    if (!date.bookingDate) return;

    const { bookingDate } = date;

    const openTime = add(bookingDate, { hours: OPENING_HOUR });
    const closeTime = add(bookingDate, { hours: CLOSING_HOUR });
    const interval = INTERVAL;

    const bookingTimes = [];
    for (let i = openTime; i <= closeTime; i = add(i, { minutes: interval })) {
      bookingTimes.push(i);
    }

    return bookingTimes;
  }

  const times = getBookingTimes();

  function chooseBookingDate(date: Date) {
    setDate((prev) => ({ ...prev, bookingDate: date }));
  }

  function chooseBookingTime(time: Date) {
    console.log(time);

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
          onClickDay={chooseBookingDate}
          minDate={new Date()}
          locale="en-GB"
        />
      )}
    </div>
  );
};

export default index;
