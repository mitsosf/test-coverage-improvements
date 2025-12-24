import { v4 as uuidv4 } from 'uuid';
import { Comment, CreateCommentInput } from '../types';

const comments = new Map<string, Comment>();

export function create(input: CreateCommentInput): Comment {
  const now = new Date();
  const comment: Comment = {
    id: uuidv4(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  comments.set(comment.id, comment);
  return comment;
}

export function getById(id: string): Comment | undefined {
  return comments.get(id);
}

export function getAll(): Comment[] {
  return Array.from(comments.values());
}

export function update(id: string, input: Partial<CreateCommentInput>): Comment | undefined {
  const existing = comments.get(id);
  if (!existing) {
    return undefined;
  }
  const updated: Comment = {
    ...existing,
    ...input,
    updatedAt: new Date(),
  };
  comments.set(id, updated);
  return updated;
}

export function remove(id: string): boolean {
  return comments.delete(id);
}

export function clear(): void {
  comments.clear();
}
