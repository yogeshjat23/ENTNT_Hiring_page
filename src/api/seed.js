import { db } from './db'; 
import { formatISO } from 'date-fns';
import {faker} from '@faker-js/faker';
 

export async function seedDatabase() {
  const jobCount = await db.jobs.count();
  if (jobCount > 0) {
    console.log('Database already seeded.');
    return;
  }
  console.log('Seeding database...');

  // Seed Jobs
  const jobs = [];  
  

  
  for (let i = 3; i < 25; i++) {
    jobs.push({
      id: `job-${i + 1}`,
      title: `Software Engineer ${i + 1}`,
      slug: `software-engineer-${i + 1}`,
      status: i % 4 === 0 ? 'archived' : 'active',
      tags: ['React', 'Node.js'],
      order: i,
    });
  } 
   jobs.push({
      id: `job-${1}`,
      title: `React Developer`,
      slug: `react-developer`,
      status:'active',
      tags: ['React', 'Node.js'],
      order: 1,
    });  
    
    jobs.push({
      id: `job-${2}`,
      title: `C++ Developer`,
      slug: `c++-developer`,
      status:'active',
      tags: ['C++', 'OOPS'],
      order: 1,
    }); 
    jobs.push({
      id: `job-${3}`,
      title: `JavaScript Full-Stack Developer`,
      slug: `javaScript-full-stack-developer`,
      status:'active',
      tags: ['JavaScript', 'React ' , 'Node'],
      order: 1,
    });
  await db.jobs.bulkAdd(jobs);

  // Seed Candidates
    const candidates = [];
  const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];
  for (let i = 0; i < 1000; i++) {
    const stage = stages[i % stages.length];
    const candidateId = `cand-${i + 1}`;
    
     const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;

    candidates.push({
      id: candidateId,
      name: fullName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`, 
      jobId: `job-${(i % 25) + 1}`,
      stage: stage,
    });
    

    await db.candidateTimeline.add({
        candidateId,
        stage,
        timestamp: formatISO(new Date()),
        notes: 'Initial application received.'
    });
  }
  await db.candidates.bulkAdd(candidates);

const assessments = [
 
    {
      jobId: 'job-1',
      sections: [
        {
          id: 'react-sec1',
          title: 'React Fundamentals',
          questions: [
            { id: 'q1', type: 'single-choice', text: 'What is JSX?', options: ['A JavaScript syntax extension', 'A CSS pre-processor', 'A database query language'], isRequired: true },
            { id: 'q2', type: 'short-text', text: 'What function renders a React component to the DOM?', isRequired: true, maxLength: 50 },
            { id: 'q3', type: 'numeric', text: 'Years of professional React experience?', isRequired: true, range: { min: 0, max: 20 } },
            { id: 'q4', type: 'long-text', text: 'Describe the difference between state and props.', isRequired: true },
            { id: 'q5', type: 'multi-choice', text: 'Which of the following are valid React hooks?', options: ['useState', 'useEffect', 'useContext', 'useQuery'], isRequired: true },
            { id: 'q6', type: 'single-choice', text: 'Familiar with state libraries like Redux or Zustand?', options: ['Yes', 'No'], isRequired: true },
            { id: 'q7', type: 'long-text', text: 'Describe a complex component you have built.', isRequired: false, condition: { questionId: 'q3', value: '2' } }, 
            { id: 'q8', type: 'short-text', text: 'What is a "key" prop and why is it important in lists?', isRequired: true },
            { id: 'q9', type: 'single-choice', text: 'Purpose of the virtual DOM?', options: ['To improve performance', 'To handle styling', 'To manage API calls'], isRequired: true },
            { id: 'q10', type: 'file-upload', text: 'Please upload a code sample.', isRequired: false },
          ],
        },
      ],
    },
    
    {
      jobId: 'job-2',
      sections: [
        {
          id: 'cpp-sec1',
          title: 'C++ & OOP Principles',
          questions: [
            { id: 'c1', type: 'long-text', text: 'Explain RAII (Resource Acquisition Is Initialization).', isRequired: true },
            { id: 'c2', type: 'single-choice', text: 'What is a smart pointer?', options: ['A pointer that manages memory automatically', 'A pointer to a function', 'An integer'], isRequired: true },
            { id: 'c3', type: 'multi-choice', text: 'Which are pillars of OOP?', options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Compilation'], isRequired: true },
            { id: 'c4', type: 'short-text', text: 'Difference between `new`/`delete` and `malloc`/`free`?', isRequired: true },
            { id: 'c5', type: 'numeric', text: 'Comfort level with templates (1-10)?', isRequired: true, range: { min: 1, max: 10 } },
            { id: 'c6', type: 'single-choice', text: 'What does the `virtual` keyword do?', options: ['Enables dynamic dispatch', 'Makes the method static', 'Prevents inheritance'], isRequired: true },
            { id: 'c7', type: 'long-text', text: 'Describe a memory leak you have debugged.', isRequired: false, condition: { questionId: 'c5', value: '5' } }, 
            { id: 'c8', type: 'short-text', text: 'What is the "Rule of Three/Five/Zero"?', isRequired: true },
            { id: 'c9', type: 'single-choice', text: 'Is C++ compiled or interpreted?', options: ['Compiled', 'Interpreted'], isRequired: true },
            { id: 'c10', type: 'file-upload', text: 'Upload your resume.', isRequired: true },
          ],
        },
      ],
    },
  
    {
      jobId: 'job-3',
      sections: [
        {
          id: 'js-sec1',
          title: 'Core JavaScript & Asynchronous Programming',
          questions: [
            { id: 'j1', type: 'long-text', text: 'Explain the difference between `==` and `===`.', isRequired: true },
            { id: 'j2', type: 'single-choice', text: 'What is a closure?', options: ['A function with access to its outer scope', 'A way to close a browser window', 'A type of loop'], isRequired: true },
            { id: 'j3', type: 'short-text', text: 'What is the event loop?', isRequired: true },
            { id: 'j4', type: 'multi-choice', text: 'Which methods are used for async operations?', options: ['Promises', 'async/await', 'Callbacks', 'for loops'], isRequired: true },
            { id: 'j5', type: 'numeric', text: 'Years of Node.js experience?', isRequired: true, range: { min: 0, max: 20 } },
            { id: 'j6', type: 'single-choice', text: 'What is `this` in an arrow function?', options: ['The enclosing lexical scope', 'The global object', 'The object that called it'], isRequired: true },
            { id: 'j7', type: 'long-text', text: 'Describe a time you optimized a slow API endpoint.', isRequired: false, condition: { questionId: 'j5', value: '1' } },
            { id: 'j8', type: 'short-text', text: 'What is CORS?', isRequired: true },
            { id: 'j9', type: 'single-choice', text: 'Experience with SQL and NoSQL databases?', options: ['Yes', 'No'], isRequired: true },
            { id: 'j10', type: 'file-upload', text: 'Link to your GitHub profile.', isRequired: false },
          ],
        },
      ],
    },
  ];
  await db.assessments.bulkAdd(assessments);
  
  console.log('Database seeded successfully!');
}