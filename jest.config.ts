import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@supabase/ssr$': '<rootDir>/src/lib/__mocks__/supabase-ssr.ts',
  },
}

export default createJestConfig(config)
