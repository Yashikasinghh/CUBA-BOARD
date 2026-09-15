// ═══════════════════════════════════════════════════════
// QUESTIFY — Utility Functions
// Formatting, calculations, helpers
// ═══════════════════════════════════════════════════════

import { clsx, type ClassValue } from 'clsx';
import { LEVEL_DEFINITIONS } from './constants';
import type { LevelDefinition } from '@/types';

// ─── Class Name Merger ────────────────────────────────

/**
 * Merge class names with clsx — supports conditional classes,
 * arrays, and objects.
 *
 * @example cn('base', isActive && 'active', { 'bg-red': hasError })
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

// ─── Number Formatting ────────────────────────────────

/**
 * Format a number with locale-aware separators.
 * 1234 → "1,234"  |  1234567 → "1.23M"
 */
export function formatNumber(num: number, compact = false): string {
  if (compact) {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-IN').format(num);
}

/**
 * Format a percentage with optional decimal places.
 * 0.786 → "78.6%" or 78.6 → "78.6%"
 */
export function formatPercentage(value: number, decimals = 1): string {
  const pct = value > 1 ? value : value * 100;
  return `${pct.toFixed(decimals)}%`;
}

// ─── Time Formatting ──────────────────────────────────

/**
 * Format seconds into a human-readable duration.
 * 125 → "2m 5s"  |  3661 → "1h 1m 1s"
 */
export function formatTime(seconds: number): string {
  if (seconds < 0) return '0s';

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}h ${mins}m ${secs}s`;
  }
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}

/**
 * Format minutes into a compact duration.
 * 45 → "45 min"  |  125 → "2h 5min"
 */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}min` : `${hrs}h`;
}

// ─── Date Formatting ──────────────────────────────────

/**
 * Format an ISO date string into a readable date.
 * "2024-03-15T10:30:00Z" → "Mar 15, 2024"
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Get a relative time string from an ISO date.
 * "2 hours ago" | "3 days ago" | "Just now"
 */
export function getRelativeTime(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diff = now - then;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 5) return `${weeks}w ago`;
  return `${months}mo ago`;
}

// ─── Level & XP Calculations ──────────────────────────

/**
 * Calculate the user's level from their total XP.
 */
export function calculateLevel(xp: number): number {
  for (let i = LEVEL_DEFINITIONS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_DEFINITIONS[i].minXP) {
      return LEVEL_DEFINITIONS[i].level;
    }
  }
  return 1;
}

/**
 * Get the LevelDefinition for a given level number.
 */
export function getLevelDefinition(level: number): LevelDefinition {
  return (
    LEVEL_DEFINITIONS.find((l) => l.level === level) ?? LEVEL_DEFINITIONS[0]
  );
}

/**
 * Get the display name for a given level number.
 */
export function getLevelName(level: number): string {
  return getLevelDefinition(level).name;
}

/**
 * Get the level icon (emoji) for a given level number.
 */
export function getLevelIcon(level: number): string {
  return getLevelDefinition(level).icon;
}

/**
 * Get the total XP needed to reach the next level.
 */
export function getXPForNextLevel(currentLevel: number): number {
  const nextLevel = LEVEL_DEFINITIONS.find((l) => l.level === currentLevel + 1);
  if (!nextLevel) {
    // Max level — return the current level's max
    const current = getLevelDefinition(currentLevel);
    return current.maxXP;
  }
  return nextLevel.minXP;
}

/**
 * Get the XP progress within the current level as a 0-1 fraction.
 */
export function getXPProgress(xp: number): number {
  const level = calculateLevel(xp);
  const currentDef = getLevelDefinition(level);
  const range = currentDef.maxXP - currentDef.minXP;
  if (range <= 0) return 1;
  const progress = (xp - currentDef.minXP) / range;
  return Math.min(Math.max(progress, 0), 1);
}

/**
 * Get XP remaining to reach the next level.
 */
export function getXPRemaining(xp: number): number {
  const level = calculateLevel(xp);
  const currentDef = getLevelDefinition(level);
  return Math.max(currentDef.maxXP - xp, 0);
}

// ─── ID Generation ────────────────────────────────────

/**
 * Generate a unique-enough ID for client-side use.
 * Format: prefix_timestamp_random
 */
export function generateId(prefix = 'id'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}

// ─── File Size Formatting ─────────────────────────────

/**
 * Format bytes into a human-readable file size.
 * 1536 → "1.5 KB"  |  2097152 → "2.0 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

// ─── String Helpers ───────────────────────────────────

/**
 * Truncate a string with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + '…';
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get initials from a name.
 * "Arjun Mehta" → "AM"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ─── Color Helpers ────────────────────────────────────

/**
 * Get subject color or fallback.
 */
export function getSubjectColor(
  subject: string
): { base: string; light: string; bg: string } {
  // Lazy import to avoid circular deps
  const { SUBJECT_COLORS, DEFAULT_SUBJECT_COLOR } = require('./constants');
  return SUBJECT_COLORS[subject] ?? DEFAULT_SUBJECT_COLOR;
}

// ─── Array Helpers ────────────────────────────────────

/**
 * Shuffle an array using Fisher-Yates algorithm.
 */
export function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Pick N random elements from an array.
 */
export function pickRandom<T>(array: T[], count: number): T[] {
  return shuffle(array).slice(0, count);
}

// ─── Delay Helper ────────────────────────────────────

/**
 * Delay execution for a given number of milliseconds.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
