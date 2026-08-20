"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/icon"
import {
  ArrowUp,
  Plus,
  X,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Wrench,
  MessageSquare,
  BarChart3,
} from "lucide-react"

type ParticipationTab = "polls" | "proposals"

type Poll = {
  id: string
  title: string
  description: string | null
  status: "open" | "closed" | "results"
  closes_at: string | null
  show_results_early: boolean
  created_at: string
  options: { id: string; label: string; sort_order: number; vote_count: number }[]
  total_votes: number
  user_voted: boolean
  user_vote_option_id: string | null
}

type PollFilter = "open" | "closed"

type Proposal = {
  id: string
  title: string
  description: string
  status: "pending" | "under_review" | "accepted" | "rejected" | "implemented"
  upvotes: number
  user_voted: boolean
  created_at: string
  author: { first_name: string; last_name: string } | null
}

type ProposalFilter = "all" | "pending" | "under_review" | "accepted" | "rejected" | "implemented"

const PROPOSAL_STATUS: Record<string, { label: string; icon: typeof Clock; className: string }> = {
  pending:      { label: "Pending",      icon: Clock,        className: "text-muted-foreground" },
  under_review: { label: "Under review", icon: Eye,          className: "text-brand" },
  accepted:     { label: "Accepted",     icon: CheckCircle2, className: "text-success" },
  rejected:     { label: "Rejected",     icon: XCircle,      className: "text-destructive" },
  implemented:  { label: "Implemented",  icon: Wrench,       className: "text-success" },
}

function timeAgo(dateStr: string): string {
  const s = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (s < 60) return "just now"
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
}

function timeRemaining(closesAt: string): string {
  const diff = new Date(closesAt).getTime() - Date.now()
  if (diff <= 0) return "Closed"
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  if (days > 0) return `${days}d ${hours}h left`
  const minutes = Math.floor((diff % 3600000) / 60000)
  return `${hours}h ${minutes}m left`
}

export default function ParticipationPage() {
  const [tab, setTab] = useState<ParticipationTab>("polls")

  return (
    <div className="mx-auto max-w-2xl animate-rise">
      <div className="mb-8">
        <h1 className="font-serif text-2xl tracking-tight">Participation</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vote on polls. Submit proposals. Shape school life.
        </p>
      </div>

      <div className="mb-6 flex gap-1 rounded-lg border border-border bg-surface p-1">
        {(["polls", "proposals"] as ParticipationTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              tab === t
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t === "polls" ? "Polls" : "Proposals"}
          </button>
        ))}
      </div>

      {tab === "polls" ? <PollsSection /> : <ProposalsSection />}
    </div>
  )
}

