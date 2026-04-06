import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Confirms which git revision Vercel built. If this never updates after a push,
 * the project is not deploying from the expected repo/branch.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    memberRoutesExpected: true,
    vercelGitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    vercelGitCommitRef: process.env.VERCEL_GIT_COMMIT_REF ?? null,
  })
}
