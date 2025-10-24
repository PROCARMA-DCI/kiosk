"use client";

import { fetchPostObj } from "@/action/function";
import { ShadDialog } from "@/components/dialog/ShadDialog";
import { FilterableSelect } from "@/components/select/FilterableSelect";

import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const MenuKaos = ({ dealer_id, setDealerId }: any) => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setOpen(false), 1000);
  }, [dealer_id]);
  return (
    <div>
      <div className="w-full flex justify-end p-2">
        <Menu
          onClick={() => setOpen(true)}
          className="text-gray-500 cursor-pointer hover:text-gray-600 Transition"
        />
      </div>
      <ShadDialog
        open={open}
        onOpenChange={() => setOpen(false)}
        title={"Select Dealer"}
        className={"max-w-[400px] m-0"}
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
      </ShadDialog>
    </div>
  );
};

export default MenuKaos;
