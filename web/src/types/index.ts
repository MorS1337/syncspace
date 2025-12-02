export type Space = {
  id: number;
  title: string;
  description?: string | null;
  invite_code: string;
};

export type Page = {
  id: number;
  space_id: number;
  title: string;
  md_content: string;
};

export type TaskStatus = "todo" | "in_progress" | "done";

export type Task = {
  id: number;
  space_id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: number;
  assignee_id?: number | null;
  due_at?: string | null;
  tag_ids?: number[];
};

export type CreateSpacePayload = {
  title: string;
  description?: string;
};

export type CreatePagePayload = {
  space_id: number;
  title: string;
};

export type UpdatePagePayload = {
  md_content: string;
};

export type CreateTaskPayload = {
  space_id: number;
  title: string;
  description?: string;
  due_at?: string;
  assignee_id?: number;
};

export type UpdateTaskPayload = Partial<{
  status: TaskStatus;
  assignee_id: number;
  due_at: string;
  priority: number;
}>;

