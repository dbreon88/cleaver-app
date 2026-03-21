const mockSubscription = { unsubscribe: jest.fn() }

const mockSupabaseClient = {
  auth: {
    getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
    onAuthStateChange: jest.fn().mockReturnValue({
      data: { subscription: mockSubscription },
    }),
    getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
    signInWithOAuth: jest.fn().mockResolvedValue({ error: null }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
    exchangeCodeForSession: jest.fn().mockResolvedValue({ error: null }),
  },
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    insert: jest.fn().mockResolvedValue({ error: null }),
  }),
  storage: {
    from: jest.fn().mockReturnValue({
      upload: jest.fn().mockResolvedValue({ error: null }),
      getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: '' } }),
    }),
  },
}

export const createBrowserClient = jest.fn().mockReturnValue(mockSupabaseClient)
export const createServerClient = jest.fn().mockReturnValue(mockSupabaseClient)
