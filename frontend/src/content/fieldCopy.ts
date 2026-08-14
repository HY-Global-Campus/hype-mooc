export type FieldCopyEntry = {
  label: string;
  description?: string;
  placeholder?: string;
};

const fieldCopyByExercise: Record<string, Record<string, FieldCopyEntry>> = {
  courseInfo: {
    curriculum: {
      label: 'Curriculum',
      description:
        'Describe where the course is in the curriculum of your degree program.',
      placeholder: 'Type your answer here (max 200 words)',
    },
    nameAndScope: {
      label: 'Name and scope',
      description: 'What is the name and scope of your course?',
      placeholder: 'Type your answer here (max 150 words)',
    },
    focus: {
      label: 'Focus',
      description: 'What is the focus of your course development task?',
      placeholder: 'Type your answer here (max 200 words)',
    },
    targetStudents: {
      label: 'Target students',
      description: 'Who are the target students?',
      placeholder: 'Type your answer here (max 150 words)',
    },
    sizeAndEnvironment: {
      label: 'Size and learning environment',
      description:
        'Describe the size (number of students) of the course and the learning environment.',
      placeholder: 'Type your answer here (max 150 words)',
    },
  },
  coreContent: {
    mustKnow: {
      label: 'Must know (80%)',
      placeholder: 'Type your answer here (max 150 words)',
    },
    shouldKnow: {
      label: 'Should know (15%)',
      placeholder: 'Type your answer here (max 150 words)',
    },
    niceToKnow: {
      label: 'Nice to know (5%)',
      placeholder: 'Type your answer here (max 150 words)',
    },
  },
  learningObjectives: {
    ilosBeforeAI: {
      label: '1. ILOs before AI',
      description:
        'What are the ILOs of your course? Define 3 to 5 ILOs. If you are developing an existing course, develop them further. If you are working with a new course, formulate the ILOs.',
      placeholder: 'Type your answer here (max 150 words)',
    },
    ilosAfterAI: {
      label: '2. ILOs after AI (final ILOs)',
      description:
        'Ask the Chatbot to give you feedback about your ILOs. Start by using the following prompt: "Please comment how the intended learning outcomes of my course could be improved. Please make sure that my intended learning outcomes use the following structure: Upon completing the course + student is able to + Bloom\'s taxonomy action verb + object and context. Give suggestions for the Bloom\'s taxonomy action verbs. Next. I will paste the text that you should comment." After the feedback, adjust your ILOs if needed.',
      placeholder: 'Type your answer here (max 150 words)',
    },
    argueChoice: {
      label: '3. Argue your choice of the final ILOs and reflect on the use of AI',
      description:
        'Remember to be critical when considering AI based feedback. Reflect on the feedback given by AI and justify your choice of ILOs.',
      placeholder: 'Type your answer here (max 150 words)',
    },
  },
  evaluationAndReflection: {
    describeAssessmentMethods: {
      label: 'Describe assessment methods',
      placeholder: 'Type your answer here (max 150 words)',
    },
    constructiveAlignmentReflection: {
      label: 'Constructive alignment reflection',
      placeholder: 'Type your answer here (max 200 words)',
    },
  },
};

/** Returns a user-facing label for an exercise field key. */
export function getFieldDisplayLabel(exerciseId: string, fieldKey: string): string {
  return fieldCopyByExercise[exerciseId]?.[fieldKey]?.label ?? fieldKey;
}

/** Returns optional helper text shown below the field label. */
export function getFieldDescription(
  exerciseId: string,
  fieldKey: string
): string | undefined {
  return fieldCopyByExercise[exerciseId]?.[fieldKey]?.description;
}

/** Returns placeholder text for an input, with exercise-specific override when defined. */
export function getFieldPlaceholder(
  exerciseId: string,
  fieldKey: string,
  fallback: string
): string {
  return fieldCopyByExercise[exerciseId]?.[fieldKey]?.placeholder ?? fallback;
}
