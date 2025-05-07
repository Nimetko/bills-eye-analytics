
import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://jitpiocmbihxqtchouic.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppdHBpb2NtYmloeHF0Y2hvdWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NzQ3OTQsImV4cCI6MjA2MTI1MDc5NH0.dWeLUWEuBRnRbV-HLOzfUuQ5RMC-m0VC7umhcYV9e7k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
