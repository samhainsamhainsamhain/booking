import { FC, useState } from "react";
import ReactCalendar, { DateCallback } from "react-calendar";

type indexProps = {};

type DateType = {
  date: Date | null;
  dateTime: Date | null;
};

const index: FC<indexProps> = ({}: indexProps) => {
  const [date, setDate] = useState<DateType>({
    date: null,
    dateTime: null,
  });

  function chooseDate(date: Date) {
    setDate((prev) => ({ ...prev, dateTime: date }));
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      {date.date ? (
        <div>time component</div>
      ) : (
        <ReactCalendar
          className="REACT-CALENDAR p-2"
          view="month"
          onClickDay={chooseDate}
          minDate={new Date()}
          locale="en-GB"
        />
      )}
    </div>
  );
};

export default index;
