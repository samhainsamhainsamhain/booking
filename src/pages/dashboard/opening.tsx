import { FC, useState } from "react";
import { prisma } from "../../server/db";
import { Day } from "@prisma/client";
import { now, weekdays } from "src/constants";
import { api } from "src/utils/api";
import toast, { Toaster } from "react-hot-toast";
import { formatISO } from "date-fns";
import Calendar from "react-calendar";
import { capitalize, weekdayIndexToName } from "src/utils/helpers";
import TimeSelector from "@components/TimeSelector";

type openingProps = {
  days: Day[];
};

export async function getServerSideProps() {
  const days = await prisma.day.findMany();

  if (!(days.length === 7)) throw new Error("Insert all days into database");

  return { props: { days } };
}

const opening: FC<openingProps> = ({ days }: openingProps) => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openingHours, setOpeningHours] = useState(getOpeningHours(days));

  const { mutate: saveOpeningHours, isLoading } =
    api.opening.changeOpeningHours.useMutation({
      onSuccess: () => toast.success("Opening hours saved"),
      onError: () => toast.error("Something went wrong"),
    });
  const { mutate: closeDay } = api.opening.closeDay.useMutation({
    onSuccess: () => refetch(),
  });
  const { mutate: openDay } = api.opening.openDay.useMutation({
    onSuccess: () => refetch(),
  });
  const { data: closedDays, refetch } = api.opening.getClosedDays.useQuery();

  const dayIsClosed =
    selectedDate && closedDays?.includes(formatISO(selectedDate));

  function _changeTime(day: Day) {
    return function (time: string, type: "openTime" | "closeTime") {
      const index = openingHours.findIndex(
        (x) => x.name === weekdayIndexToName(day.dayOfWeek)
      );
      const newOpeningHours = [...openingHours];
      newOpeningHours[index]![type] = time;
      setOpeningHours(newOpeningHours);
    };
  }

  return (
    <div className="mx-auto max-w-xl">
      <Toaster />
      <div className="mt-6 flex justify-center gap-6">
        <p className={`${!enabled ? "font-medium" : ""}`}>Opening times</p>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            value=""
            className="peer sr-only"
            onChange={() => setEnabled(!enabled)}
            checked={enabled}
          />
          <div className="dark:green-gray-500 peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600"></div>
        </label>
        <p className={`${enabled ? "font-medium" : ""}`}>Opening days</p>
      </div>

      {!enabled ? (
        // Opening times options
        <div className="my-12 flex flex-col gap-8">
          {days.map((day) => {
            const changeTime = _changeTime(day);
            return (
              <div className="grid grid-cols-3 place-items-center" key={day.id}>
                <h3 className="font-semibold">
                  {capitalize(weekdayIndexToName(day.dayOfWeek)!)}
                </h3>
                <div className="mx-4">
                  <TimeSelector
                    type="openTime"
                    changeTime={changeTime}
                    selected={
                      openingHours[
                        openingHours.findIndex(
                          (x) => x.name === weekdayIndexToName(day.dayOfWeek)
                        )
                      ]?.openTime
                    }
                  />
                </div>

                <div className="mx-4">
                  <TimeSelector
                    type="closeTime"
                    changeTime={changeTime}
                    selected={
                      openingHours[
                        openingHours.findIndex(
                          (x) => x.name === weekdayIndexToName(day.dayOfWeek)
                        )
                      ]?.closeTime
                    }
                  />
                </div>
              </div>
            );
          })}

          <button
            onClick={() => {
              const withId = openingHours.map((day) => ({
                ...day,
                id: days[days.findIndex((d) => d.name === day.name)]!.id,
              }));

              saveOpeningHours(withId);
            }}
          >
            Save
          </button>
        </div>
      ) : (
        // Opening days options
        <div className="mt-6 flex flex-col items-center gap-6">
          <Calendar
            minDate={now}
            className="REACT-CALENDAR p-2"
            view="month"
            onClickDay={(date) => setSelectedDate(date)}
            tileClassName={({ date }) => {
              return closedDays?.includes(formatISO(date))
                ? "closed-day"
                : null;
            }}
          />

          <button
            onClick={() => {
              if (dayIsClosed) openDay({ date: selectedDate });
              else if (selectedDate) closeDay({ date: selectedDate });
            }}
            disabled={!selectedDate}
          >
            {dayIsClosed ? "Open shop this day" : "Close shop this day"}
          </button>
        </div>
      )}
    </div>
  );
};

export default opening;

type OpeningHoursType = {
  name: string;
  openTime: string;
  closeTime: string;
};

function getOpeningHours(days: Day[]) {
  const openingHours: OpeningHoursType[] = weekdays.map(
    (day: string, i): OpeningHoursType => {
      return {
        name: day,
        openTime: days[i]!.openTime,
        closeTime: days[i]!.closeTime,
      };
    }
  );
  return openingHours;
}
