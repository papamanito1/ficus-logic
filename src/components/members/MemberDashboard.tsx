'use client'

import { useCallback, useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import type { BlogPost } from '@/data/insights'
import type { HireboundCareerOpening } from '@/lib/hirebound-careers'
import Button from '@/components/ui/Button'

type Tab = 'insights' | 'careers'

type CareersPayload = {
  base: HireboundCareerOpening[]
  delta: { hiddenIds: string[]; manualRoles: HireboundCareerOpening[] }
  merged: HireboundCareerOpening[]
  kvConfigured: boolean
}

const emptyInsightForm = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  category: 'Insights',
  author: 'Ficus Logic',
  publishedDate: new Date().toISOString().slice(0, 10),
  readTime: '5 min read',
  featured: false,
  imageUrl: '',
  tags: '',
}

export default function MemberDashboard() {
  const [tab, setTab] = useState<Tab>('insights')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [posts, setPosts] = useState<BlogPost[]>([])
  const [insightsKv, setInsightsKv] = useState(false)
  const [insightForm, setInsightForm] = useState(emptyInsightForm)

  const [careers, setCareers] = useState<CareersPayload | null>(null)

  const [careerPageUrl, setCareerPageUrl] = useState('')
  const [careerImportBusy, setCareerImportBusy] = useState(false)

  const [roleForm, setRoleForm] = useState({
    id: '',
    title: '',
    location: '',
    department: '',
    employmentType: 'Full-time',
    postedDate: new Date().toISOString().slice(0, 10),
    summary: '',
    externalUrl: 'https://in.app.hirebound.io/hb/openings',
  })

  const loadInsights = useCallback(async () => {
    const r = await fetch('/api/members/insights')
    if (!r.ok) {
      setError('Could not load insights.')
      return
    }
    const data = (await r.json()) as { posts: BlogPost[]; kvConfigured: boolean }
    setPosts(data.posts)
    setInsightsKv(data.kvConfigured)
  }, [])

  const loadCareers = useCallback(async () => {
    const r = await fetch('/api/members/careers')
    if (!r.ok) {
      setError('Could not load careers.')
      return
    }
    setCareers((await r.json()) as CareersPayload)
  }, [])

  useEffect(() => {
    setError(null)
    setMessage(null)
    if (tab === 'insights') void loadInsights()
    else void loadCareers()
  }, [tab, loadInsights, loadCareers])

  async function postJson(url: string, body: object) {
    setError(null)
    setMessage(null)
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = (await r.json().catch(() => ({}))) as { error?: string }
    if (!r.ok) {
      setError(data.error ?? 'Request failed')
      return false
    }
    setMessage('Saved. The public site will update shortly.')
    return true
  }

  async function deletePost(slug: string) {
    if (!confirm(`Remove “${slug}” from the live site?`)) return
    const ok = await postJson('/api/members/insights', { action: 'delete', slug })
    if (ok) await loadInsights()
  }

  async function submitInsight(e: React.FormEvent) {
    e.preventDefault()
    const post: BlogPost = {
      slug: insightForm.slug.trim(),
      title: insightForm.title.trim(),
      excerpt: insightForm.excerpt.trim() || insightForm.title.trim(),
      content: insightForm.content.trim(),
      category: insightForm.category.trim(),
      tags: insightForm.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      author: insightForm.author.trim(),
      publishedDate: insightForm.publishedDate.trim(),
      readTime: insightForm.readTime.trim(),
      featured: insightForm.featured,
      imageUrl:
        insightForm.imageUrl.trim() ||
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop',
    }
    const ok = await postJson('/api/members/insights', { action: 'upsert', post })
    if (ok) {
      setInsightForm(emptyInsightForm)
      await loadInsights()
    }
  }

  async function hideCareer(id: string) {
    const ok = await postJson('/api/members/careers', { action: 'hide', id })
    if (ok) await loadCareers()
  }

  async function unhideCareer(id: string) {
    const ok = await postJson('/api/members/careers', { action: 'unhide', id })
    if (ok) await loadCareers()
  }

  async function removeManual(id: string) {
    const ok = await postJson('/api/members/careers', { action: 'removeManual', id })
    if (ok) await loadCareers()
  }

  async function importFromCareerPageLink() {
    const url = careerPageUrl.trim()
    if (!url) {
      setError('Paste a Hirebound career page URL first.')
      return
    }
    setError(null)
    setMessage(null)
    setCareerImportBusy(true)
    try {
      const r = await fetch('/api/members/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'importCareerPageUrl', careerPageUrl: url }),
      })
      const data = (await r.json().catch(() => ({}))) as {
        error?: string
        role?: HireboundCareerOpening
      }
      if (!r.ok) {
        setError(data.error ?? 'Import failed')
        return
      }
      setMessage(
        data.role?.title
          ? `Added “${data.role.title}” to careers with Ficus e-Logic branding.`
          : 'Role added to careers.',
      )
      setCareerPageUrl('')
      await loadCareers()
    } finally {
      setCareerImportBusy(false)
    }
  }

  async function submitRole(e: React.FormEvent) {
    e.preventDefault()
    const role: HireboundCareerOpening = {
      id: roleForm.id.trim(),
      title: roleForm.title.trim(),
      location: roleForm.location.trim() || 'Location TBC',
      department: roleForm.department.trim() || 'General',
      employmentType: roleForm.employmentType.trim() || 'Full-time',
      postedDate: roleForm.postedDate.trim(),
      summary: roleForm.summary.trim(),
      externalUrl: roleForm.externalUrl.trim(),
    }
    const ok = await postJson('/api/members/careers', { action: 'upsertManual', role })
    if (ok) {
      setRoleForm({
        id: '',
        title: '',
        location: '',
        department: '',
        employmentType: 'Full-time',
        postedDate: new Date().toISOString().slice(0, 10),
        summary: '',
        externalUrl: 'https://in.app.hirebound.io/hb/openings',
      })
      await loadCareers()
    }
  }

  const hiddenSet = careers ? new Set(careers.delta.hiddenIds) : new Set()
  const visibleFromFeed = careers?.base.filter((o) => !hiddenSet.has(o.id)) ?? []
  const hiddenFromFeed = careers?.base.filter((o) => hiddenSet.has(o.id)) ?? []

  return (
    <div className="min-h-[70vh] bg-neutral-50 section-padding">
      <div className="container-narrow max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-display-sm text-neutral-900">Member dashboard</h1>
            <p className="text-body-sm text-neutral-600 mt-2">
              Manage Insights posts and Careers listings. Changes apply on the live site when Vercel KV
              and env credentials are configured.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => signOut({ callbackUrl: '/members/login' })}
          >
            Sign out
          </Button>
        </div>

        <div className="flex gap-2 border-b border-neutral-200 mb-8">
          {(['insights', 'careers'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t
                  ? 'border-accent-500 text-accent-700'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {t === 'insights' ? 'Insights' : 'Careers'}
            </button>
          ))}
        </div>

        {message && (
          <p className="mb-4 text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            {message}
          </p>
        )}
        {error && (
          <p className="mb-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        {tab === 'insights' && (
          <div className="space-y-10">
            {!insightsKv && (
              <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                KV_REST_API_URL and KV_REST_API_TOKEN are not set in this environment. Publishing
                changes from this dashboard requires Vercel KV (or compatible) configuration.
              </p>
            )}

            <section>
              <h2 className="text-lg font-medium text-neutral-900 mb-4">Current posts</h2>
              <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
                {posts.map((p) => (
                  <li
                    key={p.slug}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-4"
                  >
                    <div>
                      <p className="font-medium text-neutral-900">{p.title}</p>
                      <p className="text-xs text-neutral-500 mt-1">
                        /insights/{p.slug}
                        {p.featured ? ' · featured' : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void deletePost(p.slug)}
                      className="text-sm text-red-700 hover:text-red-900 shrink-0"
                    >
                      Remove from site
                    </button>
                  </li>
                ))}
                {posts.length === 0 && (
                  <li className="px-4 py-8 text-center text-neutral-500 text-sm">No posts loaded.</li>
                )}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium text-neutral-900 mb-4">Add or replace a post</h2>
              <form
                onSubmit={(e) => void submitInsight(e)}
                className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-6"
              >
                <p className="text-sm text-neutral-600">
                  Slug must be lowercase with hyphens only (e.g. <code className="text-xs">my-new-post</code>
                  ). Use a new slug to add; an existing slug updates that article.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="text-sm">
                    <span className="text-neutral-600 block mb-1">Slug</span>
                    <input
                      required
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                      value={insightForm.slug}
                      onChange={(e) => setInsightForm((f) => ({ ...f, slug: e.target.value }))}
                    />
                  </label>
                  <label className="text-sm">
                    <span className="text-neutral-600 block mb-1">Title</span>
                    <input
                      required
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                      value={insightForm.title}
                      onChange={(e) => setInsightForm((f) => ({ ...f, title: e.target.value }))}
                    />
                  </label>
                </div>
                <label className="text-sm">
                  <span className="text-neutral-600 block mb-1">Excerpt</span>
                  <input
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                    value={insightForm.excerpt}
                    onChange={(e) => setInsightForm((f) => ({ ...f, excerpt: e.target.value }))}
                  />
                </label>
                <label className="text-sm">
                  <span className="text-neutral-600 block mb-1">Body (paragraphs separated by blank lines; ## headings; - bullets)</span>
                  <textarea
                    required
                    rows={8}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm font-mono"
                    value={insightForm.content}
                    onChange={(e) => setInsightForm((f) => ({ ...f, content: e.target.value }))}
                  />
                </label>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="text-sm">
                    <span className="text-neutral-600 block mb-1">Category</span>
                    <input
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                      value={insightForm.category}
                      onChange={(e) => setInsightForm((f) => ({ ...f, category: e.target.value }))}
                    />
                  </label>
                  <label className="text-sm">
                    <span className="text-neutral-600 block mb-1">Tags (comma-separated)</span>
                    <input
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                      value={insightForm.tags}
                      onChange={(e) => setInsightForm((f) => ({ ...f, tags: e.target.value }))}
                    />
                  </label>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <label className="text-sm">
                    <span className="text-neutral-600 block mb-1">Author</span>
                    <input
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                      value={insightForm.author}
                      onChange={(e) => setInsightForm((f) => ({ ...f, author: e.target.value }))}
                    />
                  </label>
                  <label className="text-sm">
                    <span className="text-neutral-600 block mb-1">Published date</span>
                    <input
                      type="date"
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                      value={insightForm.publishedDate}
                      onChange={(e) => setInsightForm((f) => ({ ...f, publishedDate: e.target.value }))}
                    />
                  </label>
                  <label className="text-sm">
                    <span className="text-neutral-600 block mb-1">Read time</span>
                    <input
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                      value={insightForm.readTime}
                      onChange={(e) => setInsightForm((f) => ({ ...f, readTime: e.target.value }))}
                    />
                  </label>
                </div>
                <label className="text-sm">
                  <span className="text-neutral-600 block mb-1">Image URL (optional)</span>
                  <input
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                    value={insightForm.imageUrl}
                    onChange={(e) => setInsightForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  />
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={insightForm.featured}
                    onChange={(e) => setInsightForm((f) => ({ ...f, featured: e.target.checked }))}
                  />
                  Featured on home (when marked featured in merged feed)
                </label>
                <Button type="submit" variant="primary" disabled={!insightsKv}>
                  Publish post
                </Button>
              </form>
            </section>
          </div>
        )}

        {tab === 'careers' && careers && (
          <div className="space-y-10">
            {!careers.kvConfigured && (
              <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                KV is not configured. Career changes cannot be saved until KV_REST_API_URL and
                KV_REST_API_TOKEN are set.
              </p>
            )}

            <section>
              <h2 className="text-lg font-medium text-neutral-900 mb-4">
                Add role from Hirebound career page link
              </h2>
              <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
                <p className="text-sm text-neutral-600">
                  Paste a URL like{' '}
                  <code className="text-xs bg-neutral-100 px-1.5 py-0.5 rounded break-all">
                    https://careerpage.hirebound.io/org/ficuslogic/position/&lt;id&gt;/
                  </code>
                  . We match the role from your Hirebound feed (or API if configured), list it under{' '}
                  <strong className="text-neutral-800">Ficus Logic</strong> on the careers page, and send
                  applicants to your branded Hirebound page to apply.
                </p>
                <label className="block text-sm">
                  <span className="text-neutral-600 block mb-1">Career page URL</span>
                  <input
                    type="url"
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="https://careerpage.hirebound.io/org/.../position/.../"
                    value={careerPageUrl}
                    onChange={(e) => setCareerPageUrl(e.target.value)}
                  />
                </label>
                <Button
                  type="button"
                  variant="primary"
                  disabled={!careers.kvConfigured || careerImportBusy}
                  onClick={() => void importFromCareerPageLink()}
                >
                  {careerImportBusy ? 'Importing…' : 'Import role'}
                </Button>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-medium text-neutral-900 mb-4">Roles from Hirebound (live)</h2>
              <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
                {visibleFromFeed.map((o) => (
                  <li
                    key={o.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-4"
                  >
                    <div>
                      <p className="font-medium text-neutral-900">{o.title}</p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {o.department} · {o.location} · id: {o.id}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void hideCareer(o.id)}
                      disabled={!careers.kvConfigured}
                      className="text-sm text-neutral-700 hover:text-neutral-900 disabled:opacity-40 shrink-0"
                    >
                      Hide from site
                    </button>
                  </li>
                ))}
                {visibleFromFeed.length === 0 && (
                  <li className="px-4 py-8 text-center text-neutral-500 text-sm">
                    No visible feed roles, or Hirebound is not configured.
                  </li>
                )}
              </ul>
            </section>

            {hiddenFromFeed.length > 0 && (
              <section>
                <h2 className="text-lg font-medium text-neutral-900 mb-4">Hidden from site</h2>
                <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
                  {hiddenFromFeed.map((o) => (
                    <li
                      key={o.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-4"
                    >
                      <div>
                        <p className="font-medium text-neutral-900">{o.title}</p>
                        <p className="text-xs text-neutral-500 mt-1">id: {o.id}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void unhideCareer(o.id)}
                        disabled={!careers.kvConfigured}
                        className="text-sm text-accent-700 hover:text-accent-900 disabled:opacity-40 shrink-0"
                      >
                        Show again
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h2 className="text-lg font-medium text-neutral-900 mb-4">Manual roles (custom listings)</h2>
              <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white mb-6">
                {careers.delta.manualRoles.map((o) => (
                  <li
                    key={o.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-4"
                  >
                    <div>
                      <p className="font-medium text-neutral-900">{o.title}</p>
                      <p className="text-xs text-neutral-500 mt-1">{o.id}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void removeManual(o.id)}
                      disabled={!careers.kvConfigured}
                      className="text-sm text-red-700 hover:text-red-900 disabled:opacity-40 shrink-0"
                    >
                      Remove
                    </button>
                  </li>
                ))}
                {careers.delta.manualRoles.length === 0 && (
                  <li className="px-4 py-6 text-center text-neutral-500 text-sm">No manual roles yet.</li>
                )}
              </ul>

              <h3 className="text-base font-medium text-neutral-900 mb-3">Add manual role</h3>
              <form
                onSubmit={(e) => void submitRole(e)}
                className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-6"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="text-sm">
                    <span className="text-neutral-600 block mb-1">Stable id (no spaces)</span>
                    <input
                      required
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                      placeholder="custom-role-2026"
                      value={roleForm.id}
                      onChange={(e) => setRoleForm((f) => ({ ...f, id: e.target.value }))}
                    />
                  </label>
                  <label className="text-sm">
                    <span className="text-neutral-600 block mb-1">Title</span>
                    <input
                      required
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                      value={roleForm.title}
                      onChange={(e) => setRoleForm((f) => ({ ...f, title: e.target.value }))}
                    />
                  </label>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="text-sm">
                    <span className="text-neutral-600 block mb-1">Location</span>
                    <input
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                      value={roleForm.location}
                      onChange={(e) => setRoleForm((f) => ({ ...f, location: e.target.value }))}
                    />
                  </label>
                  <label className="text-sm">
                    <span className="text-neutral-600 block mb-1">Department</span>
                    <input
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                      value={roleForm.department}
                      onChange={(e) => setRoleForm((f) => ({ ...f, department: e.target.value }))}
                    />
                  </label>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="text-sm">
                    <span className="text-neutral-600 block mb-1">Employment type</span>
                    <input
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                      value={roleForm.employmentType}
                      onChange={(e) => setRoleForm((f) => ({ ...f, employmentType: e.target.value }))}
                    />
                  </label>
                  <label className="text-sm">
                    <span className="text-neutral-600 block mb-1">Posted date</span>
                    <input
                      type="date"
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                      value={roleForm.postedDate}
                      onChange={(e) => setRoleForm((f) => ({ ...f, postedDate: e.target.value }))}
                    />
                  </label>
                </div>
                <label className="text-sm">
                  <span className="text-neutral-600 block mb-1">Summary</span>
                  <textarea
                    rows={3}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                    value={roleForm.summary}
                    onChange={(e) => setRoleForm((f) => ({ ...f, summary: e.target.value }))}
                  />
                </label>
                <label className="text-sm">
                  <span className="text-neutral-600 block mb-1">Apply / external URL</span>
                  <input
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                    value={roleForm.externalUrl}
                    onChange={(e) => setRoleForm((f) => ({ ...f, externalUrl: e.target.value }))}
                  />
                </label>
                <Button type="submit" variant="primary" disabled={!careers.kvConfigured}>
                  Save manual role
                </Button>
              </form>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
