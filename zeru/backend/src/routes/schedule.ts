import express from 'express';
import { Queue } from 'bullmq';

const router = express.Router();

const priceQueue = new Queue('price-history', {
    connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' },
});

router.post('/schedule', async (req, res) => {
    const { token, network } = req.body;
    if (!token || !network) {
        return res.status(400).json({ error: 'token, network required' });
    }

    try {
        const job = await priceQueue.add('fetch-history', { token, network });
        res.json({
            status: 'scheduled',
            jobId: job.id
        });
    } catch (error) {
        console.error('Error scheduling job:', error);
        res.status(500).json({ error: 'Failed to schedule job' });
    }
});

// Updated stop endpoint with proper cancellation handling
router.delete('/stop/:jobId', async (req, res) => {
    const { jobId } = req.params;

    if (!jobId) {
        return res.status(400).json({ error: 'jobId required' });
    }

    try {
        // Get the job by ID
        const job = await priceQueue.getJob(jobId);

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // Check current job state
        const state = await job.getState();

        if (state === 'completed' || state === 'failed' || state === 'cancelled') {
            return res.status(400).json({
                error: `Cannot stop job in ${state} state`,
                currentState: state
            });
        }

        let action = '';

        if (state === 'active') {
            // For active jobs, we need to cancel them instead of removing
            // The worker will handle the cancellation gracefully
            await job.moveToFailed(new Error('Job cancelled by user'), '0', true);
            action = 'cancelled';
        } else if (state === 'waiting' || state === 'delayed') {
            // For waiting/delayed jobs, we can remove them directly
            await job.remove();
            action = 'removed';
        } else {
            return res.status(400).json({
                error: `Cannot stop job in ${state} state`,
                currentState: state
            });
        }

        console.log(`🛑 Job ${jobId} ${action} successfully (was ${state})`);

        res.json({
            status: 'stopped',
            jobId: jobId,
            action: action,
            previousState: state,
            message: `Job ${action} successfully`
        });

    } catch (error) {
        console.error('Error stopping job:', error);

        // Handle specific error for locked jobs
        if (error instanceof Error && error.message && error.message.includes('could not be removed because it is locked')) {
            return res.status(409).json({
                error: 'Job is currently being processed and cannot be stopped immediately. Please try again in a few moments.',
                suggestion: 'The job will be cancelled once the current processing step completes.'
            });
        }

        res.status(500).json({ error: 'Failed to stop job' });
    }
});

// Optional: Get job status endpoint
router.get('/status/:jobId', async (req, res) => {
    const { jobId } = req.params;

    if (!jobId) {
        return res.status(400).json({ error: 'jobId required' });
    }

    try {
        const job = await priceQueue.getJob(jobId);

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        const state = await job.getState();
        const progress = await job.progress;
        const data = job.data;

        res.json({
            jobId: jobId,
            state: state,
            progress: progress,
            data: data,
            createdAt: job.timestamp,
            processedOn: job.processedOn,
            finishedOn: job.finishedOn
        });

    } catch (error) {
        console.error('Error getting job status:', error);
        res.status(500).json({ error: 'Failed to get job status' });
    }
});

// Optional: List all jobs endpoint
router.get('/jobs', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        const jobs = await priceQueue.getJobs(['waiting', 'active', 'delayed', 'completed', 'failed'], offset, offset + Number(limit) - 1);

        const jobList = await Promise.all(jobs.map(async (job) => {
            const state = await job.getState();
            return {
                id: job.id,
                state: state,
                data: job.data,
                createdAt: job.timestamp,
                processedOn: job.processedOn,
                finishedOn: job.finishedOn
            };
        }));

        res.json({
            jobs: jobList,
            page: Number(page),
            limit: Number(limit)
        });

    } catch (error) {
        console.error('Error listing jobs:', error);
        res.status(500).json({ error: 'Failed to list jobs' });
    }
});

export default router; 