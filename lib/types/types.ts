import { KeyedMutator } from "swr";

interface HookLoadingReply {
  data?: undefined;
  isLoading: true;
  isValidating: boolean;
  error?: undefined;
  mutate: KeyedMutator<unknown>;
}

interface HookLoadedReply<T = unknown> {
  data?: T;
  isLoading?: false;
  isValidating?: boolean;
  error?: Error;
  mutate?: KeyedMutator<T>;
}

export type HookReply<T = unknown> = HookLoadingReply | HookLoadedReply<T>;

export interface GetTasksResponse {
  roadmap: Stages[];
}

export interface Stages {
  title: string;
  tasks: Task[];
  position: number;
}

export interface Task {
  title: string;
  description: string;
  upVotes: number;
  id: string;
  priority: string;
}

export interface CreateTaskResponse {
  success: string;
}

export interface OAUthResponse {
  valid: boolean;
}
