import { mypcp } from "@/config";
import { toast } from "sonner";

/* -------------------------------------------------------------------------- */
/* 🧠 Utility: Convert FormData → Object                                     */
/* -------------------------------------------------------------------------- */
export const formDataToObject = (formData: FormData): Record<string, any> => {
  const obj: Record<string, any> = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = value;
  }
  return obj;
};

/* -------------------------------------------------------------------------- */
/* 🧠 Utility: Convert Object → FormData                                     */
/* -------------------------------------------------------------------------- */
export const objectToFormData = (
  obj: Record<string, any>,
  formdata?: FormData
): FormData => {
  const formData = formdata ?? new FormData();
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      let value = obj[key];
      if (
        value === undefined ||
        value === null ||
        value === "undefined" ||
        value === "null"
      ) {
        value = "";
      }
      formData.append(key, value);
    }
  }
  return formData;
};

/* -------------------------------------------------------------------------- */
/* ⚡ Universal POST/GET Fetcher     
/* -------------------------------------------------------------------------- */
export interface FetchPostParams<T = any> {
  url?: string;
  api?: string;
  formdata?: FormData;
  method?: "POST" | "GET" | "PUT" | "DELETE";
  contentType?: string;
  token?: string;
  setLoading?: (value: boolean) => void;
  setState?: (data: T) => void;
  showToast?: boolean;
  toastMsg?: string;
  reset?: () => void;
  errorMsg?: string;
  isValue?: boolean;
  dispatch?: (action: any) => void;
  fetchSelector?: (payload: any) => any;
  selectionKey?: string;
  cache?: boolean;
  cacheKey?: string;
  controller?: AbortController;
  showErrorToast?: boolean;
}

/**
 * 🧩 Fetch handler with optional caching, redux dispatch, and toast.
 */
export const fetchPost = async <T = any>({
  url,
  api,
  formdata,
  method = "POST",
  contentType,
  token,
  setLoading,
  setState,
  showToast,
  toastMsg,
  reset,
  isValue,
  errorMsg,
  dispatch,
  fetchSelector,
  selectionKey,
  controller,
  showErrorToast = false,
}: FetchPostParams<T>): Promise<T | undefined> => {
  const baseUrl = url ?? `${mypcp}${api ?? ""}`;
  const headers = new Headers();

  if (token) headers.append("Authorization", token);
  if (contentType) headers.append("Content-Type", contentType);

  try {
    setLoading?.(true);

    const response = await fetch(baseUrl, {
      method,
      headers,
      ...(method === "POST" && formdata ? { body: formdata } : {}),
      ...(controller ? { signal: controller.signal } : {}),
    });

    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const result = isJson ? await response.json() : await response.text();

    setLoading?.(false);

    if (!isJson) return result;

    if (isValue && !dispatch && !showErrorToast) {
      if (setState) {
        setState(result);
      }
      return result;
    }
    const success =
      result.success === 1 ||
      result.response === "success" ||
      (isValue && !showErrorToast);

    if (success) {
      // ✅ Success flow
      if (showToast) {
        toast.success(
          toastMsg ??
            result.message ??
            result.messages ??
            result.msg ??
            "Request successful"
        );
      }

      setState?.(result);
      reset?.();

      if (dispatch && fetchSelector) {
        dispatch(
          selectionKey
            ? fetchSelector({ [selectionKey]: result })
            : fetchSelector(result)
        );
      }

      return result;
    } else {
      // ❌ Error flow
      const message =
        result.message ??
        result.messages ??
        result.error ??
        result.text ??
        result.msg ??
        errorMsg ??
        "Something went wrong";

      if (showToast || showErrorToast) {
        toast.error(message);
      }

      if (dispatch && fetchSelector) {
        dispatch(
          selectionKey
            ? fetchSelector({ [selectionKey]: {} })
            : fetchSelector({})
        );
      }

      return result;
    }
  } catch (err) {
    console.error("fetchPost error:", err);
    setLoading?.(false);
    toast.error(errorMsg ?? "Network Error");
    return undefined;
  }
};

/* -------------------------------------------------------------------------- */
/* ⚡ fetchPostObj: Converts object → FormData automatically                 */
/* -------------------------------------------------------------------------- */
export interface FetchPostObjParams<T = any>
  extends Omit<FetchPostParams<T>, "formdata"> {
  data?: Record<string, any>;
  auth?: Record<string, any>;
}

export const fetchPostObj = async <T = any>({
  url,
  api,
  method = "POST",
  setLoading,
  setState,
  showToast,
  toastMsg,
  reset,
  errorMsg,
  token,
  isValue,
  auth = {},
  data = {},
  dispatch,
  fetchSelector,
  selectionKey,
  cache,
  cacheKey,
  controller,
  showErrorToast,
}: FetchPostObjParams<T>): Promise<T | undefined> => {
  const formdata = objectToFormData({ ...auth, ...data });
  return fetchPost<T>({
    url,
    api,
    method,
    setLoading,
    setState,
    showToast,
    toastMsg,
    reset,
    errorMsg,
    isValue,
    token,
    formdata,
    dispatch,
    fetchSelector,
    selectionKey,
    cache,
    cacheKey,
    controller,
    showErrorToast,
  });
};

/* -------------------------------------------------------------------------- */
/* 🍪 Cookie Helpers                                                        */
/* -------------------------------------------------------------------------- */
export const setCookie = async (key: string, value: string): Promise<void> => {
  await fetch("/api/cookie", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
};

export const getCookie = async (key: string): Promise<string | undefined> => {
  const res = await fetch(`/api/cookie?key=${key}`);
  const data = await res.json();
  return data.value;
};
