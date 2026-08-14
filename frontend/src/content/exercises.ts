/** One answer field of a two-column exercise. Copy for it lives in fieldCopy.ts. */
export type ExerciseFieldMeta = {
  label: string;
  /** Words the answer accepts, enforced on input and shown in the placeholder. */
  wordLimit?: number;
  required?: boolean;
};

export type ExerciseMeta = {
  id: string;
  title: string;
  route: string;
  type: 'text' | 'table' | 'two-column';
  props?: {
    multiline?: boolean;
    compact?: boolean;
    questionLabel?: string;
    /** Words the answer accepts, enforced on input and shown in the placeholder. */
    wordLimit?: number;
    required?: boolean;
    headers?: string[]; // for tables
    rows?: number; // for tables
    columns?: number; // for tables (optional if headers provided)
    subTitle?: string; // for table exercises
    description?: string; // for table exercises
    leftColumn?: {
      title: string;
      description?: string;
      fields: ExerciseFieldMeta[];
    };
    rightColumn?: {
      title: string;
      description?: string;
      fields: ExerciseFieldMeta[];
    };
  };
};

// Order matches the course canvas flow: Reflection after Part 1, then The course, ILO, etc.
export const exercisesMeta: ExerciseMeta[] = [
  {
    id: 'reflectionGoodTeaching',
    title: 'Reflection',
    route: '/exercise/reflection-good-teaching',
    type: 'text',
    props: {
      multiline: true,
      compact: true,
      required: true,
      questionLabel:
        'What are, in your opinion, the characteristics of good teaching and learning at university?',
      wordLimit: 150,
    },
  },
  {
    id: 'courseInfo', 
    title: 'Course Information', 
    route: '/exercise/course-info', 
    type: 'two-column', 
    props: { 
      leftColumn: {
        title: 'The course',
        description: '',
        fields: [
          { label: 'curriculum', wordLimit: 200, required: true },
          { label: 'nameAndScope', wordLimit: 150, required: true },
          { label: 'focus', wordLimit: 200, required: true }
        ]
      },
      rightColumn: {
        title: 'Course context',
        description: '',
        fields: [
          { label: 'targetStudents', wordLimit: 150, required: true },
          { label: 'sizeAndEnvironment', wordLimit: 150, required: true }
        ]
      }
    } 
  },
  { 
    id: 'learningObjectives', 
    title: 'Intended learning outcomes (ILOs)', 
    route: '/exercise/learning-objectives', 
    type: 'two-column', 
    props: { 
      leftColumn: {
        title: 'Intended learning outcomes (ILOs)',
        description: '',
        fields: [
          { label: 'ilosBeforeAI', wordLimit: 150, required: true },
          { label: 'ilosAfterAI', wordLimit: 150, required: true },
          { label: 'argueChoice', wordLimit: 150, required: true }
        ]
      },
      rightColumn: {
        title: 'Chat with the course Chatbot',
        fields: []
      }
    } 
  },
  { 
    id: 'coreContent', 
    title: 'Core Content', 
    route: '/exercise/core-content', 
    type: 'two-column', 
    props: { 
      leftColumn: {
        title: 'Core content',
        description: 'Analyse the content of the course you are planning or developing. Use the following categorization (Must know content of the course, should know content of the course and nice to know content of the course) as a template. Remember to take into consideration the student\'s workload.',
        fields: [
          { label: 'mustKnow', wordLimit: 150, required: true },
          { label: 'shouldKnow', wordLimit: 150, required: true },
          { label: 'niceToKnow', wordLimit: 150, required: true }
        ]
      },
      rightColumn: {
        title: '',
        fields: []
      }
    } 
  },
  { 
    id: 'teachingMethods', 
    title: 'Teaching methods', 
    route: '/exercise/teaching-methods', 
    type: 'table', 
    props: { 
      description: 'Select between 3 to 5 of the ILOs of your course and write down: what kind of active teaching methods would support your students attaining the ILO, what students are doing, and what resources do you need.',
      headers: ['Intended learning outcomes', 'Teaching methods', "Students' actions", 'Resources (e.g. teachers, teaching assistants, tools, environments)'],
      rows: 5
    } 
  },
  { 
    id: 'assessmentMethods', 
    title: 'Assessment methods', 
    route: '/exercise/assessment-methods', 
    type: 'table', 
    props: { 
      subTitle: 'Course alignment',
      description: 'Based on the ILO, content and teaching methods of your course, which assessment methods would be suitable and why? List the assessment methods that correspond to each ILO below.',
      headers: ['Intended learning outcomes', 'Teaching methods', 'Assessment methods'],
      rows: 5
    } 
  },
  { 
    id: 'evaluationAndReflection', 
    title: 'Evaluation of the plan and reflection', 
    route: '/exercise/evaluation-and-reflection', 
    type: 'two-column', 
    props: { 
      leftColumn: {
        title: 'Describe assessment methods',
        description: 'How will you assess the students\' learning during and at the end of the course?',
        fields: [
          { label: 'describeAssessmentMethods', wordLimit: 150, required: true }
        ]
      },
      rightColumn: {
        title: 'Constructive alignment reflection',
        description: 'Does your course plan meet the criteria of constructive alignment?',
        fields: [
          { label: 'constructiveAlignmentReflection', wordLimit: 200, required: true }
        ]
      }
    } 
  },
];


