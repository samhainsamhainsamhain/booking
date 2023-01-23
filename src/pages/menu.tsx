import Menu from "@components/Menu";
import Spinner from "@components/Spinner";
import { parseISO } from "date-fns";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { now } from "src/constants";
import { api } from "src/utils/api";

const MenuPage: FC = () => {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState<string | null>(null); // as ISO string
  const { isFetchedAfterMount } = api.menu.checkMenuStatus.useQuery(undefined, {
    onError: () => {
      // check for validity of selectedTime failed
      // TODO Handle error
    },
  });

  useEffect(() => {
    const selectedTime = localStorage.getItem("selectedTime");
    if (!selectedTime) {
      void router.push("/");
    } else {
      const date = parseISO(selectedTime);
      if (date < now) void router.push("/");

      setSelectedTime(selectedTime);
    }
  }, []);

  return (
    <>
      {isFetchedAfterMount && selectedTime ? (
        <>
          <button onClick={() => router.push("/")}>
            Back to time selection
          </button>
          <Menu selectedTime={selectedTime} />
        </>
      ) : (
        <div className="flex h-screen items-center justify-center">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default MenuPage;
