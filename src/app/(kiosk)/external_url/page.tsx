import BackButton from "@/common/BackButton";
import IframeUrl from "@/common/IframeUrl";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <BackButton backRoute="/" />
      <IframeUrl />
    </Suspense>
  );
}
