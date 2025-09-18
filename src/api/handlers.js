import { rest } from 'msw';
import { db } from './db'; 
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Helper: random delay + error injection
const withNetwork = (res, ctx, data, {
  errorRate = 0.1,
  minDelay = 200,
  maxDelay = 1200,
  status = 200,
  errorStatus = 500,
  errorMessage = 'Something went wrong',
} = {}) => {
  const delay = Math.random() * (maxDelay - minDelay) + minDelay;

  if (Math.random() < errorRate) {
    return res(
      ctx.delay(delay),
      ctx.status(errorStatus),
      ctx.json({ error: errorMessage })
    );
  }

  return res(
    ctx.delay(delay),
    ctx.status(status),
    ctx.json(data)
  );
};

export const handlers = [
 rest.get('/jobs', async (req, res, ctx) => {
    const search = req.url.searchParams.get('search') || '';
    const tagSearch = req.url.searchParams.get('tagSearch') || '';
    let jobs = db.jobs.orderBy('order');
    if (search) {
      const regex = new RegExp(escapeRegExp(search), 'i');
      jobs = jobs.filter(job => regex.test(job.title));
    }
    if (tagSearch) {
      const tagRegex = new RegExp(escapeRegExp(tagSearch), 'i');
      jobs = jobs.filter(job => job.tags.some(tag => tagRegex.test(tag)));
    }
    const allJobs = await jobs.toArray();
    return withNetwork(res, ctx, allJobs);
  }),

  rest.post('/jobs', async (req, res, ctx) => {
    const body = await req.json();
    const newJob = {
      ...body,
      id: crypto.randomUUID(),
      status: 'active',
      order: await db.jobs.count()
    };
    await db.jobs.add(newJob);
    return withNetwork(res, ctx, newJob, { status: 201 });
  }),

  rest.patch('/jobs/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const updates = await req.json();
    await db.jobs.update(id, updates);
    const updatedJob = await db.jobs.get(id);
    return withNetwork(res, ctx, updatedJob);
  }),

  rest.patch('/jobs/:id/reorder', async (req, res, ctx) => {
    const { fromOrder, toOrder } = await req.json();

    if (Math.random() < 0.3) {
      return withNetwork(res, ctx, null, {
        errorStatus: 500,
        errorMessage: 'Reorder failed due to server error.'
      });
    }

    const allJobs = await db.jobs.orderBy('order').toArray();
    const activeJobs = allJobs.filter(job => job.status === 'active');
    const archivedJobs = allJobs.filter(job => job.status === 'archived');

    const [movedJob] = activeJobs.splice(fromOrder, 1);
    activeJobs.splice(toOrder, 0, movedJob);

    const finalJobsList = [...activeJobs, ...archivedJobs];

    await Promise.all(
      finalJobsList.map((job, index) =>
        db.jobs.update(job.id, { order: index })
      )
    );

    return withNetwork(res, ctx, { success: true });
  }),

  // === CANDIDATES ===
  rest.get('/candidates', async (req, res, ctx) => {
    const allCandidates = await db.candidates.toArray();
    return withNetwork(res, ctx, allCandidates);
  }),

  rest.patch('/candidates/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const { stage } = await req.json();
    await db.candidates.update(id, { stage });
    await db.candidateTimeline.add({
      candidateId: id,
      stage,
      timestamp: new Date().toISOString()
    });
    const updatedCandidate = await db.candidates.get(id);
    return withNetwork(res, ctx, updatedCandidate);
  }),

  rest.get('/candidates/:id/timeline', async (req, res, ctx) => {
    const { id } = req.params;
    const timelineEvents = await db.candidateTimeline
      .where({ candidateId: id })
      .toArray();
    timelineEvents.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
    return withNetwork(res, ctx, timelineEvents);
  }),

  // === ASSESSMENTS ===
  rest.get('/assessments/:jobId', async (req, res, ctx) => {
    const { jobId } = req.params;
    const assessment = await db.assessments.get(jobId);
    return withNetwork(res, ctx, assessment || { jobId, sections: [] });
  }),

  rest.put('/assessments/:jobId', async (req, res, ctx) => {
    const { jobId } = req.params;
    const assessmentData = await req.json();
    await db.assessments.put({ ...assessmentData, jobId });
    return withNetwork(res, ctx, assessmentData);
  }),
];
