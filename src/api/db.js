import Dexie from 'dexie';

export const db = new Dexie('talentflow');

db.version(1).stores({
  jobs: 'id, title, slug, status, order',
  candidates: 'id, name, email, stage, jobId',
  assessments: 'jobId', 
  candidateTimeline: '++id, candidateId, stage, timestamp',
  assessmentResponses: '++id, candidateId, jobId',
});

export const resetDatabase = async () => {
  await db.delete();
  window.location.reload();
};