import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iupcmpyjlfxlwixjtjbe.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1cGNtcHlqbGZ4bHdpeGp0amJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE2NzUzODIsImV4cCI6MjAwNzI1MTM4Mn0.SkvV-YzefvkLLW9Z7mZV6XzmS7rN1Yw2k35xBRQ5nuM';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
