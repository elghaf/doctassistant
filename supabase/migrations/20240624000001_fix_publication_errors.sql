-- Check if publication exists before adding tables
DO $$
BEGIN
    -- Check if the publication exists
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        -- Check if patients table is already in the publication
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' AND tablename = 'patients'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE patients;
        END IF;
        
        -- Check if visits table is already in the publication
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' AND tablename = 'visits'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE visits;
        END IF;
        
        -- Check if symptoms table is already in the publication
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' AND tablename = 'symptoms'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE symptoms;
        END IF;
        
        -- Check if patient_summaries table is already in the publication
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' AND tablename = 'patient_summaries'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE patient_summaries;
        END IF;
    ELSE
        -- Create the publication if it doesn't exist
        CREATE PUBLICATION supabase_realtime FOR TABLE patients, visits, symptoms, patient_summaries;
    END IF;
END
$$;