function PollsSection() {
  const { user } = useAuth()
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<PollFilter>("open")
  const [votingId, setVotingId] = useState<string | null>(null)

  const fetchPolls = useCallback(async () => {
    setLoading(true)
    const { data: userData } = await supabase.auth.getUser()
    const uid = userData.user?.id

    const { data, error } = await supabase
      .from("polls")
      .select(
        `id, title, description, status, closes_at, show_results_early, created_at,
         poll_options (id, label, sort_order),
         votes (option_id, user_id)`,
      )
      .eq("status", filter)
      .order("created_at", { ascending: false })

    if (!error && data) {
      const enriched: Poll[] = (data as any[]).map((p) => {
        const totalVotes = p.votes?.length ?? 0
        const userVote = p.votes?.find((v: any) => v.user_id === uid)
        return {
          id: p.id,
          title: p.title,
          description: p.description,
          status: p.status,
          closes_at: p.closes_at,
          show_results_early: p.show_results_early,
          created_at: p.created_at,
          options: (p.poll_options ?? [])
            .sort((a: any, b: any) => a.sort_order - b.sort_order)
            .map((o: any) => ({
              id: o.id,
              label: o.label,
              sort_order: o.sort_order,
              vote_count: p.votes?.filter((v: any) => v.option_id === o.id).length ?? 0,
            })),
          total_votes: totalVotes,
          user_voted: !!userVote,
          user_vote_option_id: userVote?.option_id ?? null,
        }
      })
      setPolls(enriched)
    }
    setLoading(false)
  }, [filter])

  useEffect(() => { fetchPolls() }, [fetchPolls])

  const handleVote = async (pollId: string, optionId: string) => {
    setVotingId(pollId)
    const { data: userData } = await supabase.auth.getUser()
    const { error } = await supabase.from("votes").insert({
      poll_id: pollId,
      option_id: optionId,
      user_id: userData.user?.id,
    })
    if (!error) fetchPolls()
    setVotingId(null)
  }

  return (
    <>
      <div className="mb-4 flex gap-1 rounded-lg border border-border bg-surface p-1">
        {(["open", "closed"] as PollFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors",
              filter === f
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {f === "open" ? "Open" : "Closed"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-lg border border-border bg-surface p-5">
              <div className="mb-3 h-5 w-3/4 rounded bg-muted" />
              <div className="space-y-2">
                <div className="h-9 rounded-md bg-muted" />
                <div className="h-9 rounded-md bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : polls.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface py-16 text-center">
          <BarChart3 width={32} height={32} className="mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No {filter} polls right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {polls.map((poll, i) => {
            const showResults = poll.user_voted || poll.status === "results" || poll.show_results_early
            return (
              <div
                key={poll.id}
                className="animate-rise rounded-lg border border-border bg-surface p-5"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  {poll.status === "open" ? (
                    <><Clock width={13} height={13} />{poll.closes_at ? timeRemaining(poll.closes_at) : "Open"}</>
                  ) : (
                    <><BarChart3 width={13} height={13} />Results</>
                  )}
                  <span className="text-muted-foreground/50">·</span>
                  <span className="tabular">{poll.total_votes} vote{poll.total_votes !== 1 ? "s" : ""}</span>
                </div>

                <h2 className="mb-1 text-base font-medium leading-snug">{poll.title}</h2>
                {poll.description && (
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{poll.description}</p>
                )}

                <div className="space-y-2">
                  {poll.options.map((option) => {
                    const pct = showResults ? Math.round((option.vote_count / Math.max(poll.total_votes, 1)) * 100) : 0
                    const isUserChoice = option.id === poll.user_vote_option_id
                    return (
                      <button
                        key={option.id}
                        disabled={votingId === poll.id || poll.user_voted}
                        onClick={() => handleVote(poll.id, option.id)}
                        className={cn(
                          "relative w-full overflow-hidden rounded-md border text-left text-sm transition-all",
                          showResults
                            ? isUserChoice ? "border-house/40 bg-house/8" : "border-border bg-background"
                            : "border-border bg-background hover:border-border-strong hover:bg-accent",
                          (votingId === poll.id || poll.user_voted) && "cursor-default",
                        )}
                      >
                        {showResults && (
                          <div
                            className="absolute inset-y-0 left-0 transition-all duration-700"
                            style={{
                              width: `${pct}%`,
                              background: isUserChoice ? "var(--house-soft)" : "var(--muted)",
                              opacity: isUserChoice ? 0.7 : 0.4,
                            }}
                          />
                        )}
                        <div className="relative flex items-center justify-between px-3 py-2.5">
                          <span className="flex items-center gap-2">
                            {showResults && isUserChoice && (
                              <CheckCircle2 width={15} height={15} className="shrink-0 text-house" />
                            )}
                            {option.label}
                          </span>
                          {showResults && (
                            <span className="tabular text-xs font-medium text-muted-foreground">{pct}%</span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>

                <p className="mt-3 text-[11px] text-muted-foreground/60">
                  {new Date(poll.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

function ProposalsSection() {
  const { user } = useAuth()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ProposalFilter>("all")
  const [showForm, setShowForm] = useState(false)
  const [formTitle, setFormTitle] = useState("")
  const [formDesc, setFormDesc] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const fetchProposals = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("proposals")
      .select(
        `id, title, description, status, upvotes, created_at, created_by,
         profiles!proposals_created_by_fkey (first_name, last_name),
         proposal_votes (user_id)`,
      )
      .order("upvotes", { ascending: false })

    if (!error && data) {
      const mapped: Proposal[] = (data as any[]).map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        status: p.status,
        upvotes: p.upvotes,
        user_voted: p.proposal_votes?.some((v: any) => v.user_id === user?.id) ?? false,
        created_at: p.created_at,
        author: p.profiles ? { first_name: p.profiles.first_name, last_name: p.profiles.last_name } : null,
      }))
      setProposals(mapped)
    }
    setLoading(false)
  }, [user])

  useEffect(() => { fetchProposals() }, [fetchProposals])

  const handleUpvote = async (proposalId: string, currentVoted: boolean) => {
    if (!user) return
    if (currentVoted) {
      await supabase.from("proposal_votes").delete().eq("proposal_id", proposalId).eq("user_id", user.id)
      const p = proposals.find((x) => x.id === proposalId)
      if (p) await supabase.from("proposals").update({ upvotes: Math.max(0, p.upvotes - 1) }).eq("id", proposalId)
    } else {
      await supabase.from("proposal_votes").insert({ proposal_id: proposalId, user_id: user.id })
      const p = proposals.find((x) => x.id === proposalId)
      if (p) await supabase.from("proposals").update({ upvotes: p.upvotes + 1 }).eq("id", proposalId)
    }
    fetchProposals()
  }

  const handleSubmit = async () => {
    if (!user || !formTitle.trim() || !formDesc.trim()) return
    setSubmitting(true)
    await supabase.from("proposals").insert({
      title: formTitle.trim(),
      description: formDesc.trim(),
      created_by: user.id,
    })
    setFormTitle("")
    setFormDesc("")
    setShowForm(false)
    setSubmitting(false)
    fetchProposals()
  }

  const filtered = filter === "all" ? proposals : proposals.filter((p) => p.status === filter)

  return (
    <>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div />
        <button
          onClick={() => setShowForm(!showForm)}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors",
            showForm
              ? "border-border-strong bg-surface text-foreground"
              : "border-border bg-background text-foreground hover:border-border-strong hover:bg-surface",
          )}
        >
          {showForm ? <X width={15} height={15} /> : <Plus width={15} height={15} />}
          {showForm ? "Cancel" : "New proposal"}
        </button>
      </div>

      {showForm && (
        <div className="animate-scale-in mb-6 rounded-lg border border-border bg-surface p-5">
          <h2 className="mb-4 text-sm font-medium">Submit a proposal</h2>
          <input
            type="text"
            placeholder="What should change?"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="mb-3 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:border-ring focus:outline-none"
            maxLength={120}
          />
          <textarea
            placeholder="Explain your idea — why it matters, how it could work…"
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
            rows={4}
            className="mb-4 w-full resize-none rounded-md border border-border bg-background px-3 py-2.5 text-sm leading-relaxed placeholder:text-muted-foreground/60 focus:border-ring focus:outline-none"
            maxLength={1000}
          />
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground/60">{formDesc.length}/1000</p>
            <button
              onClick={handleSubmit}
              disabled={submitting || !formTitle.trim() || !formDesc.trim()}
              className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <Send width={14} height={14} />
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </div>
      )}

      <div className="mb-5 flex gap-1.5 overflow-x-auto pb-1">
        {(["all", "pending", "under_review", "accepted", "rejected", "implemented"] as ProposalFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              filter === s
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-surface text-muted-foreground hover:text-foreground",
            )}
          >
            {s === "all" ? "All" : PROPOSAL_STATUS[s]?.label ?? s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse rounded-lg border border-border bg-surface p-4">
              <div className="mb-2 h-4 w-2/3 rounded bg-muted" />
              <div className="mb-3 h-3 w-full rounded bg-muted" />
              <div className="h-3 w-24 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface py-16 text-center">
          <MessageSquare width={32} height={32} className="mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            {filter === "all" ? "No proposals yet. Be the first." : `No ${PROPOSAL_STATUS[filter]?.label.toLowerCase()} proposals.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((proposal, i) => {
            const statusCfg = PROPOSAL_STATUS[proposal.status]
            const StatusIcon = statusCfg?.icon ?? Clock
            return (
              <div
                key={proposal.id}
                className="animate-rise rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-strong"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex gap-4">
                  <button
                    onClick={() => handleUpvote(proposal.id, proposal.user_voted)}
                    className={cn(
                      "flex shrink-0 flex-col items-center gap-0.5 rounded-md border px-2.5 py-2 transition-colors",
                      proposal.user_voted
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-muted-foreground hover:border-border-strong hover:text-foreground",
                    )}
                  >
                    <ArrowUp width={16} height={16} />
                    <span className="tabular text-xs font-semibold">{proposal.upvotes}</span>
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-medium leading-snug">{proposal.title}</h3>
                      <span className={cn("flex shrink-0 items-center gap-1 text-[11px] font-medium", statusCfg?.className)}>
                        <StatusIcon width={12} height={12} />
                        {statusCfg?.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">{proposal.description}</p>
                    <p className="mt-2 text-[11px] text-muted-foreground/60">
                      {proposal.author ? `${proposal.author.first_name} ${proposal.author.last_name} · ` : ""}
                      {timeAgo(proposal.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}