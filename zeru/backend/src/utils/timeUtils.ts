/**
 * Time utilities for handling timezone-independent daily price buckets
 * and proper timestamp handling for tokens created before/after UNIX epoch
 */

/**
 * Convert a timestamp to the start of day in UTC (timezone-independent)
 * This ensures all daily price buckets are consistent regardless of timezone
 */
export function getStartOfDayUTC(timestamp: number): number {
    const date = new Date(timestamp * 1000);
    const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    return Math.floor(utcDate.getTime() / 1000);
}

/**
 * Convert a timestamp to the end of day in UTC (timezone-independent)
 */
export function getEndOfDayUTC(timestamp: number): number {
    const startOfDay = getStartOfDayUTC(timestamp);
    return startOfDay + 86399; // 23:59:59 UTC
}

/**
 * Get daily timestamps from creation to current time, handling edge cases
 * - Tokens created before UNIX epoch (1970-01-01) are handled gracefully
 * - Tokens created in the future are handled
 * - All timestamps are normalized to UTC start of day
 */
export function getDailyTimestamps(creationTimestamp: number, currentTimestamp: number): number[] {
    const timestamps: number[] = [];

    // Handle edge cases
    const minTimestamp = Math.max(creationTimestamp, 0); // Don't go before UNIX epoch
    const maxTimestamp = Math.min(currentTimestamp, Math.floor(Date.now() / 1000)); // Don't go into future

    if (minTimestamp >= maxTimestamp) {
        // Edge case: creation time is after current time or invalid
        return [getStartOfDayUTC(maxTimestamp)];
    }

    // Get start of day for creation and current time
    let currentDay = getStartOfDayUTC(minTimestamp);
    const endDay = getStartOfDayUTC(maxTimestamp);

    // Generate daily timestamps (start of each day)
    while (currentDay <= endDay) {
        timestamps.push(currentDay);
        currentDay += 86400; // Add 1 day in seconds
    }

    return timestamps;
}

/**
 * Validate if a timestamp is reasonable for price data
 */
export function isValidTimestamp(timestamp: number): boolean {
    const now = Math.floor(Date.now() / 1000);
    const minReasonable = 946684800; // 2000-01-01 (reasonable start for crypto)
    const maxReasonable = now + (365 * 24 * 60 * 60); // 1 year in future

    return timestamp >= minReasonable && timestamp <= maxReasonable;
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: number): string {
    return new Date(timestamp * 1000).toISOString();
}

/**
 * Get human-readable time difference
 */
export function getTimeDifference(timestamp1: number, timestamp2: number): string {
    const diff = Math.abs(timestamp2 - timestamp1);
    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);

    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''}`;
    }
    return `${hours} hour${hours > 1 ? 's' : ''}`;
} 