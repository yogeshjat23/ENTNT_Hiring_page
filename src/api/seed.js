import { db } from './db';

// This function seeds the database if it's empty.
export async function seedDatabase() {
  const jobCount = await db.jobs.count();
  if (jobCount > 0) {
    console.log('Database already seeded.');
    return;
  }
  console.log('Seeding database...');

  // Seed Jobs
  const jobs = [];
  for (let i = 0; i < 25; i++) {
    jobs.push({
      id: `job-${i + 1}`,
      title: `Software Engineer ${i + 1}`,
      slug: `software-engineer-${i + 1}`,
      status: i % 4 === 0 ? 'archived' : 'active',
      tags: ['React', 'Node.js'],
      order: i,
    });
  }
  await db.jobs.bulkAdd(jobs);

  // Seed Candidates
  const candidates = [];
  const stages = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];
  for (let i = 0; i < 1000; i++) {
    const stage = stages[i % stages.length];
    candidates.push({
      id: `cand-${i + 1}`,
      name: `Candidate ${i + 1}`,
      email: `candidate${i + 1}@example.com`,
      jobId: `job-${(i % 25) + 1}`,
      stage: stage,
    });
    // Add a timeline entry for the initial stage
    await db.candidateTimeline.add({
      candidateId: `cand-${i + 1}`,
      stage: stage,
      timestamp: new Date().toISOString(),
    });
  }
  await db.candidates.bulkAdd(candidates);

  // Seed Assessments
  const assessments = [];
  for (let i = 0; i < 3; i++) {
    assessments.push({
      jobId: `job-${i + 1}`,
      sections: [
        {
          id: 'sec1',
          title: 'Basic Questions',
          questions: [
            {
              id: 'q1',
              type: 'single-choice',
              text: 'Are you legally authorized to work in the US?',
              options: ['Yes', 'No'],
              isRequired: true,
            },
            {
              id: 'q2',
              type: 'short-text',
              text: 'What is your expected salary?',
              isRequired: true,
              maxLength: 20,
            },
             {
              id: 'q3',
              type: 'long-text',
              text: 'Tell us about a challenging project.',
              isRequired: false,
              condition: { questionId: 'q1', value: 'Yes' } // Conditional question
            },
          ],
        },
      ],
    });
  }
  await db.assessments.bulkAdd(assessments);
  console.log('Database seeded successfully!');
}