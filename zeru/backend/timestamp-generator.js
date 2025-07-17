// Generate all timestamps for August 30, 2020 in epoch format
const targetDate = new Date('2020-08-30T00:00:00.000Z');
const endDate = new Date('2020-08-30T23:59:59.999Z');

console.log('All timestamps for August 30, 2020 (in epoch format):');
console.log('==================================================');

// Generate timestamps for every second of the day
let currentDate = new Date(targetDate);
const timestamps = [];

while (currentDate <= endDate) {
    const epoch = Math.floor(currentDate.getTime() / 1000);
    const isoString = currentDate.toISOString();
    timestamps.push({
        epoch: epoch,
        iso: isoString,
        readable: currentDate.toUTCString()
    });
    currentDate.setSeconds(currentDate.getSeconds() + 1);
}

// Display first 10 timestamps
console.log('\nFirst 10 timestamps:');
timestamps.slice(0, 10).forEach((ts, index) => {
    console.log(`${index + 1}. Epoch: ${ts.epoch} | ISO: ${ts.iso} | UTC: ${ts.readable}`);
});

// Display last 10 timestamps
console.log('\nLast 10 timestamps:');
timestamps.slice(-10).forEach((ts, index) => {
    console.log(`${timestamps.length - 9 + index}. Epoch: ${ts.epoch} | ISO: ${ts.iso} | UTC: ${ts.readable}`);
});

// Summary
console.log('\n==================================================');
console.log(`Total timestamps generated: ${timestamps.length}`);
console.log(`Start epoch: ${timestamps[0].epoch}`);
console.log(`End epoch: ${timestamps[timestamps.length - 1].epoch}`);
console.log(`Your specific timestamp (2020-08-30T07:03:35.000Z): ${Math.floor(new Date('2020-08-30T07:03:35.000Z').getTime() / 1000)}`);

// Export all timestamps to a file (optional)
const fs = require('fs');
const output = timestamps.map(ts => `${ts.epoch},${ts.iso},${ts.readable}`).join('\n');
const header = 'epoch,iso,utc\n';
fs.writeFileSync('august30_2020_timestamps.csv', header + output);
console.log('\nAll timestamps saved to: august30_2020_timestamps.csv');