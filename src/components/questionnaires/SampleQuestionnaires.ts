// Sample questionnaires for development and testing

export const sampleQuestionnaires = [
  {
    id: "q1",
    title: "Annual Health Assessment",
    description:
      "Complete this questionnaire before your annual check-up appointment",
    sections: [
      {
        title: "General Health",
        questions: [
          {
            id: "q1_1",
            type: "radio",
            question: "How would you rate your overall health?",
            options: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
            required: true,
          },
          {
            id: "q1_2",
            type: "checkbox",
            question:
              "Have you experienced any of the following symptoms in the past 3 months? (Select all that apply)",
            options: [
              "Persistent fatigue",
              "Unexplained weight loss or gain",
              "Chronic pain",
              "Difficulty sleeping",
              "Digestive issues",
              "Headaches",
              "Dizziness",
              "None of the above",
            ],
            required: true,
          },
          {
            id: "q1_3",
            type: "textarea",
            question:
              "Please describe any health concerns you'd like to discuss with your doctor:",
            required: false,
          },
        ],
      },
      {
        title: "Medications",
        questions: [
          {
            id: "q1_4",
            type: "radio",
            question: "Are you currently taking any medications?",
            options: ["Yes", "No"],
            required: true,
          },
          {
            id: "q1_5",
            type: "textarea",
            question:
              "If yes, please list all medications, including over-the-counter medications and supplements:",
            required: false,
            conditionalOn: { questionId: "q1_4", value: "Yes" },
          },
          {
            id: "q1_6",
            type: "radio",
            question: "Do you have any medication allergies?",
            options: ["Yes", "No", "Not sure"],
            required: true,
          },
          {
            id: "q1_7",
            type: "textarea",
            question:
              "If yes, please list all medication allergies and your reactions:",
            required: false,
            conditionalOn: { questionId: "q1_6", value: "Yes" },
          },
        ],
      },
      {
        title: "Lifestyle",
        questions: [
          {
            id: "q1_8",
            type: "radio",
            question: "Do you smoke or use tobacco products?",
            options: ["Yes, currently", "Previously, but quit", "Never"],
            required: true,
          },
          {
            id: "q1_9",
            type: "radio",
            question: "How often do you consume alcoholic beverages?",
            options: [
              "Daily",
              "Several times a week",
              "Once a week",
              "Occasionally",
              "Never",
            ],
            required: true,
          },
          {
            id: "q1_10",
            type: "radio",
            question:
              "How many days per week do you engage in moderate to vigorous physical activity?",
            options: ["0", "1-2", "3-4", "5+"],
            required: true,
          },
          {
            id: "q1_11",
            type: "textarea",
            question: "Please describe your typical exercise routine:",
            required: false,
          },
        ],
      },
    ],
  },
  {
    id: "q2",
    title: "Pre-Appointment Symptoms Assessment",
    description:
      "Please complete this questionnaire at least 24 hours before your scheduled appointment",
    sections: [
      {
        title: "Current Symptoms",
        questions: [
          {
            id: "q2_1",
            type: "textarea",
            question: "What is the main reason for your visit today?",
            required: true,
          },
          {
            id: "q2_2",
            type: "radio",
            question: "When did your symptoms begin?",
            options: [
              "Within the last 24 hours",
              "Within the last week",
              "Within the last month",
              "More than a month ago",
            ],
            required: true,
          },
          {
            id: "q2_3",
            type: "radio",
            question: "How severe are your symptoms?",
            options: ["Mild", "Moderate", "Severe", "Extremely severe"],
            required: true,
          },
          {
            id: "q2_4",
            type: "checkbox",
            question:
              "Have you tried any of the following to relieve your symptoms? (Select all that apply)",
            options: [
              "Over-the-counter medication",
              "Prescription medication",
              "Rest",
              "Ice/heat",
              "Lifestyle changes",
              "Other treatments",
              "None of the above",
            ],
            required: true,
          },
        ],
      },
      {
        title: "Additional Information",
        questions: [
          {
            id: "q2_5",
            type: "radio",
            question: "Have you had similar symptoms in the past?",
            options: ["Yes", "No", "Not sure"],
            required: true,
          },
          {
            id: "q2_6",
            type: "textarea",
            question:
              "Is there anything else you would like your healthcare provider to know before your appointment?",
            required: false,
          },
        ],
      },
    ],
  },
  {
    id: "q3",
    title: "Mental Health Screening",
    description:
      "This confidential questionnaire helps us assess your mental wellbeing",
    sections: [
      {
        title: "Mood Assessment",
        questions: [
          {
            id: "q3_1",
            type: "radio",
            question:
              "Over the past 2 weeks, how often have you felt little interest or pleasure in doing things?",
            options: [
              "Not at all",
              "Several days",
              "More than half the days",
              "Nearly every day",
            ],
            required: true,
          },
          {
            id: "q3_2",
            type: "radio",
            question:
              "Over the past 2 weeks, how often have you felt down, depressed, or hopeless?",
            options: [
              "Not at all",
              "Several days",
              "More than half the days",
              "Nearly every day",
            ],
            required: true,
          },
          {
            id: "q3_3",
            type: "radio",
            question:
              "Over the past 2 weeks, how often have you felt nervous, anxious, or on edge?",
            options: [
              "Not at all",
              "Several days",
              "More than half the days",
              "Nearly every day",
            ],
            required: true,
          },
          {
            id: "q3_4",
            type: "radio",
            question:
              "Over the past 2 weeks, how often have you been unable to stop or control worrying?",
            options: [
              "Not at all",
              "Several days",
              "More than half the days",
              "Nearly every day",
            ],
            required: true,
          },
        ],
      },
      {
        title: "Sleep and Energy",
        questions: [
          {
            id: "q3_5",
            type: "radio",
            question:
              "Over the past 2 weeks, how often have you had trouble falling or staying asleep, or sleeping too much?",
            options: [
              "Not at all",
              "Several days",
              "More than half the days",
              "Nearly every day",
            ],
            required: true,
          },
          {
            id: "q3_6",
            type: "radio",
            question:
              "Over the past 2 weeks, how often have you felt tired or had little energy?",
            options: [
              "Not at all",
              "Several days",
              "More than half the days",
              "Nearly every day",
            ],
            required: true,
          },
        ],
      },
      {
        title: "Additional Information",
        questions: [
          {
            id: "q3_7",
            type: "textarea",
            question:
              "Is there anything else you would like to share about your mental health or wellbeing?",
            required: false,
          },
        ],
      },
    ],
  },
];

export const insertSampleQuestionnaires = async (
  supabase: any,
  patientId: string,
) => {
  try {
    // First, insert the questionnaire templates
    for (const questionnaire of sampleQuestionnaires) {
      const { data: questionnaireData, error: questionnaireError } =
        await supabase
          .from("questionnaires")
          .insert({
            id: questionnaire.id,
            title: questionnaire.title,
            description: questionnaire.description,
            type: "health",
            // Store the sections and questions as JSON in the database
            sections: JSON.stringify(questionnaire.sections),
          })
          .select();

      if (questionnaireError) throw questionnaireError;

      // Then assign the questionnaire to the patient
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7); // Due in 7 days

      const { error: assignmentError } = await supabase
        .from("patient_questionnaires")
        .insert({
          patient_id: patientId,
          questionnaire_id: questionnaire.id,
          status: "pending",
          due_date: dueDate.toISOString(),
        });

      if (assignmentError) throw assignmentError;
    }

    return { success: true };
  } catch (error) {
    console.error("Error inserting sample questionnaires:", error);
    return { success: false, error };
  }
};
