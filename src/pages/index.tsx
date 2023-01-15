"use client";
import { type NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { type DateTime } from "@types";
import Spinner from "../components/Spinner";
import Calendar from "../components/Calendar";
import Menu from "../components/Menu";
import { api } from "src/utils/api";

const Home: NextPage = () => {
  const [date, setDate] = useState<DateTime>({
    bookingTime: null,
    bookingDate: null,
  });

  const { mutate: checkMenuStatus, isSuccess } =
    api.menu.checkMenuStatus.useMutation();

  useEffect(() => {
    if (date.bookingTime) checkMenuStatus();
  }, [date]);

  return (
    <>
      <Head>
        <title>Booking</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <div>
          {!date.bookingTime && (
            <div className="flex h-screen items-center justify-center">
              <Calendar date={date} setDate={setDate} />
            </div>
          )}
          {date.bookingTime && isSuccess && <Menu />}
          {date.bookingTime && !isSuccess && (
            <div className="flex h-screen items-center justify-center">
              <Spinner />
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
