import { fetchPostObj } from "./function";

export const getActivity = async ({
  session_id,
  activity,
  type,
  dealer_id,
}: {
  session_id: string;
  activity: string;
  type: string;
  dealer_id: string;
}) => {
  const data = {
    session_id,
    activity,
    type,
    dealer_id,
  };
  const res = await fetchPostObj({
    api: "StandingScreenCenter/kioskActivity",
    isValue: true,
    data,
  });
};
