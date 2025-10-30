"use client";

import { fetchPostObj } from "@/action/function";
import { ScreenLoader } from "@/components/loader/ScreenLoader";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { useRef } from "react";

export function HtmlPreview({ html }: { html?: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && html) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                /* Optionally add your app fonts or base styles */
                body {
                  margin: 0;
                  font-family: Avenir, sans-serif;
             
                }
              </style>
            </head>
            <body>${html}</body>
          </html>
        `);
        doc.close();
      }
    }
  }, [html]);

  return <iframe ref={iframeRef} className="w-full min-h-screen border-0" />;
}

const InnerDetailKaosHtmlPage = () => {
  const [data, setData] = useState(null);
  const params = useParams();
  const searhParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const detail_id = params?.subslug;
  const dealer_id = searhParams.get("dealer_id");
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
  }, [dealer_id, detail_id]);

  return (
    <div className="  ">
      {!loading && data && (
        // @ts-ignore
        // <SafeHTML html={data?.descriptionHtml} />
        <HtmlPreview html={data?.descriptionHtml} />
        // <div>
        //   <div
        //     className="bg-background"
        //     // @ts-ignore
        //     dangerouslySetInnerHTML={{ __html: data?.descriptionHtml }}
        //   />
        // </div>
      )}
    </div>
  );
};

export default function DetailKaosHtmlPage() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <InnerDetailKaosHtmlPage />
    </Suspense>
  );
}
