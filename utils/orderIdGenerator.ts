import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

export function generateOrderId(): string {
  const timestamp = new Date().getTime().toString(36).toUpperCase();
  const randomPart = nanoid();
  return `OP-${timestamp}-${randomPart}`;
}
