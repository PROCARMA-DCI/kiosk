import { fetchPostObj } from "./function";

export const getActivity = async ({
  session_id,
  activity,
  type,
  dealer_id,
  screen_number,
}: {
  session_id: string;
  activity: string;
  type: string;
  dealer_id: string;
  screen_number?: number;
}) => {
  const data = {
    session_id,
    activity,
    type,
    dealer_id,
    screen_number,
  };
  const res = await fetchPostObj({
    api: "/kioskActivity",
    isValue: true,
    data,
  });
};
