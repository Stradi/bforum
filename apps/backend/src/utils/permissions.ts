type Action = "create" | "read" | "update" | "delete";
type Subject = "node" | "thread" | "reply";

export function can(
  accountId: number,
  action: Action,
  subject: Subject,
  subjectId?: number
) {
  const permission = `${subject}:${action}${subjectId ? `:${subjectId}` : ""}`;

  return true;
}
