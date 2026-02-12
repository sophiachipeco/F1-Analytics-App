// lib/supabase.ts
// Stubbed for stability after Supabase removal. 
// Proper auth will be implemented by the partner later.

export const supabase: any = {
    auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        signInWithPassword: async () => ({ data: {}, error: null }),
        signUp: async () => ({ data: {}, error: null }),
        signOut: async () => ({ error: null }),
    },
};
