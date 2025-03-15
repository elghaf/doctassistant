// Sample medical reports for development and testing

export const sampleReports = [
  {
    id: "r1",
    title: "Complete Blood Count (CBC)",
    type: "lab results",
    summary:
      "Blood test results show normal white blood cell count, red blood cell count, and platelet levels. Hemoglobin and hematocrit are within normal ranges. No abnormalities detected.",
    aiSummary:
      "Your blood test results are all normal, indicating good overall health. Your immune system (white blood cells), oxygen-carrying capacity (red blood cells and hemoglobin), and blood clotting ability (platelets) are all functioning properly.",
    status: "normal",
    reportDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
  },
  {
    id: "r2",
    title: "Lipid Panel",
    type: "lab results",
    summary:
      "Cholesterol panel shows elevated LDL (bad cholesterol) at 145 mg/dL (target <100 mg/dL). Total cholesterol is 220 mg/dL (target <200 mg/dL). HDL (good cholesterol) is normal at 55 mg/dL. Triglycerides are slightly elevated at 175 mg/dL (target <150 mg/dL).",
    aiSummary:
      "Your cholesterol test shows higher than recommended levels of LDL (bad) cholesterol and total cholesterol, with slightly elevated triglycerides. This pattern can increase your risk of heart disease over time. Your HDL (good) cholesterol is at a healthy level, which is positive. Lifestyle changes like reducing saturated fats, increasing exercise, and possibly medication may be recommended by your doctor.",
    status: "abnormal",
    reportDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  },
  {
    id: "r3",
    title: "Chest X-Ray",
    type: "imaging",
    summary:
      "Chest X-ray shows clear lung fields with no evidence of infiltrates, effusions, or pneumothorax. Heart size is normal. No acute cardiopulmonary process identified.",
    aiSummary:
      "Your chest X-ray shows healthy lungs with no signs of infection, fluid buildup, or collapsed areas. Your heart appears to be a normal size. This is a completely normal chest X-ray with no concerning findings.",
    status: "normal",
    reportDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
  },
  {
    id: "r4",
    title: "Comprehensive Metabolic Panel",
    type: "lab results",
    summary:
      "Liver enzymes (ALT, AST) are mildly elevated. ALT is 65 U/L (normal range 7-56 U/L) and AST is 45 U/L (normal range 5-40 U/L). Other metabolic indicators including kidney function, electrolytes, and blood glucose are within normal limits.",
    aiSummary:
      "Your metabolic panel shows slightly elevated liver enzymes, which could indicate mild liver stress or inflammation. This is not uncommon and can be caused by medications, alcohol consumption, or other factors. All other values, including kidney function and blood sugar, are normal. Your doctor may recommend follow-up testing or lifestyle modifications.",
    status: "abnormal",
    reportDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
  },
  {
    id: "r5",
    title: "Echocardiogram",
    type: "imaging",
    summary:
      "Echocardiogram shows normal left ventricular size and function with ejection fraction of 60%. Normal right ventricular function. No significant valvular abnormalities. No pericardial effusion.",
    aiSummary:
      "Your heart ultrasound shows normal heart function. The main pumping chamber (left ventricle) is working efficiently, pumping 60% of its blood volume with each contraction, which is healthy. All heart valves are functioning properly, and there is no fluid around the heart. This is a completely normal echocardiogram.",
    status: "normal",
    reportDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
  },
];

export const insertSampleReports = async (
  supabase: any,
  patientId: string,
  doctorId: string,
) => {
  try {
    for (const report of sampleReports) {
      const { error } = await supabase.from("medical_reports").insert({
        id: report.id,
        patient_id: patientId,
        doctor_id: doctorId,
        title: report.title,
        type: report.type,
        summary: report.summary,
        ai_summary: report.aiSummary,
        status: report.status,
        report_date: report.reportDate.toISOString(),
      });

      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error inserting sample reports:", error);
    return { success: false, error };
  }
};
