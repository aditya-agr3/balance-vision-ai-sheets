import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://cnmiltlngjujssfrkzir.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNubWlsdGxuZ2p1anNzZnJremlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwOTI5ODgsImV4cCI6MjA2ODY2ODk4OH0.rW3jMx4c6oIw2cTpvPTjjxrWWRJgCJynJ9qd5lK26u0"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)