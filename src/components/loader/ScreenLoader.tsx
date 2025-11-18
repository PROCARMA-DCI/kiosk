import { LoaderOne } from "../ui/loader";

export const ScreenLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <LoaderOne />
    </div>
  );
};
