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

const emptyRoleForm = () => ({
  hireboundUrl: '',
  id: '',
  title: '',
  location: '',
  department: 'Ficus Logic',
  employmentType: 'Full-time',
  postedDate: new Date().toISOString().slice(0, 10),
  summary: '',
})

export default function MemberDashboard() {
  const [tab, setTab] = useState<Tab>('insights')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [posts, setPosts] = useState<BlogPost[]>([])
  const [insightsKv, setInsightsKv] = useState(false)
  const [insightForm, setInsightForm] = useState(emptyInsightForm)

  const [careers, setCareers] = useState<CareersPayload | null>(null)
  const [roleForm, setRoleForm] = useState(emptyRoleForm())

  const loadInsights = useCallback(async () => {
    const r = await fetch('/api/members/insights')
    if (!r.ok) { setError('Could not load insights.'); return }
    const data = (await r.json()) as { posts: BlogPost[]; kvConfigured: boolean }
    setPosts(data.posts)
    setInsightsKv(data.kvConfigured)
  }, [])

  const loadCareers = useCallback(async () => {
    const r = await fetch('/api/members/careers')
    if (!r.ok) { setError('Could not load careers.'); return }
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
    if (!r.ok) { setError(data.error ?? 'Request failed'); return false }
    setMessage('Saved. The public site will update shortly.')
    return true
  }

  async function deletePost(slug: string) {
    if (!confirm(`Remove "${slug}" from the live site?`)) return
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
      tags: insightForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
      author: insightForm.author.trim(),
      publishedDate: insightForm.publishedDate.trim(),
      readTime: insightForm.readTime.trim(),
      featured: insightForm.featured,
      imageUrl:
        insightForm.imageUrl.trim() ||
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop',
    }
    const ok = await postJson('/api/members/insights', { action: 'upsert', post })
    if (ok) { setInsightForm(emptyInsightForm); await loadInsights() }
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
    if (!confirm('Remove this role from the careers page?')) return
    const ok = await postJson('/api/members/careers', { action: 'removeManual', id })
    if (ok) await loadCareers()
  }

  function onHireboundUrlChange(url: string) {
    try {
      const u = new URL(url.trim())
      const match = u.pathname.replace(/\/+$/, '').match(/\/position\/([^/?#]+)$/i)
      if (match) {
        setRoleForm((f) => ({ ...f, hireboundUrl: url, id: match[1] }))
        return
      }
    } catch { /* ignore invalid URL while typing */ }
    setRoleForm((f) => ({ ...f, hireboundUrl: url }))
  }

  async function submitRole(e: React.FormEvent) {
    e.preventDefault()
    const url = roleForm.hireboundUrl.trim()
    const idFromUrl = (() => {
      try {
        const u = new URL(url)
        const m = u.pathname.replace(/\/+$/, '').match(/\/position\/([^/?#]+)$/i)
        return m ? m[1] : ''
      } catch { return '' }
    })()
    const role: HireboundCareerOpening = {
      id: roleForm.id.trim() || idFromUrl || `role-${Date.now()}`,
      title: roleForm.title.trim(),
      location: roleForm.location.trim() || 'India',
      department: roleForm.department.trim() || 'Ficus Logic',
      employmentType: roleForm.employmentType.trim() || 'Full-time',
      postedDate: roleForm.postedDate.trim(),
      summary: roleForm.summary.trim(),
      externalUrl: url || 'https://careerpage.hirebound.io/org/ficuslogic',
    }
    const ok = await postJson('/api/members/careers', { action: 'upsertManual', role })
    if (ok) { setRoleForm(emptyRoleForm()); await loadCareers() }
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
              Manage Insights posts and Careers listings. Changes go live instantly.
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

        {/* ── INSIGHTS TAB ───────────────────────────────────────── */}
        {tab === 'insights' && (
          <div className="space-y-10">
            {!insightsKv && (
              <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                KV_REST_API_URL and KV_REST_API_TOKEN are not set. Publishing requires Vercel KV.
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
                        /insights/{p.slug}{p.featured ? ' · featured' : ''}
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
                  Slug must be lowercase with hyphens only (e.g. <code className="text-xs">my-new-post</code>).
                  Use a new slug to add; an existing slug updates that article.
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
                  <span className="text-neutral-600 block mb-1">
                    Body (paragraphs separated by blank lines; ## headings; - bullets)
                  </span>
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
                  Featured on home page
                </label>
                <Button type="submit" variant="primary" disabled={!insightsKv}>
                  Publish post
                </Button>
              </form>
            </section>
          </div>
        )}

        {/* ── CAREERS TAB ───────────────────────────────────────── */}
        {tab === 'careers' && careers && (
          <div className="space-y-10">
            {!careers.kvConfigured && (
              <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                KV is not configured. Career changes cannot be saved until KV_REST_API_URL and
                KV_REST_API_TOKEN are set.
              </p>
            )}

            {/* Add role form */}
            <section>
              <h2 className="text-lg font-medium text-neutral-900 mb-1">Add a role to the careers page</h2>
              <p className="text-sm text-neutral-500 mb-4">
                Paste the Hirebound career page link — it becomes the &ldquo;Apply&rdquo; button. Then fill
                in the job details exactly as they appear on that page.
              </p>
              <form
                onSubmit={(e) => void submitRole(e)}
                className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-6"
              >
                {/* Hirebound URL — full width, prominent */}
                <label className="text-sm">
                  <span className="text-neutral-700 font-medium block mb-1">
                    Hirebound career page URL
                    <span className="font-normal text-neutral-500 ml-1">(the link you want applicants to visit)</span>
                  </span>
                  <input
                    type="url"
                    required
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="https://careerpage.hirebound.io/org/ficuslogic/position/…/"
                    value={roleForm.hireboundUrl}
                    onChange={(e) => onHireboundUrlChange(e.target.value)}
                  />
                  {roleForm.id && (
                    <span className="text-xs text-neutral-400 mt-1 block">
                      Position ID detected: <code>{roleForm.id}</code>
                    </span>
                  )}
                </label>

                <div className="border-t border-neutral-100 pt-4">
                  <p className="text-xs text-neutral-500 mb-3 uppercase tracking-wide font-medium">
                    Job details — enter these from the Hirebound page
                  </p>
                  <div className="grid gap-4">
                    <label className="text-sm">
                      <span className="text-neutral-600 block mb-1">Job title <span className="text-red-500">*</span></span>
                      <input
                        required
                        className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                        placeholder="e.g. Senior Executive Search Consultant"
                        value={roleForm.title}
                        onChange={(e) => setRoleForm((f) => ({ ...f, title: e.target.value }))}
                      />
                    </label>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <label className="text-sm">
                        <span className="text-neutral-600 block mb-1">Location</span>
                        <input
                          className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                          placeholder="e.g. Mumbai, India"
                          value={roleForm.location}
                          onChange={(e) => setRoleForm((f) => ({ ...f, location: e.target.value }))}
                        />
                      </label>
                      <label className="text-sm">
                        <span className="text-neutral-600 block mb-1">Department</span>
                        <input
                          className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                          placeholder="e.g. Ficus Logic"
                          value={roleForm.department}
                          onChange={(e) => setRoleForm((f) => ({ ...f, department: e.target.value }))}
                        />
                      </label>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <label className="text-sm">
                        <span className="text-neutral-600 block mb-1">Employment type</span>
                        <select
                          className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm bg-white"
                          value={roleForm.employmentType}
                          onChange={(e) => setRoleForm((f) => ({ ...f, employmentType: e.target.value }))}
                        >
                          <option>Full-time</option>
                          <option>Part-time</option>
                          <option>Contract</option>
                          <option>Internship</option>
                        </select>
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
                      <span className="text-neutral-600 block mb-1">Job summary / description</span>
                      <textarea
                        rows={4}
                        className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                        placeholder="Brief description of the role shown on the careers page…"
                        value={roleForm.summary}
                        onChange={(e) => setRoleForm((f) => ({ ...f, summary: e.target.value }))}
                      />
                    </label>
                  </div>
                </div>

                <Button type="submit" variant="primary" disabled={!careers.kvConfigured}>
                  Add to careers page
                </Button>
              </form>
            </section>

            {/* Live roles from Hirebound feed */}
            <section>
              <h2 className="text-lg font-medium text-neutral-900 mb-4">Roles from Hirebound feed</h2>
              <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
                {visibleFromFeed.map((o) => (
                  <li
                    key={o.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-4"
                  >
                    <div>
                      <p className="font-medium text-neutral-900">{o.title}</p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {o.department} · {o.location}
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
                    No Hirebound feed roles (HIREBOUND_BEARER_TOKEN not configured).
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
                        <p className="text-xs text-neutral-500 mt-1">{o.location}</p>
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

            {/* Listed roles */}
            <section>
              <h2 className="text-lg font-medium text-neutral-900 mb-4">
                Roles currently listed on site
              </h2>
              <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
                {careers.delta.manualRoles.map((o) => (
                  <li
                    key={o.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-4"
                  >
                    <div>
                      <p className="font-medium text-neutral-900">{o.title}</p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {o.department} · {o.location} · {o.employmentType}
                      </p>
                      {o.externalUrl && (
                        <a
                          href={o.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-accent-600 hover:underline mt-0.5 block truncate max-w-xs"
                        >
                          {o.externalUrl}
                        </a>
                      )}
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
                  <li className="px-4 py-6 text-center text-neutral-500 text-sm">
                    No roles added yet. Use the form above to add one.
                  </li>
                )}
              </ul>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
