import { eq } from "drizzle-orm";
import { getDatabase } from "../../database";
import { repliesTable } from "../../database/schemas/reply";
import ThreadsService from "../threads/threads-service";
import type {
  TCreateReplyBodySchema,
  TGetAllRepliesQuerySchema,
  TGetSingleReplyQuerySchema,
  TUpdateReplyBodySchema,
} from "./dto";

export default class RepliesService {
  private threadsService = new ThreadsService();

  getAllReplies = async (
    nodeSlug: string,
    threadSlug: string,
    dto: TGetAllRepliesQuerySchema
  ) => {
    const thread = await this.threadsService.getSingleThread(
      nodeSlug,
      threadSlug,
      {
        with_node: false,
      }
    );

    // See comment in `getAllThreads` method in `ThreadsService` for explanation.
    if (!thread) throw new Error("This should never happen. :fingers_crossed:");

    const db = getDatabase();
    const replies = await db.query.replies.findMany({
      with: {
        thread: dto.with_thread || undefined,
        replies: dto.with_replies || undefined,
        repliedTo: dto.with_replied_to || undefined,
      },
      limit: dto.limit || 25,
      offset: dto.offset || 0,
      where: eq(repliesTable.thread_id, thread.id),
    });

    return replies;
  };

  getSingleReply = async (replyId: number, dto: TGetSingleReplyQuerySchema) => {
    const db = getDatabase();
    const reply = await db.query.replies.findMany({
      where: eq(repliesTable.id, replyId),
      with: {
        thread: dto.with_thread || undefined,
        replies: dto.with_replies || undefined,
        repliedTo: dto.with_replied_to || undefined,
      },
    });

    if (reply.length === 0) {
      return null;
    }

    return reply[0];
  };

  createReply = async (
    nodeSlug: string,
    threadSlug: string,
    dto: TCreateReplyBodySchema
  ) => {
    const thread = await this.threadsService.getSingleThread(
      nodeSlug,
      threadSlug,
      {
        with_node: false,
      }
    );

    if (!thread) throw new Error("This should never happen. :fingers_crossed:");

    const db = getDatabase();
    const reply = await db
      .insert(repliesTable)
      .values({
        body: dto.body,
        thread_id: thread.id,
        reply_to_id: dto.reply_to_id || null,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    return reply[0];
  };

  updateReply = async (replyId: number, dto: TUpdateReplyBodySchema) => {
    const db = getDatabase();
    const reply = await db
      .update(repliesTable)
      .set({
        body: dto.body,
        updated_at: new Date(),
      })
      .where(eq(repliesTable.id, replyId))
      .returning();

    if (reply.length === 0) {
      return null;
    }

    return reply[0];
  };

  deleteReply = async (replyId: number) => {
    const db = getDatabase();
    const reply = await db
      .delete(repliesTable)
      .where(eq(repliesTable.id, replyId))
      .returning();

    if (reply.length === 0) {
      return null;
    }

    return reply[0];
  };
}
