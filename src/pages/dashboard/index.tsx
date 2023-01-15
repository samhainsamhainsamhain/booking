import Link from "next/link";
import { FC } from "react";
import { api } from "../../utils/api";

const dashboard: FC = () => {
  const { mutate } = api.admin.sensitive.useMutation();

  return (
    <div className="flex h-screen w-full items-center justify-center gap-8 font-medium">
      <Link className="rounded-md bg-gray-100 p-2" href="/dashboard/opening">
        Opening Hours
      </Link>
      <Link className="rounded-md bg-gray-100 p-2" href="/dashboard/menu">
        Menu
      </Link>
    </div>
  );
};

export default dashboard;
