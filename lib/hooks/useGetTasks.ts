"use client";
import { KeyedMutator } from "swr";
import { GetTasksResponse, HookReply } from "../types/types";
import useApiClient from "./useApiClient";

export function useGetTasks(): HookReply<GetTasksResponse> {
  const { data, error, isValidating, mutate, isLoading } =
    useApiClient<GetTasksResponse>("/tasks");

  if (isLoading) {
    return {
      isLoading: true,
      isValidating,
      data: undefined,
      error: undefined,
      mutate: mutate as KeyedMutator<unknown>,
    };
  }

  return {
    data: data,
    error,
    isLoading: false,
    isValidating,
    mutate,
  };
}
