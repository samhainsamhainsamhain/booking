import Link from "next/link";
import { FC } from "react";
import { api } from "../../utils/api";

type dashboardProps = {};

const dashboard: FC<dashboardProps> = ({ }: dashboardProps) => {
  const { mutate } = api.admin.sensitive.useMutation();

  function mutateHandler() {
    return mutate();
  }
  return (
    <div className="flex h-screen w-full items-center justify-center gap-8 font-medium">
      <Link className="p-2 bg-gray-100 rounded-md" href='/dashboard/opening'>Opening Hours</Link>
      <Link className="p-2 bg-gray-100 rounded-md" href='/dashboard/menu'>Menu</Link>
    </div>
  );
};

export default dashboard;
