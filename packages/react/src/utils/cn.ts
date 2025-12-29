import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines and merges Tailwind CSS classes efficiently.
 * 
 * This utility uses:
 * - `clsx` for conditional class joining
 * - `tailwind-merge` to properly merge/deduplicate Tailwind classes
 * 
 * @example
 * ```tsx
 * cn('px-2 py-1', condition && 'bg-blue-500', { 'text-white': isActive })
 * // => 'px-2 py-1 bg-blue-500 text-white'
 * ```
 * 
 * @example Merging conflicting classes
 * ```tsx
 * cn('px-2', 'px-4')
 * // => 'px-4' (later class wins)
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

