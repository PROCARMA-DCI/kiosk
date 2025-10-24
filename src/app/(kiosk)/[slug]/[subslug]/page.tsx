"use client";

import { fetchPostObj } from "@/action/function";
import { useContext, useEffect, useState } from "react";
import { KaosContext } from "../../layout";

const DetailKaosHtmlPage = ({
  params,
}: {
  params: { slug: string; subslug: string };
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { dealer_id }: any = useContext(KaosContext);
  const detail_id = params?.subslug;
  const fetchCardDetail = async (dealer_id: string) => {
    const response = await fetchPostObj({
      api: "StandingScreenCenter/cardExplanation",
      method: "POST",
      setLoading,
      isValue: true,
      showErrorToast: true,
      data: { dealer_id, detail_id: detail_id },
    });

    if (response.success == 1) {
      setData(response.message);
    }
  };
  useEffect(() => {
    if (dealer_id && detail_id) {
      fetchCardDetail(dealer_id);
    }
  }, [dealer_id, params.slug]);

  return (
    <div className="w-full bg-background flex flex-col gap-4 overflow-hidden">
      {!loading && data && (
        <div>
          <div
            className="bg-background"
            // @ts-ignore
            dangerouslySetInnerHTML={{ __html: data?.descriptionHtml }}
          />
        </div>
      )}
    </div>
  );
};

export default DetailKaosHtmlPage;
