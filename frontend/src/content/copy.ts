/**
 * One numbered step of a part's instructions. The object form renders the step with an
 * inline link, used for the step that sends the student back to the MOOC.
 */
export type InstructionStep =
  | string
  | { intro: string; linkLabel: string; linkHref: string; outro: string };

/** Copy for one part's landing page. */
export type PartCopy = {
  title: string;
  intro: string;
  /** Closing sentence of the intro, emphasised: which part this chapter's exercise needs. */
  introEmphasis: string;
  instructions: InstructionStep[];
  peerReviewCriteria: string[];
};

export const courseCopy = {
  frontpage: { 
    title: 'Constructive Alignment in Course Design MOOC',
    hero: 'Learn to design effective online courses for higher education'
  },
  assignment: {
    title: 'Course design canvas',
    leftColumn: {
      title: 'What is this assignment?',
      intro:
        'In this exercise you\'ll start creating a course plan in canvas form. You will develop your course plan further in the next course (Constructive alignment in course design, 2 ECTS course). You can select an existing course or a completely new course that you could be teaching as the object of your course design assignment. You may choose a course from university curricula (e.g. ',
      linkLabel: 'University of Helsinki courses',
      linkHref: 'https://studies.helsinki.fi/courses',
      outro: ') or think about your own course that you\'re currently teaching or a course you could teach in the future.',
    },
    rightColumn: {
      title: 'Peer review criteria',
      intro: 'This assignment will be peer reviewed, so to complete it, you need to submit a link to this canvas five times.',
      submissionList: [
        '1st time: submit in Chapter 1, after filling in Part 1',
        '2nd time: submit in Chapter 2, after filling in Part 2',
        '3rd time: submit in Chapter 3, after filling in Part 3',
        '4th time: submit in Chapter 4, after filling in Part 4.',
        '5th time: submit in Chapter 5, after filling in Part 5.',
      ],
      outro: [
        'For each submission, you will receive two anonymous reviews. You will also need to provide three reviews for other peers anonymously. The selection of the canvas that you are requested to peer review is done automatically. Peer review will be conducted using a 5-point rating scale ranging from 1 (Strongly disagree) to 5 (Strongly agree).',
        'The peer review criteria for each submission can be seen further in this canvas.',
      ],
    }
  },
  part1: {
    title: 'Part 1: Good teaching and learning at university & your course',
    intro: 'The canvas has five parts, which you will fill in and submit several times throughout this course.',
    introEmphasis: 'You only need to fill in Part 1 for the Exercise in Chapter 1, Topic 3.',
    instructions: [
      'Please answer the questions under "Reflection", "The course" and "Course context". You can find them on the following pages by clicking the "Next" button below.',
      'After answering the questions in Part 1, come back to this page and copy the view-only link.',
      {
        intro: 'Return to the Exercise in MOOC ',
        linkLabel: 'Chapter 1, Topic 3',
        linkHref: 'https://courses.mooc.fi/org/uh-hype/courses/course-design-in-higher-education/chapter-1/teacher-as-a-key-person-planning-and-enacting-constructively-aligned-courses',
        outro: '.',
      },
      'Submit the view-only link to the Exercise and peer-review three other students\' canvases.',
    ],
    peerReviewCriteria: [
      'The reflection includes pedagogical argumentation which utilizes relevant concepts, supported by the course materials in a comprehensive way.',
      'The course\'s target group has been described thoroughly.',
      'The learning environment has been described thoroughly.',
      'Course\'s status as part of the degree programme curriculum has been considered extensively.',
      'The aims of the course development have been identified and analyzed in an insightful way.'
    ]
  },
  part2: {
    title: 'Part 2: Intended learning outcomes',
    intro: 'The canvas has five parts, which you will fill in and submit several times throughout this course.',
    introEmphasis: 'You only need to fill in Part 2 for the Exercise in Chapter 2, Topic 3.',
    instructions: [
      'Please answer the questions under "Intended learning outcomes (ILOs)". You can find them on the following page by clicking the "Next" button below.',
      'After answering the questions in Part 2, come back to this page and copy the view-only link.',
      {
        intro: 'Return to the Exercise in MOOC ',
        linkLabel: 'Chapter 2, Topic 3',
        linkHref: 'https://courses.mooc.fi/org/uh-hype/courses/course-design-in-higher-education/chapter-2/generic-academic-skills-as-learning-outcomes',
        outro: '.',
      },
      'Submit the view-only link to the Exercise and peer-review three other students\' canvases.',
    ],
    peerReviewCriteria: [
      'The ILOs are clear and easy to understand.',
      'The ILOs are measurable in concrete ways.',
      'The ILOs are achievable given the students\' skills.',
      'The ILOs are realistic regarding the students\' skills.',
      'The ILOs are relevant and related to the topic of the course.',
      'The student argues their choice of ILOs after using AI showing critical pedagogical thinking.'
    ]
  },
  part3: {
    title: 'Part 3: Core content',
    intro: 'The canvas has five parts, which you will fill in and submit several times throughout this course.',
    introEmphasis: 'You only need to fill in Part 3 for the Exercise in Chapter 3, Topic 1.',
    instructions: [
      'Please answer the questions under "Core content". You can find them on the following page by clicking the "Next" button below.',
      'After answering the questions in Part 3, come back to this page and copy the view-only link.',
      {
        intro: 'Return to the Exercise in MOOC ',
        linkLabel: 'Chapter 3, Topic 1',
        linkHref: 'https://courses.mooc.fi/org/uh-hype/courses/course-design-in-higher-education/chapter-3/core-content-analysis',
        outro: '.',
      },
      'Submit the view-only link to the Exercise and peer-review three other students\' canvases.',
    ],
    peerReviewCriteria: [
      'The choice of the core content aligns with the ILOs.'
    ]
  },
  part4: {
    title: 'Part 4: Teaching methods',
    intro: 'The canvas has five parts, which you will fill in and submit several times throughout this course.',
    introEmphasis: 'You only need to fill in Part 4 for the Exercise in Chapter 4, Topic 2.',
    instructions: [
      'Please answer the questions under "Teaching methods". You can find them on the following page by clicking the "Next" button below.',
      'After answering the questions in Part 4, come back to this page and copy the view-only link.',
      {
        intro: 'Return to the Exercise in MOOC ',
        linkLabel: 'Chapter 4, Topic 2',
        linkHref: 'https://courses.mooc.fi/org/uh-hype/courses/course-design-in-higher-education/chapter-4/activating-teaching-methods',
        outro: '.',
      },
      'Submit the view-only link to the Exercise and peer-review three other students\' canvases.',
    ],
    peerReviewCriteria: [
      'The teaching methods comprehensively apply the principles of constructively aligned teaching to the discipline/subject.',
      'The teaching methods effectively support students in active learning.'
    ]
  },
  part5: {
    title: 'Part 5: Assessment methods and reflection',
    intro: 'The canvas has five parts, which you will fill in and submit several times throughout this course.',
    introEmphasis: 'You only need to fill in Part 5 for the Exercise in Chapter 5, Topic 1.',
    instructions: [
      'Please answer the questions under "Assessment methods", "Describe assessment methods" and "Constructive alignment reflection". You can find them on the following pages by clicking the "Next" button below.',
      'After answering the questions in Part 5, come back to this page and copy the view-only link.',
      {
        intro: 'Return to the Exercise in MOOC ',
        linkLabel: 'Chapter 5, Topic 1',
        linkHref: 'https://courses.mooc.fi/org/uh-hype/courses/course-design-in-higher-education/chapter-5/assessment-of-students-learning',
        outro: '.',
      },
      'Submit the view-only link to the Exercise and peer-review three other students\' canvases.',
    ],
    peerReviewCriteria: [
      'The assessment methods are appropriate and insightful.',
      'The course syllabus comprehensively applies the principles of constructively aligned teaching to the discipline/subject.',
      'The course syllabus effectively supports students in active learning.',
      'The course syllabus clearly and concretely defines the learning outcomes.',
      'The course syllabus has been assessed critically both as a whole and, in particular, from the perspective of constructive alignment, utilising course materials.',
      'The work includes diverse and critical reflection on the writer\'s own learning.'
    ]
  },
  endpage: {
    congratulations: 'Congratulations!',
    message:
      'You have reached the end of the course design canvas. Please remember to continue the assignment by sharing the link on the course MOOC page.',
  },
  chapters: [
    { id: 'intro', title: 'Introduction', intro: 'Welcome to the course design journey' },
    { id: 'planning', title: 'Planning Phase', intro: 'Define your learning objectives and outcomes' },
    { id: 'design', title: 'Design Phase', intro: 'Structure your course content and activities' },
    { id: 'implementation', title: 'Implementation', intro: 'Put your design into practice' },
    { id: 'evaluation', title: 'Evaluation', intro: 'Assess and improve your course' }
  ],
};


