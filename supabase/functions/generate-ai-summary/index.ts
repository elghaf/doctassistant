import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { patientId, prompt, options } = await req.json();

    if (!patientId) {
      throw new Error("Patient ID is required");
    }

    // Get patient data
    const { data: patient, error: patientError } = await supabaseClient
      .from("patients")
      .select("*")
      .eq("id", patientId)
      .single();

    if (patientError) throw patientError;

    // Get medical history
    const { data: medicalHistory, error: medicalHistoryError } =
      await supabaseClient
        .from("medical_history")
        .select("*")
        .eq("patient_id", patientId)
        .single();

    // Get recent visits
    const { data: visits, error: visitsError } = await supabaseClient
      .from("visits")
      .select("*")
      .eq("patient_id", patientId)
      .order("visit_date", { ascending: false })
      .limit(3);

    // Get symptoms
    const { data: symptoms, error: symptomsError } = await supabaseClient
      .from("symptoms")
      .select("*")
      .eq("patient_id", patientId);

    // Combine all patient data
    const patientData = {
      patient,
      medicalHistory: medicalHistory || {},
      recentVisits: visits || [],
      symptoms: symptoms || [],
    };

    // In a real implementation, you would call an AI service here
    // For this example, we'll generate a mock summary
    const summary = generateMockSummary(
      patientData,
      options?.summaryType || "comprehensive",
    );
    const treatmentRecommendations = generateMockTreatment(
      patientData,
      options?.summaryType || "comprehensive",
    );

    // Save the summary to the database
    const { data: savedSummary, error: saveError } = await supabaseClient
      .from("ai_summaries")
      .insert({
        patient_id: patientId,
        summary,
        treatment_recommendations: treatmentRecommendations,
        model_type: options?.modelType || "gpt-4",
        summary_type: options?.summaryType || "comprehensive",
      })
      .select()
      .single();

    if (saveError) throw saveError;

    return new Response(
      JSON.stringify({
        summary,
        treatmentRecommendations,
        id: savedSummary.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

// Mock functions to generate summaries
function generateMockSummary(patientData: any, type: string): string {
  const patient = patientData.patient;
  const fullName = `${patient.first_name} ${patient.last_name}`;

  if (type === "comprehensive") {
    return `Patient ${fullName} is a ${calculateAge(patient.date_of_birth)}-year-old ${patient.gender.toLowerCase()} with a history of hypertension and Type 2 diabetes. Recent lab work shows elevated HbA1c levels (7.8%) and borderline high cholesterol (LDL 145 mg/dL). Blood pressure during the most recent visit was 142/88 mmHg, indicating suboptimal control. Patient reports increased fatigue and occasional blurred vision over the past month. Current medications include Lisinopril 10mg daily and Metformin 500mg twice daily. Patient has been compliant with medication but admits to inconsistent dietary adherence and minimal exercise. Family history is significant for cardiovascular disease and diabetes.`;
  } else if (type === "concise") {
    return `${calculateAge(patient.date_of_birth)}${patient.gender.charAt(0)} with HTN and T2DM. Recent labs: HbA1c 7.8%, LDL 145 mg/dL. BP 142/88 mmHg. Reports fatigue and blurred vision. Medications: Lisinopril 10mg QD, Metformin 500mg BID. Medication adherence good, diet/exercise poor. FH: CVD, DM.`;
  } else if (type === "specialist") {
    return `I am referring ${fullName}, a ${calculateAge(patient.date_of_birth)}-year-old ${patient.gender.toLowerCase()} with poorly controlled hypertension (142/88 mmHg) and Type 2 diabetes (HbA1c 7.8%) despite current management with Lisinopril 10mg daily and Metformin 500mg BID. Patient reports worsening fatigue and intermittent blurred vision. Lipid panel shows elevated LDL (145 mg/dL). Family history significant for premature cardiovascular disease. Requesting endocrinology consultation for optimization of diabetes management and cardiovascular risk assessment.`;
  } else {
    return `${fullName}, we've reviewed your recent health information and noticed a few things we should discuss. Your blood sugar levels are running a bit higher than our target, and your blood pressure is also slightly elevated. The symptoms you mentioned - feeling tired and sometimes having blurry vision - might be related to these readings. Your current medications are helping, but we may need to adjust them or discuss some lifestyle changes to help you feel better and prevent complications. Let's talk about some simple steps that might make a big difference in how you feel day-to-day.`;
  }
}

function generateMockTreatment(patientData: any, type: string): string {
  if (type === "comprehensive" || type === "specialist") {
    return `1. Medication Adjustments:
   - Increase Lisinopril to 20mg daily to improve blood pressure control
   - Continue Metformin 500mg BID
   - Add Empagliflozin 10mg daily to improve glycemic control and provide cardiovascular benefit
   - Consider starting Atorvastatin 20mg daily for hyperlipidemia

2. Monitoring:
   - Home blood pressure monitoring daily, target <130/80 mmHg
   - Blood glucose monitoring BID, fasting and 2 hours post-dinner
   - Follow-up labs in 3 months: HbA1c, comprehensive metabolic panel, lipid panel
   - Ophthalmology referral for diabetic retinopathy screening

3. Lifestyle Modifications:
   - Detailed nutrition plan with focus on low-sodium DASH diet
   - Structured exercise program: 30 minutes of moderate activity 5 days/week
   - Weight loss goal of 5-7% of body weight over 6 months

4. Follow-up:
   - Schedule endocrinology consultation within 1 month
   - Return for primary care follow-up in 6 weeks`;
  } else if (type === "concise") {
    return `1. Meds: ↑ Lisinopril to 20mg QD, continue Metformin, add Empagliflozin 10mg QD, start Atorvastatin 20mg QD
2. Monitor: Daily BP, BID glucose, labs in 3mo, eye exam
3. Lifestyle: DASH diet, exercise 30min x5/wk, 5-7% weight loss
4. F/U: Endo 1mo, PCP 6wks`;
  } else {
    return `Here's our plan to help you feel better:

1. We're going to slightly increase your blood pressure medication and add a new diabetes medication that can help your heart too.

2. Let's track your blood pressure at home and check your blood sugar levels twice a day to see how these changes are working.

3. Small changes to your diet can make a big difference - I'll connect you with our nutritionist to create a simple meal plan that works for your lifestyle.

4. Adding just a short 30-minute walk most days can improve your energy levels and help both your blood pressure and blood sugar.

5. We'll check in again in about 6 weeks to see how you're feeling and if we need to make any adjustments.

Does this plan sound manageable for you?`;
  }
}

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
