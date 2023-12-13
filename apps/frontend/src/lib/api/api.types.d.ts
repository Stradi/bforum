type BaseApiObject = {
  id: number;
  created_at: number;
  updated_at: number;
};

export type ApiAccount = BaseApiObject & {
  username: string;
  email: string;
  display_name: string;
  accountGroup: ApiAccountGroup[];
};

export type ApiGroup = BaseApiObject & {
  name: string;
  accountGroup: ApiAccountGroup[];
  groupPermission: ApiGroupPermission[];
};

export type ApiAccountGroup = {
  account_id: number;
  group_id: number;
  account: ApiAccount;
  group: ApiGroup;
};

export type ApiPermission = BaseApiObject & {
  name: string;
  groupPermission: ApiGroupPermission[];
};

export type ApiGroupPermission = {
  group_id: number;
  permission_id: number;
  group: ApiGroup;
  permission: ApiPermission;
};

export type ApiNode = BaseApiObject & {
  name: string;
  slug: string;
  description: string;
  order: string;

  created_by: number;
  creator: ApiAccount;

  parent_id?: number;
  parent?: ApiNode;

  threads?: ApiThread[];
};

export type ApiThread = BaseApiObject & {
  name: string;
  slug: string;
  replies: ApiReply[];

  created_by: number;
  creator: ApiAccount;

  node_id: number;
  node: ApiNode;
};

export type ApiReply = BaseApiObject & {
  body: string;

  thread_id: number;
  thread: ApiThread;

  reply_to_id?: number;
  repliedTo?: ApiReply;

  created_by: number;
  creator: ApiAccount;

  replies: ApiReply[];
};
