import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://toevrkjmlalbyfqcttnq.supabase.co'
const supabaseAnonKey = 'sb_publishable_UL6ePGKrjxIo6OmQrogt7w_W3DP_uXh'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


// تسجيل مستخدم جديد
export const signUpUser = async (email, password, name, role) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return { error }

  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{ id: data.user.id, email, name, role }])
  if (profileError) return { error: profileError }

  return { user: data.user }
}

// تسجيل الدخول
export const signInUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error }
  return { user: data.user }
}

// تسجيل الخروج
export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// جلب الدروس
export const getLessons = async () => {
  const { data, error } = await supabase.from('lessons').select('*')
  return { data, error }
}

// جلب الموارد لكل درس
export const getResourcesByLesson = async (lessonId) => {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('lesson_id', lessonId)
  return { data, error }
}

// تحديث تقدم الطالب
export const updateProgress = async (userId, lessonId, updates) => {
  const { data, error } = await supabase
    .from('progress')
    .upsert({ user_id: userId, lesson_id: lessonId, ...updates }, { onConflict: ['user_id','lesson_id'] })
  return { data, error }
}
