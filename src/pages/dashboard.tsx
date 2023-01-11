import { FC } from "react";
import { api } from "../utils/api";

type dashboardProps = {};

const dashboard: FC<dashboardProps> = ({}: dashboardProps) => {
  const { mutate } = api.admin.sensitive.useMutation();

  function mutateHandler() {
    return mutate();
  }
  return (
    <div>
      <h1>dashboard</h1>
      <button onClick={mutateHandler}>Admin action</button>
    </div>
  );
};

export default dashboard;
