"use client";

import { getActivity } from "@/action/activity";
import { fetchPostObj } from "@/action/function";
import { KaosContext } from "@/app/(kiosk)/layout";
import SimpleModal from "@/components/modals/SimpleModal";
import { FilterableSelect } from "@/components/select/FilterableSelect";
import { getSessionId } from "@/utils/session";

import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const MenuKaos = ({
  dealer_id,
  setDealerId,
  dealerModel,
  setDealerModel,
  setInactive,
  setBannerData,
}: any) => {
  const { dealers, setDealers }: any = useContext(KaosContext);
  const [loading, setLoading] = useState(false);
  const session_id = getSessionId();

  useEffect(() => {
    if (session_id) {
      getActivity({
        session_id: session_id,
        activity: "visiting home page",
        type: "home",
        dealer_id: dealer_id,
      });
    }
  }, [session_id]);
  const fetchBanner = async (dealer_id: string) => {
    const response = await fetchPostObj({
      api: "StandingScreenCenter/dealerHeroScreenSettings",
      method: "POST",
      isValue: true,
      showErrorToast: true,
      setLoading,
      data: { dealer_id },
    });
    if (response.success == 1) {
      setBannerData(response.message);
    }
  };
  useEffect(() => {
    if (dealer_id) {
      fetchBanner(dealer_id);
    }
  }, [dealer_id]);
  const getEnableDealers = async () => {
    const response = await fetchPostObj({
      api: "StandingScreenCenter/enabledStandingScreenDealer",
      method: "POST",
      isValue: true,
      showErrorToast: true,
      setLoading,
    });
    if (response.success == 1) {
      setDealers(response.message);
    } else {
      toast.error(response?.message);
      setDealers([]);
    }
  };
  useEffect(() => {
    getEnableDealers();
  }, []);

  useEffect(() => {
    setInactive(true);
    setTimeout(() => setDealerModel(false), 1000);
  }, [dealer_id]);

  return (
    <div>
      {/* <div className="w-full flex justify-end p-2">
        <Menu
          onClick={() => setDealerModel(true)}
          className="text-gray-500 cursor-pointer hover:text-gray-600 Transition"
        />
      </div> */}

      <SimpleModal
        title={"Select Dealer"}
        className={"max-w-[400px]  m-0 "}
        open={!dealer_id || dealerModel}
        close={() => setDealerModel(false)}
      >
        <div className="w-full">
          <FilterableSelect
            className="w-full"
            label={"Dealer"}
            labelPosition="inside"
            options={dealers ?? []}
            keyValue={"DealerID"}
            keyTitle={"DealerTitle"}
            setvalue={setDealerId}
            value={dealer_id}
            placeholder={"Select Dealer"}
          />
        </div>
      </SimpleModal>
    </div>
  );
};

export default MenuKaos;
