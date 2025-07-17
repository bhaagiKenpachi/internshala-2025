/**
 * Linear interpolation with proper timestamp weighting
 * Uses inverse distance weighting to ensure closer timestamps have more influence
 */

export interface PricePoint {
    timestamp: number;
    price: number;
}

export function interpolate(
    queryTimestamp: number,
    beforeTimestamp: number,
    beforePrice: number,
    afterTimestamp: number,
    afterPrice: number
): number {
    // Handle edge cases
    if (beforeTimestamp === afterTimestamp) {
        return beforePrice;
    }

    if (queryTimestamp <= beforeTimestamp) {
        return beforePrice;
    }

    if (queryTimestamp >= afterTimestamp) {
        return afterPrice;
    }

    // Calculate time distances for proper weighting
    const totalDistance = afterTimestamp - beforeTimestamp;
    const distanceFromBefore = queryTimestamp - beforeTimestamp;
    const distanceFromAfter = afterTimestamp - queryTimestamp;

    // Use inverse distance weighting (closer points have more weight)
    const beforeWeight = distanceFromAfter / totalDistance;
    const afterWeight = distanceFromBefore / totalDistance;

    // Weighted average based on time distance
    const interpolatedPrice = (beforePrice * beforeWeight) + (afterPrice * afterWeight);

    return interpolatedPrice;
}

/**
 * Multi-point interpolation using multiple price points
 * Finds the best interpolation using the closest points before and after
 */
export function interpolateMultiPoint(
    queryTimestamp: number,
    pricePoints: PricePoint[]
): number | null {
    if (pricePoints.length === 0) {
        return null;
    }

    if (pricePoints.length === 1) {
        return pricePoints[0].price;
    }

    // Sort by timestamp
    const sortedPoints = [...pricePoints].sort((a, b) => a.timestamp - b.timestamp);

    // Find the closest points before and after the query timestamp
    let beforePoint: PricePoint | null = null;
    let afterPoint: PricePoint | null = null;

    for (let i = 0; i < sortedPoints.length; i++) {
        const point = sortedPoints[i];

        if (point.timestamp <= queryTimestamp) {
            beforePoint = point;
        } else {
            afterPoint = point;
            break;
        }
    }

    // Handle edge cases
    if (beforePoint === null) {
        // Query timestamp is before all data points
        return sortedPoints[0].price;
    }

    if (afterPoint === null) {
        // Query timestamp is after all data points
        return sortedPoints[sortedPoints.length - 1].price;
    }

    // Use linear interpolation between the two closest points
    return interpolate(
        queryTimestamp,
        beforePoint.timestamp,
        beforePoint.price, // Use beforePoint.price
        afterPoint.timestamp,
        afterPoint.price // Use afterPoint.price
    );
}

/**
 * Calculate confidence score for interpolation
 * Returns a value between 0 and 1, where 1 is high confidence
 */
export function calculateInterpolationConfidence(
    queryTimestamp: number,
    beforeTimestamp: number,
    afterTimestamp: number,
    maxGapDays: number = 30
): number {
    const gapDays = (afterTimestamp - beforeTimestamp) / (24 * 60 * 60);
    const maxGapSeconds = maxGapDays * 24 * 60 * 60;

    // Confidence decreases as the gap increases
    const gapConfidence = Math.max(0, 1 - (gapDays / maxGapDays));

    // Confidence is higher when query is closer to the middle of the range
    const totalGap = afterTimestamp - beforeTimestamp;
    const distanceFromMiddle = Math.abs(queryTimestamp - (beforeTimestamp + totalGap / 2));
    const middleConfidence = Math.max(0, 1 - (distanceFromMiddle / totalGap));

    // Average the two confidence scores
    return (gapConfidence + middleConfidence) / 2;
} 