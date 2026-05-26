export const courseCopy = {
  frontpage: { 
    title: 'Course Design in Higher Education MOOC',
    hero: 'Learn to design effective online courses for higher education'
  },
  assignment: {
    title: 'Course design canvas',
    leftColumn: {
      title: 'What is this assignment?',
      intro:
        'In this exercise you\'ll start creating a course plan in canvas form. You will develop your course plan further in the next course (Constructive alignment in course design, 2 ECTS course). You can select an existing course or a completely new course that you could be teaching as the object of your course design assignment. You may choose a course from university curricula (',
      linkLabel: 'University of Helsinki courses',
      linkHref: 'https://studies.helsinki.fi/courses',
      outro: ') or think about your own course that you\'re currently teaching.',
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
        'For each submission, you will receive two anonymous reviews. You will also need to provide three reviews for other peers anonymously. The selection of the canvas that you are requested to peer review is done automatically. The peer review will be done using a Likert scale of 1 (Strongly disagree) to 5 (Strongly agree).',
        'The peer review criteria for each submission can be seen further in this canvas.',
      ],
    }
  },
  part1: {
    title: 'Part 1',
    instruction: 'Complete this part, then go to the last page of the canvas to generate a link. You can add the link to the peer review exercise in Chapter 1, Topic 3.',
    peerReviewCriteria: [
      'The reflection includes pedagogical argumentation which utilizes relevant concepts, supported by the course materials in a comprehensive way.',
      'The course\'s target group has been analysed in depth.',
      'The learning environment has been described thoroughly.',
      'Course\'s status as part of the degree programme curriculum has been considered extensively.',
      'The aims of the course development have been identified and analyzed in an insightful way.'
    ]
  },
  part2: {
    title: 'Part 2',
    instruction: 'Complete this part, then go to the last page of the canvas to generate a link. You can add the link to the peer review exercise in Chapter 2, Topic 3.',
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
    title: 'Part 3',
    instruction: 'Complete this part, then go to the last page of the canvas to generate a link. You can add the link to the peer review exercise in Chapter 3, Topic 1.',
    peerReviewCriteria: [
      'The choice of the core content aligns with the ILOs.'
    ]
  },
  part4: {
    title: 'Part 4',
    instruction: 'Complete this part, then go to the last page of the canvas to generate a link. You can add the link to the peer review exercise in Chapter 4, Topic 2.',
    peerReviewCriteria: [
      'The teaching methods comprehensively apply the principles of constructively aligned teaching to the discipline/subject.',
      'The teaching methods effectively support students in active learning.'
    ]
  },
  part5: {
    title: 'Part 5',
    instruction: 'Complete this part, then go to the last page of the canvas to generate a link. You can add the link to the peer review exercise in Chapter 5, Topic 1.',
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
      'You have completed the course design MOOC. Thank you for your participation!',
  },
  chapters: [
    { id: 'intro', title: 'Introduction', intro: 'Welcome to the course design journey' },
    { id: 'planning', title: 'Planning Phase', intro: 'Define your learning objectives and outcomes' },
    { id: 'design', title: 'Design Phase', intro: 'Structure your course content and activities' },
    { id: 'implementation', title: 'Implementation', intro: 'Put your design into practice' },
    { id: 'evaluation', title: 'Evaluation', intro: 'Assess and improve your course' }
  ],
};


