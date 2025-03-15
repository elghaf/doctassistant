// Sample appointments for development and testing

export const sampleAppointments = [
  {
    id: "a1",
    appointment_date: new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000,
    ).toISOString(), // 3 days from now
    time_slot: "10:00 AM",
    appointment_type: "Check-up",
    status: "confirmed",
    notes: "Annual physical examination",
    duration: 30,
    reason: "Annual check-up",
  },
  {
    id: "a2",
    appointment_date: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString(), // 7 days from now
    time_slot: "2:30 PM",
    appointment_type: "Follow-up",
    status: "pending",
    notes: "Follow-up on lab results",
    duration: 20,
    reason: "Review recent lab work",
  },
  {
    id: "a3",
    appointment_date: new Date(
      Date.now() + 14 * 24 * 60 * 60 * 1000,
    ).toISOString(), // 14 days from now
    time_slot: "11:15 AM",
    appointment_type: "Consultation",
    status: "pending",
    notes: "Initial consultation with specialist",
    duration: 45,
    reason: "Specialist referral",
  },
];

export const sampleAppointmentSlots = [
  // Generate slots for the next 14 days
  ...Array.from({ length: 14 })
    .map((_, dayIndex) => {
      const date = new Date();
      date.setDate(date.getDate() + dayIndex + 1); // Start from tomorrow

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) return [];

      // Generate slots for each day
      return Array.from({ length: 8 }).map((_, hourIndex) => {
        const startHour = 9 + hourIndex; // 9 AM to 4 PM
        const slotDate = new Date(date);
        slotDate.setHours(startHour, 0, 0, 0);

        const endDate = new Date(slotDate);
        endDate.setHours(startHour + 1, 0, 0, 0);

        return {
          id: `slot_${dayIndex}_${hourIndex}`,
          start_time: slotDate.toISOString(),
          end_time: endDate.toISOString(),
          is_available: Math.random() > 0.3, // 70% chance of being available
        };
      });
    })
    .flat()
    .filter((slot) => slot.length !== 0), // Remove empty arrays from weekends
];

export const insertSampleAppointments = async (
  supabase: any,
  patientId: string,
  doctorId: string,
) => {
  try {
    // Insert appointment slots
    for (const slot of sampleAppointmentSlots) {
      const { error } = await supabase.from("appointment_slots").insert({
        ...slot,
        doctor_id: doctorId,
      });

      if (error) throw error;
    }

    // Insert appointments
    for (const appointment of sampleAppointments) {
      const { error } = await supabase.from("appointments").insert({
        ...appointment,
        patient_id: patientId,
        doctor_id: doctorId,
      });

      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error inserting sample appointments:", error);
    return { success: false, error };
  }
};
