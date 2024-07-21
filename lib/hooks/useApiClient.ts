"use client";
import useSWR, { SWRResponse } from "swr";

const API_BASE_URL = "/api";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  return response.json();
};

const useApiClient = <T>(
  url: string,
  params?: Record<string, any>
): SWRResponse<T, any> => {
  const queryString = params
    ? "?" + new URLSearchParams(params).toString()
    : "";
  return useSWR<T>(`${API_BASE_URL}${url}${queryString}`, fetcher);
};

export default useApiClient;
