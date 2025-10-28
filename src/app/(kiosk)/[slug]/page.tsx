"use client";

import { fetchPostObj } from "@/action/function";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { KaosContext } from "../layout";

const DetailKaosPage = () => {
  const [data, setData] = useState<any>(null);
  const searhParams = useSearchParams();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const { dealer_id }: any = useContext(KaosContext);
  const card_id = params?.slug;
  const title = searhParams.get("name");
  const fetchCardDetail = async (dealer_id: string) => {
    const response = await fetchPostObj({
      api: "StandingScreenCenter/dealerCardDetail",
      method: "POST",
      setLoading,
      isValue: true,
      showErrorToast: true,
      data: { dealer_id, card_id: card_id },
    });

    if (response.success == 1) {
      setData(response.message);
    }
  };
  useEffect(() => {
    if (dealer_id && card_id) {
      fetchCardDetail(dealer_id);
    }
  }, [dealer_id, params.slug]);

  return (
    <div className="w-full mt-10 flex flex-col gap-4">
      <div className="w-full flex justify-center items-center gap-4">
        <ChevronDown className="text-primary" />
        <h1
          className="text-center text-[#00BCFF] text-[50px] uppercase leading-loose"
          style={{ fontWeight: "400" }}
        >
          {title}
        </h1>
        <ChevronDown className="text-primary" />
      </div>

      {!loading &&
        (data ? (
          data?.map((item: any, index: number) => (
            <Link key={index} href={`/${card_id}/${item.detailId}`}>
              <div className="rounded-[27.08px] bg-[#0093c8]  shadow-md m-auto w-[622.94px] h-[152.28px] text-white">
                <div className="flex items-center gap-4 ">
                  <Image
                    src={item.image}
                    alt="kiosk slug"
                    className="w-[179.79px] h-[152.28px]  rounded-[27.08px]   "
                    height={300}
                    width={300}
                  />
                  <div className="flex flex-col gap-2">
                    <h1 className="font-bold text-[27.08px] leading-[13.54px] tracking-[0] uppercase">
                      {item.title}
                    </h1>
                    <p className="uppercase text-[13.54px] font-light ">
                      {item.subTitle}
                    </p>
                    <p
                      className="text-[10.83px] "
                      style={{ fontWeight: "700" }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <h1 className="text-center text-[20px]">No Data Found</h1>
        ))}
    </div>
  );
};

export default DetailKaosPage;
