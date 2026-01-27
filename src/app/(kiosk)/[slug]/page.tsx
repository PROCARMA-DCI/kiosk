"use client";

import { fetchPostObj } from "@/action/function";
import BackButton from "@/common/BackButton";
import { ScreenLoader } from "@/components/loader/ScreenLoader";
import { playWheelSound } from "@/utils/helpers";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useContext, useEffect, useRef, useState } from "react";
import { KaosContext } from "../layout";

const InnerDetailKaosPage = () => {
  const [data, setData] = useState<any>(null);
  const router = useRouter();
  const hasRunRef = useRef(false);
  const searhParams = useSearchParams();
  const { selectedCard, dealer_id, setDealerID } = useContext(KaosContext);

  const params = useParams();
  const [loading, setLoading] = useState(false);
  const card_id = params?.slug;
  const title = searhParams.get("name");

  const fetchGetDealerId = async () => {
    const res = await fetchPostObj({
      method: "GET",
      setLoading,
      api: `StandingScreenCenter/kioskName?name=${card_id}`,
    });
    if (res.success == 1) {
      setDealerID(res.message);
      router.push("/");
    }
  };

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
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    if (dealer_id && card_id) {
      fetchCardDetail(dealer_id);
    }

    if (!dealer_id) {
      fetchGetDealerId();
    }
  }, []);

  return (
    dealer_id && (
      <div className="w-full mt-10 flex flex-col gap-4">
        <div className="w-full flex justify-center items-center gap-4">
          <ChevronDown
            style={{
              color: selectedCard?.gradient_start_color,
            }}
          />
          <h1
            className="text-center text-[50px] uppercase leading-loose bg-clip-text text-transparent"
            style={{
              fontWeight: 400,
              backgroundImage: `linear-gradient(90deg, ${selectedCard?.gradient_start_color}, ${selectedCard?.gradient_end_color})`,
            }}
          >
            {title}
          </h1>
          <ChevronDown
            style={{
              color: selectedCard?.gradient_start_color,
            }}
          />
        </div>

        {!loading &&
          (data ? (
            data?.map((item: any, index: number) => (
              <Link
                onClick={() => {
                  playWheelSound("/sound/MAIN-BUTTON-CLICK.mp3");
                }}
                key={index}
                href={`/${card_id}/${item.detailId}`}
                className=""
              >
                <div
                  className="rounded-[27.08px]  bg-red-800 shadow-md m-auto w-[622.94px] h-[156px]  text-white"
                  style={{
                    background: `
                      linear-gradient(to right, ${item?.gradient_start_color}, ${item?.gradient_end_color}),
                      -webkit-linear-gradient(left, ${item?.gradient_start_color}, ${item?.gradient_end_color})
                `,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundBlendMode: "overlay",
                  }}
                >
                  <div className="flex items-center gap-4 ">
                    <Image
                      src={item.image}
                      alt="kiosk slug"
                      className="w-[179.79px] h-[156px]  rounded-[25px] object-cover  "
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
                        style={{
                          fontFamily: "var(--font-roboto)",
                          fontWeight: 700,
                          fontSize: "10.83px",
                          lineHeight: "15.57px",
                          letterSpacing: "0em",
                        }}
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
    )
  );
};

export default function DetailKaosPage() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <BackButton backRoute="/" />
      <InnerDetailKaosPage />
    </Suspense>
  );
}
