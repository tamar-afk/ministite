import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion'
import {
  Award,
  CheckCircle,
  ChevronRight, Play, FileImage, Users, LayoutGrid,
  MessageSquare, Database, Calendar, FolderArchive,
  LayoutDashboard, AlertTriangle, TrendingUp,
  Bot, User, Star, Clock, Zap, FileText, HelpCircle, Sparkles,
  Plus,
  X,
} from 'lucide-react'

// Sleek section transitions: shared ease + duration
const SECTION_EASE = [0.22, 1, 0.36, 1]
const SECTION_TRANSITION = { duration: 0.55, ease: SECTION_EASE }
const SECTION_INITIAL_Y = 14

// ----- Hooks -----
function useCountUp(target, duration = 1500, inView) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, duration])
  return count
}

// ----- Navbar -----
function Navbar({ scrolled }) {
  const links = ['Product', 'Solutions', 'Pricing', 'Enterprise']
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-[12px] border-b border-[var(--border-light)]' : 'bg-white'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[var(--primary)]" />
          <span className="font-normal text-lg text-[var(--text-primary)]">monday</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map((link, i) => (
            <motion.a
              key={link}
              href="#"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              {link}
            </motion.a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <motion.a
            href="#"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] px-3 py-2"
          >
            Log in
          </motion.a>
          <motion.a
            href="#"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm font-normal text-white bg-[var(--text-primary)] hover:bg-[var(--dark)] px-4 py-2 rounded-lg inline-flex items-center gap-1.5"
          >
            Get started <ChevronRight className="w-4 h-4" />
          </motion.a>
        </div>
      </div>
    </motion.nav>
  )
}

// ----- Hero Demo Sequence -----
const DEMO_FRAMES = {
  IDLE: 'idle',
  TYPING: 'typing',
  SUBMITTED: 'submitted',
  BOARD: 'board',
  AGENTS: 'agents',
  DONE: 'done',
  RESET: 'reset',
}

const DEMO_EXAMPLES = [
  {
    prompt: 'Create Q3 product launch campaign',
    boardTitle: 'Project planning',
    tasks: [
      { name: 'Finalize kickoff materials', owner: 1, timeline: 80 },
      { name: 'Identify key resources', owner: 2, timeline: 60 },
      { name: 'Lead generation presentation', owner: 1, timeline: 40 },
      { name: 'Conduct a risk assessment', owner: 2, timeline: 100 },
      { name: 'Meeting with publishers', owner: 1, timeline: 20 },
    ],
    agents: [
      { name: 'Assets Generator', desc: 'Create new ad creatives for Q1 campaign', right: 12, top: 8, gradient: 'linear-gradient(135deg, #4F7CFF 0%, #6C47FF 50%, #e879f9 100%)', delay: 0 },
      { name: 'Creative Manager', desc: 'Review and approve campaign assets', right: 12, top: 42, gradient: 'linear-gradient(135deg, #F5A623 0%, #e879f9 100%)', delay: 0.15 },
      { name: 'Campaign Team', desc: 'Publish approved creatives to channels', right: 12, top: 76, gradient: 'linear-gradient(135deg, #00CA72 0%, #4F7CFF 100%)', delay: 0.3 },
    ],
    handoffs: [
      { label: 'Send for approval', top: '28%' },
      { label: 'Approved by creative manager', top: '48%' },
      { label: 'Sent to campaign team', top: '68%' },
    ],
  },
  {
    prompt: 'Plan team offsite and assign tasks',
    boardTitle: 'Offsite planning',
    tasks: [
      { name: 'Book venue and catering', owner: 1, timeline: 100 },
      { name: 'Send calendar invites', owner: 2, timeline: 70 },
      { name: 'Prepare breakout sessions', owner: 1, timeline: 50 },
      { name: 'Organize team activities', owner: 2, timeline: 30 },
      { name: 'Follow-up survey', owner: 1, timeline: 10 },
    ],
    agents: [
      { name: 'Event Coordinator', desc: 'Reserve venue and manage logistics', right: 12, top: 8, gradient: 'linear-gradient(135deg, #00CA72 0%, #4F7CFF 100%)', delay: 0 },
      { name: 'People Ops', desc: 'Send invites and track RSVPs', right: 12, top: 42, gradient: 'linear-gradient(135deg, #6C47FF 0%, #e879f9 100%)', delay: 0.15 },
      { name: 'Facilitator', desc: 'Build agenda and run sessions', right: 12, top: 76, gradient: 'linear-gradient(135deg, #F5A623 0%, #00CA72 100%)', delay: 0.3 },
    ],
    handoffs: [
      { label: 'Venue confirmed', top: '28%' },
      { label: 'Invites sent', top: '48%' },
      { label: 'Agenda locked', top: '68%' },
    ],
  },
  {
    prompt: 'Build sprint backlog from roadmap',
    boardTitle: 'Sprint backlog',
    tasks: [
      { name: 'API auth refactor', owner: 1, timeline: 90 },
      { name: 'Dashboard redesign', owner: 2, timeline: 45 },
      { name: 'Write E2E tests', owner: 1, timeline: 60 },
      { name: 'Deploy staging', owner: 2, timeline: 100 },
      { name: 'Document API', owner: 1, timeline: 25 },
    ],
    agents: [
      { name: 'Backlog Agent', desc: 'Break down roadmap into sprint items', right: 12, top: 8, gradient: 'linear-gradient(135deg, #4F7CFF 0%, #6C47FF 100%)', delay: 0 },
      { name: 'Dev Lead', desc: 'Estimate and assign to team', right: 12, top: 42, gradient: 'linear-gradient(135deg, #e879f9 0%, #F5A623 100%)', delay: 0.15 },
      { name: 'QA Agent', desc: 'Add test cases and acceptance criteria', right: 12, top: 76, gradient: 'linear-gradient(135deg, #00CA72 0%, #4F7CFF 100%)', delay: 0.3 },
    ],
    handoffs: [
      { label: 'Stories created', top: '28%' },
      { label: 'Assigned to sprint', top: '48%' },
      { label: 'Ready for dev', top: '68%' },
    ],
  },
]

function HeroDemo() {
  const [frame, setFrame] = useState(DEMO_FRAMES.IDLE)
  const [typedText, setTypedText] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [exampleIndex, setExampleIndex] = useState(0)
  const nextExampleRef = useRef(0)
  const example = DEMO_EXAMPLES[exampleIndex]

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      const idx = nextExampleRef.current
      nextExampleRef.current = (nextExampleRef.current + 1) % DEMO_EXAMPLES.length
      setExampleIndex(idx)
      const current = DEMO_EXAMPLES[idx]
      const fullPrompt = current.prompt
      await delay(500)
      if (cancelled) return
      setFrame(DEMO_FRAMES.TYPING)
      for (let i = 0; i <= fullPrompt.length; i++) {
        await delay(45)
        if (cancelled) return
        setTypedText(fullPrompt.slice(0, i))
      }
      await delay(350)
      if (cancelled) return
      setFrame(DEMO_FRAMES.SUBMITTED)
      await delay(500)
      if (cancelled) return
      setFrame(DEMO_FRAMES.BOARD)
      await delay(1100)
      if (cancelled) return
      setFrame(DEMO_FRAMES.AGENTS)
      await delay(1100)
      if (cancelled) return
      setFrame(DEMO_FRAMES.DONE)
      setShowConfetti(true)
      await delay(400)
      if (cancelled) return
      setShowConfetti(false)
      await delay(200)
      if (cancelled) return
      setFrame(DEMO_FRAMES.RESET)
      await delay(300)
      if (cancelled) return
      setTypedText('')
      setFrame(DEMO_FRAMES.IDLE)
      await delay(400)
      if (cancelled) return
      run()
    }
    run()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="rounded-xl border border-[var(--border-light)] bg-white shadow-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--light-bg)] border-b border-[var(--border-light)]">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex-1 flex justify-center">
          <span className="text-xs text-[var(--text-muted)]">app.monday.com</span>
        </div>
        <div className="w-12" />
      </div>
      <div className="min-h-[320px] md:min-h-[400px] relative bg-white">
        <AnimatePresence mode="wait">
          {(frame === DEMO_FRAMES.IDLE || frame === DEMO_FRAMES.TYPING || frame === DEMO_FRAMES.SUBMITTED) && (
            <motion.div
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center p-8"
            >
              <div className="w-full max-w-xl">
                <div className={`rounded-lg border-2 px-4 py-3 ${frame === DEMO_FRAMES.IDLE ? 'border-[var(--primary)] animate-pulse' : 'border-[var(--border-light)]'}`}>
                  <span className="text-[var(--text-primary)]">{typedText}</span>
                  {(frame === DEMO_FRAMES.IDLE || frame === DEMO_FRAMES.TYPING) && (
                    <span className="inline-block w-2 h-4 ml-0.5 bg-[var(--primary)] animate-pulse align-middle" />
                  )}
                </div>
                {frame === DEMO_FRAMES.SUBMITTED && (
                  <motion.div
                    initial={{ opacity: 0, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, filter: 'blur(0)' }}
                    className="mt-4 text-sm text-[var(--text-muted)]"
                  >
                    Creating your project...
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
          {(frame === DEMO_FRAMES.BOARD || frame === DEMO_FRAMES.AGENTS || frame === DEMO_FRAMES.DONE) && (
            <motion.div
              key="board"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 overflow-hidden bg-[#f5f5f7]"
            >
              {/* Project board — light theme */}
              <div className="h-full flex flex-col p-3 md:p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-normal text-[var(--text-primary)]">{example.boardTitle}</h3>
                  <div className="flex gap-1 text-xs text-[var(--text-muted)]">
                    <span className="px-2 py-1 rounded bg-white border border-[var(--border-light)] font-normal text-[var(--text-primary)]">Main table</span>
                    <span className="px-2 py-1 rounded">Gantt</span>
                    <span className="px-2 py-1 rounded">Kanban</span>
                  </div>
                </div>
                <div className="flex-1 min-h-0 rounded-lg bg-white border border-[var(--border-light)] shadow-sm overflow-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border-light)] bg-[#fafafa]">
                        <th className="w-8 py-2 pl-2 font-normal text-[var(--text-muted)]"><Star className="w-3.5 h-3.5 inline" /></th>
                        <th className="py-2 pl-2 font-normal text-[var(--text-muted)]">Task name</th>
                        <th className="w-24 py-2 pl-2 font-normal text-[var(--text-muted)]">Status</th>
                        <th className="w-20 py-2 pl-2 font-normal text-[var(--text-muted)]">Owner</th>
                        <th className="w-24 py-2 pl-2 font-normal text-[var(--text-muted)]">Timeline</th>
                        <th className="w-20 py-2 pl-2 font-normal text-[var(--text-muted)]">Due date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td colSpan={6} className="py-1.5 pl-2 text-xs font-normal text-[var(--text-muted)] bg-[#f5f5f5]">This month</td></tr>
                      {example.tasks.map((row, i) => {
                        const showDone = frame === DEMO_FRAMES.DONE
                        const showWorking = frame === DEMO_FRAMES.AGENTS
                        const showEmpty = frame === DEMO_FRAMES.BOARD
                        return (
                        <tr key={i} className="border-b border-[var(--border-light)] hover:bg-[#fafafa]">
                          <td className="py-2 pl-2"><Star className="w-3.5 h-3.5 text-[var(--text-muted)]/60" /></td>
                          <td className="py-2 pl-2 font-normal text-[var(--text-primary)]">{row.name}</td>
                          <td className="py-2 pl-2 align-middle">
                            <div className="relative inline-block">
                              {showDone && (
                                <>
                                  {[
                                    { x: -14, y: -10 },
                                    { x: 12, y: -8 },
                                    { x: -10, y: 8 },
                                    { x: 16, y: 6 },
                                  ].map((pos, k) => (
                                    <motion.span
                                      key={k}
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 0.9 }}
                                      transition={{ delay: 0.06 * i + 0.03 * k, type: 'spring', stiffness: 400, damping: 20 }}
                                      className="absolute pointer-events-none text-[var(--accent-green)]"
                                      style={{ left: '50%', top: '50%', transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))` }}
                                    >
                                      <Sparkles className="w-3.5 h-3.5" />
                                    </motion.span>
                                  ))}
                                </>
                              )}
                              {showDone ? (
                                <motion.span
                                  initial={{ scale: 0.6, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: 0.06 * i, type: 'spring', stiffness: 380, damping: 22 }}
                                  className="hero-done-pill relative z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-semibold text-white bg-[#00CA72] shadow-[0_0_0_2px_rgba(0,202,114,0.3),0_2px_8px_rgba(0,202,114,0.35)]"
                                >
                                  Done ✓
                                </motion.span>
                              ) : showWorking ? (
                                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-normal text-white bg-[#F5A623]">
                                  Working on it
                                </span>
                              ) : (
                                <span className="text-[var(--text-muted)]">—</span>
                              )}
                            </div>
                          </td>
                          <td className="py-2 pl-2">
                            <div className="flex -space-x-1">
                              {[...Array(row.owner)].map((_, j) => (
                                <div key={j} className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6C47FF] to-[#4F7CFF] border-2 border-white flex items-center justify-center text-white" style={{ zIndex: 2 - j }}>
                                  <User className="w-3 h-3" />
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-2 pl-2">
                            <div className="h-1.5 w-16 rounded-full bg-[#e5e7eb] overflow-hidden">
                              <div className="h-full rounded-full bg-[#4F7CFF]" style={{ width: `${row.timeline}%` }} />
                            </div>
                          </td>
                          <td className="py-2 pl-2 text-[var(--text-muted)]">Sep 0{i + 3}</td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Floating agent cards — multiple agents at work */}
              {(frame === DEMO_FRAMES.AGENTS || frame === DEMO_FRAMES.DONE) && (
                <>
                  {/* Agent cards — different roles */}
                  {example.agents.map((agent, i) => (
                    <motion.div
                      key={agent.name}
                      initial={{ opacity: 0, scale: 0.95, x: 8 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: agent.delay }}
                      className="absolute w-[180px] md:w-[200px] rounded-2xl p-[2px] shadow-lg"
                      style={{ right: agent.right, top: `${agent.top}%`, background: agent.gradient }}
                    >
                      <div className="rounded-2xl bg-white p-2.5 flex gap-2.5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: agent.gradient }}>
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-normal text-[var(--text-primary)] text-xs leading-tight">{agent.name}</div>
                          <div className="text-[10px] text-[var(--text-muted)] mt-0.5 line-clamp-2">{agent.desc}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Completed cards — green border (handoffs between agents) */}
                  {example.handoffs.map((card, i) => (
                    <motion.div
                      key={card.label}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + 0.08 * i, duration: 0.25 }}
                      className="absolute left-3 right-[140px] md:right-[220px] rounded-xl border-2 border-[#00CA72] bg-white shadow-md flex items-center gap-2 py-2 pl-2 pr-2"
                      style={{ top: card.top, maxWidth: 200 }}
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F5A623] to-[#e879f9] flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-xs font-normal text-[var(--text-primary)] truncate flex-1">{card.label}</span>
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-normal text-white bg-[#00CA72]">Completed</span>
                    </motion.div>
                  ))}
                </>
              )}

              {showConfetti && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 1, scale: 0 }}
                      animate={{ opacity: 0, scale: 1.5 }}
                      transition={{ duration: 0.5 }}
                      className="absolute w-2 h-2 rounded-full bg-[var(--accent-green)]"
                      style={{
                        left: `${30 + Math.random() * 40}%`,
                        top: `${30 + Math.random() * 40}%`,
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
          {frame === DEMO_FRAMES.RESET && (
            <motion.div
              key="reset"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

// ----- Hero Section -----
function HeroSection() {
  return (
    <section className="pt-28 pb-16 px-6 md:px-10 md:pt-36 md:pb-24">
      <div className="max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm md:text-base text-[var(--text-muted)] mb-4"
        >
          monday work management
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-sans font-normal leading-[1.15] mb-6"
        >
          <span className="hero-headline-gradient block text-5xl md:text-6xl lg:text-7xl xl:text-8xl max-w-4xl mx-auto tracking-tight">
            Finally, your output can catch up to your ambition.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-base md:text-lg text-[var(--text-muted)] max-w-2xl mx-auto mb-8"
        >
          You set the direction and your agents execute at scale, for every team and every use case.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-[var(--text-primary)] text-white font-normal text-lg hover:bg-[var(--dark)] transition"
          >
            Get started free <ChevronRight className="w-4 h-4" />
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] font-normal"
          >
            See it in action <Play className="w-4 h-4" />
          </a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <HeroDemo />
        </motion.div>
      </div>
    </section>
  )
}

// ----- Hero logo row (trusted by) -----
const HERO_LOGOS = ['Uber', 'Netflix', 'Adobe', 'Spotify', 'Salesforce', 'Nike', 'Canva', 'Airbnb']

function HeroLogoRow() {
  return (
    <section className="py-8 md:py-10 px-6 md:px-10 border-t border-[var(--border-light)] bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 mb-4">
          {HERO_LOGOS.map((name) => (
            <span
              key={name}
              className="text-base font-normal text-[var(--text-muted)]/70 hover:text-[var(--text-primary)] transition-colors duration-200"
            >
              {name}
            </span>
          ))}
        </div>
        <p className="text-center text-[10px] md:text-xs text-[var(--text-muted)]/80 font-normal flex items-center justify-center gap-1 flex-wrap">
          <span className="inline-flex gap-0.5" aria-hidden>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-3 h-3 fill-[var(--text-muted)] text-[var(--text-muted)]" strokeWidth={1.5} />
            ))}
          </span>
          G2 Highest Adoption · Winter 2025
        </p>
      </div>
    </section>
  )
}

// ----- Solutions Tabs -----
const SOLUTIONS = [
  { id: 'pmo', name: 'PMO', title: 'PMO', boardType: 'table',
    desc: 'Align every project to strategic goals with structured plans, real-time resource tracking, and executive-ready visibility across portfolios.',
    bullets: ['Portfolio dashboards', 'Resource capacity', 'Strategic alignment'],
    columns: ['Project', 'Owner', 'Status', 'Timeline', 'Budget'],
    rows: ['Q3 Product Launch', 'Enterprise Security Rollout', 'CRM Migration Phase 2'],
  },
  { id: 'legal', name: 'Legal', title: 'Legal', boardType: 'kanban',
    desc: 'Command compliance and contracts with a gated, governed platform that executes high-stakes reviews with total precision.',
    bullets: ['Contract lifecycle', 'Compliance gates', 'Audit trails'],
    columns: ['Matter', 'Type', 'Review Stage', 'Due'],
    rows: ['NDA - Acme Corp', 'MSA Renewal - Vendor X', 'IP License Review'],
  },
  { id: 'hr', name: 'HR', title: 'HR', boardType: 'list',
    desc: 'Transform complex people processes into automated workflows that retain institutional knowledge even as your team grows.',
    bullets: ['Onboarding flows', 'Performance cycles', 'Knowledge base'],
    columns: ['Process', 'Assignee', 'Status', 'Due'],
    rows: ['Q2 Onboarding - 12 hires', 'Review cycle 2025', 'Policy update rollout'],
  },
  { id: 'product', name: 'Product', title: 'Product', boardType: 'timeline',
    desc: 'Ship with confidence using roadmaps, sprint boards, and AI-powered prioritization aligned to your product strategy.',
    bullets: ['Roadmaps', 'Sprint boards', 'AI prioritization'],
    columns: ['Feature', 'Sprint', 'Status', 'Owner'],
    rows: ['Checkout redesign', 'API v3', 'Mobile push notifications'],
  },
  { id: 'marketing', name: 'Marketing', title: 'Marketing', boardType: 'cards',
    desc: 'Scale creative output without increasing headcount using AI agents that execute campaigns within your brand context.',
    bullets: ['Campaign boards', 'Asset approval', 'Brand context'],
    columns: ['Campaign', 'Channel', 'Status', 'Launch'],
    rows: ['Q3 Launch Campaign', 'Webinar - Demand Gen', 'Social Q4'],
  },
  { id: 'it', name: 'IT', title: 'IT', boardType: 'compact',
    desc: 'Streamline tickets, incidents, and infrastructure changes with automated routing and real-time SLA tracking.',
    bullets: ['Ticket routing', 'SLA tracking', 'Change management'],
    columns: ['Ticket', 'Type', 'Priority', 'SLA'],
    rows: ['VPN access - J. Smith', 'Server upgrade prod', 'SSO integration'],
  },
  { id: 'operations', name: 'Operations', title: 'Operations', boardType: 'stages',
    desc: 'Orchestrate cross-functional workflows with smart automations, approvals, and operational dashboards that actually reflect reality.',
    bullets: ['Workflow automation', 'Approvals', 'Live dashboards'],
    columns: ['Workflow', 'Stage', 'Owner', 'Next action'],
    rows: ['Vendor onboarding', 'CapEx approval Q3', 'Inventory cycle count'],
  },
]

// Department-specific agent activity messages (cycle through these for "agents doing work")
const SOLUTIONS_AGENT_ACTIVITY = {
  pmo: ['Agent updated timeline · Q3 Product Launch', 'Resource allocated · Enterprise Security', 'Status → On track · CRM Migration'],
  legal: ['Agent drafted clause · NDA Acme Corp', 'Compliance check passed · MSA Renewal', 'Review assigned · IP License'],
  hr: ['Agent triggered onboarding · 12 hires', 'Review cycle reminder sent', 'Policy sync completed'],
  product: ['Agent prioritized backlog · Checkout', 'Sprint suggestion · API v3', 'Status updated · Mobile push'],
  marketing: ['Agent scheduled posts · Social Q4', 'Campaign brief generated · Q3 Launch', 'Asset approved · Webinar'],
  it: ['Agent routed ticket · VPN access', 'SLA on track · Server upgrade', 'SSO config validated'],
  operations: ['Agent escalated · CapEx approval', 'Workflow step completed · Vendor onboarding', 'Inventory sync · Cycle count'],
}

const STATUSES = ['On track', 'In progress', 'Review']

function SolutionsBoardAgentStrip({ activities, activityIndex }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--light-bg)] border-b border-[var(--border-light)]">
      <Bot className="w-4 h-4 text-[var(--primary)] shrink-0" />
      <AnimatePresence mode="wait">
        <motion.span
          key={activityIndex}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.25 }}
          className="text-xs text-[var(--text-muted)] truncate"
        >
          {activities[activityIndex]}
        </motion.span>
      </AnimatePresence>
      <span className="ml-auto w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse" title="Live" />
    </div>
  )
}

function TableBoard({ solution }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[380px] text-sm">
        <thead>
          <tr className="border-b border-[var(--border-light)] bg-[var(--light-bg)]">
            <th className="text-left py-3 px-4 font-normal text-[var(--text-muted)] w-12"></th>
            {solution.columns.map((c) => (
              <th key={c} className="text-left py-3 px-4 font-normal text-[var(--text-muted)]">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {solution.rows.map((r, i) => (
            <motion.tr
              key={`${solution.id}-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i, duration: 0.28 }}
              className="border-b border-[var(--border-light)] hover:bg-[var(--light-bg)] transition-colors"
            >
              <td className="py-3 px-4">
                {i % 2 === 0 ? <Bot className="w-4 h-4 text-[var(--primary)]" /> : <User className="w-4 h-4 text-[var(--text-muted)]" />}
              </td>
              <td className="py-3 px-4 font-normal text-[var(--text-primary)]">{r}</td>
              {solution.columns.slice(1).map((_, j) => (
                <td key={j} className="py-3 px-4">
                  {j === 1 ? (
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-normal ${
                      STATUSES[i % 3] === 'On track' ? 'bg-[var(--accent-green)]/15 text-[var(--accent-green)]' :
                      STATUSES[i % 3] === 'In progress' ? 'bg-[var(--primary)]/15 text-[var(--primary)]' : 'bg-[var(--accent-amber)]/15 text-[var(--accent-amber)]'
                    }`}>{STATUSES[i % 3]}</span>
                  ) : (
                    <span className="text-[var(--text-muted)]">—</span>
                  )}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function KanbanBoard({ solution }) {
  const cols = ['In review', 'Approval', 'Done']
  const spread = [0, 1, 2].map((ci) => solution.rows.filter((_, i) => i % 3 === ci))
  return (
    <div className="flex gap-3 p-4 overflow-x-auto min-h-[200px]">
      {cols.map((col, ci) => (
        <motion.div
          key={col}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 * ci, duration: 0.3 }}
          className="flex-shrink-0 w-[140px] rounded-lg bg-[var(--light-bg)] border border-[var(--border-light)] p-2"
        >
          <div className="text-[10px] font-normal text-[var(--text-muted)] uppercase tracking-wider mb-2 px-1">{col}</div>
          <div className="space-y-2">
            {spread[ci].map((row, i) => (
              <div key={row} className="rounded-lg bg-white border border-[var(--border-light)] p-2 shadow-sm">
                <div className="text-xs font-normal text-[var(--text-primary)] leading-tight">{row}</div>
                <div className="mt-1.5 flex items-center gap-1">
                  {ci === 2 ? <CheckCircle className="w-3 h-3 text-[var(--accent-green)]" /> : <Clock className="w-3 h-3 text-[var(--text-muted)]" />}
                  <span className="text-[10px] text-[var(--text-muted)]">{ci === 0 ? 'Draft' : ci === 1 ? 'Pending' : 'Signed'}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function ListBoard({ solution }) {
  return (
    <div className="p-4 space-y-1">
      {solution.rows.map((r, i) => (
        <motion.div
          key={r}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.06 * i, duration: 0.28 }}
          className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-[var(--light-bg)] border border-transparent hover:border-[var(--border-light)] transition-colors"
        >
          {i % 2 === 0 ? <Bot className="w-4 h-4 text-[var(--primary)] shrink-0" /> : <User className="w-4 h-4 text-[var(--text-muted)] shrink-0" />}
          <span className="flex-1 text-sm font-normal text-[var(--text-primary)]">{r}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-normal ${
            STATUSES[i % 3] === 'On track' ? 'bg-[var(--accent-green)]/15 text-[var(--accent-green)]' :
            STATUSES[i % 3] === 'In progress' ? 'bg-[var(--primary)]/15 text-[var(--primary)]' : 'bg-[var(--accent-amber)]/15 text-[var(--accent-amber)]'
          }`}>{STATUSES[i % 3]}</span>
        </motion.div>
      ))}
    </div>
  )
}

function TimelineBoard({ solution }) {
  const pcts = [75, 40, 90]
  return (
    <div className="p-4 space-y-4">
      {solution.rows.map((r, i) => (
        <motion.div
          key={r}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08 * i, duration: 0.3 }}
          className="space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-normal text-[var(--text-primary)]">{r}</span>
            <span className="text-xs text-[var(--text-muted)]">{pcts[i]}%</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--border-light)] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pcts[i]}%` }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
              className="h-full rounded-full bg-[var(--primary)]"
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function CardsBoard({ solution }) {
  return (
    <div className="p-4 grid grid-cols-3 gap-2">
      {solution.rows.map((r, i) => (
        <motion.div
          key={r}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.06 * i, duration: 0.28 }}
          className="rounded-xl bg-white border border-[var(--border-light)] p-3 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-xs font-normal text-[var(--text-primary)] leading-tight line-clamp-2">{r}</div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-[var(--text-muted)]">Campaign</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-normal ${
              STATUSES[i % 3] === 'On track' ? 'bg-[var(--accent-green)]/15 text-[var(--accent-green)]' :
              STATUSES[i % 3] === 'In progress' ? 'bg-[var(--primary)]/15 text-[var(--primary)]' : 'bg-[var(--accent-amber)]/15 text-[var(--accent-amber)]'
            }`}>{STATUSES[i % 3]}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function CompactBoard({ solution }) {
  const types = ['Access', 'Infrastructure', 'Integration']
  const priorities = ['High', 'Medium', 'Low']
  return (
    <div className="p-3 space-y-0">
      {solution.rows.map((r, i) => (
        <motion.div
          key={r}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 * i, duration: 0.25 }}
          className="flex items-center gap-3 py-2 px-3 border-b border-[var(--border-light)] last:border-0 text-sm"
        >
          <span className="w-6 text-[10px] font-mono text-[var(--text-muted)]">#{100 + i}</span>
          <span className="flex-1 font-normal text-[var(--text-primary)] truncate">{r}</span>
          <span className="text-[10px] text-[var(--text-muted)]">{types[i % 3]}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-normal ${
            priorities[i % 3] === 'High' ? 'bg-[var(--accent-pink)]/15 text-[var(--accent-pink)]' :
            priorities[i % 3] === 'Medium' ? 'bg-[var(--accent-amber)]/15 text-[var(--accent-amber)]' : 'bg-[var(--accent-green)]/15 text-[var(--accent-green)]'
          }`}>{priorities[i % 3]}</span>
        </motion.div>
      ))}
    </div>
  )
}

function StagesBoard({ solution }) {
  const stages = ['Request', 'In progress', 'Done']
  const spread = [[solution.rows[0]], [solution.rows[1]], [solution.rows[2]]]
  return (
    <div className="p-4">
      <div className="flex gap-2 mb-3">
        {stages.map((s, i) => (
          <span key={s} className="flex-1 text-center text-[10px] font-normal text-[var(--text-muted)] uppercase tracking-wider">{s}</span>
        ))}
      </div>
      <div className="flex gap-2">
        {spread.map((col, ci) => (
          <motion.div
            key={ci}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * ci, duration: 0.3 }}
            className="flex-1 rounded-lg bg-[var(--light-bg)] border border-[var(--border-light)] p-2 min-h-[80px]"
          >
            {col.map((row) => (
              <div key={row} className="rounded-lg bg-white border border-[var(--border-light)] px-2 py-1.5 mb-1.5 last:mb-0 text-xs font-normal text-[var(--text-primary)]">
                {row}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function SolutionsBoard({ solution, isVisible }) {
  const [activityIndex, setActivityIndex] = useState(0)
  const activities = SOLUTIONS_AGENT_ACTIVITY[solution.id] || SOLUTIONS_AGENT_ACTIVITY.pmo
  const boardType = solution.boardType || 'table'

  useEffect(() => {
    if (!isVisible) return
    const t = setInterval(() => setActivityIndex((i) => (i + 1) % activities.length), 2800)
    return () => clearInterval(t)
  }, [isVisible, activities.length])

  const renderBoard = () => {
    switch (boardType) {
      case 'kanban': return <KanbanBoard solution={solution} />
      case 'list': return <ListBoard solution={solution} />
      case 'timeline': return <TimelineBoard solution={solution} />
      case 'cards': return <CardsBoard solution={solution} />
      case 'compact': return <CompactBoard solution={solution} />
      case 'stages': return <StagesBoard solution={solution} />
      default: return <TableBoard solution={solution} />
    }
  }

  return (
    <div className="rounded-xl border border-[var(--border-light)] bg-white overflow-hidden shadow-sm">
      <SolutionsBoardAgentStrip activities={activities} activityIndex={activityIndex} />
      {renderBoard()}
    </div>
  )
}

function SolutionsSection() {
  const [active, setActive] = useState('pmo')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const current = SOLUTIONS.find((s) => s.id === active)

  return (
    <section ref={ref} className="py-20 md:py-28 px-6 md:px-10 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: SECTION_INITIAL_Y }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.08, ...SECTION_TRANSITION }}
          className="font-sans font-normal text-4xl md:text-5xl text-[var(--text-primary)] text-center mb-4"
        >
          Solutions for every team. Agents for any task.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: SECTION_INITIAL_Y }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.14, ...SECTION_TRANSITION }}
          className="text-center text-[var(--text-muted)] text-lg md:text-xl max-w-2xl mx-auto mb-10"
        >
          A complete solution for every team, with agents that do the work.
        </motion.p>
        {/* Departments bar — circular avatars + labels, light background */}
        <div className="rounded-2xl bg-white border border-[var(--border-light)] p-4 md:p-5 mb-10 overflow-x-auto">
          <div className="flex items-end justify-center gap-6 md:gap-8 min-w-max">
            {SOLUTIONS.map((s) => {
              const colors = [
                'bg-[#E87939]',   // PMO
                'bg-[#F5A623]',   // Legal
                'bg-[#E8D83C]',   // HR
                'bg-[#4F7CFF]',   // Product
                'bg-[#6C47FF]',   // Marketing
                'bg-[#00CA72]',   // IT
                'bg-[#A78BFA]',   // Operations
              ]
              const color = colors[SOLUTIONS.indexOf(s)] || 'bg-[var(--primary)]'
              const isActive = active === s.id
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActive(s.id)}
                  className={`flex flex-col items-center gap-2 shrink-0 transition-all duration-200 ${
                    isActive ? 'rounded-2xl ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--light-bg)] p-2 -m-2' : ''
                  }`}
                >
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-full ${color} flex items-center justify-center text-white font-normal text-lg shadow-inner`}
                  >
                    {s.name.charAt(0)}
                  </div>
                  <span className={`text-xs font-normal whitespace-nowrap ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                    {s.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="grid md:grid-cols-5 gap-10 items-start"
          >
            <div className="md:col-span-2">
              <h3 className="font-sans font-normal text-3xl md:text-4xl text-[var(--text-primary)] mb-4">
                {current.title}
              </h3>
              <p className="text-[var(--text-muted)] mb-6">{current.desc}</p>
              <ul className="space-y-3">
                {current.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-[var(--text-primary)]">
                    <CheckCircle className="w-5 h-5 text-[var(--accent-green)] shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-3">
              <SolutionsBoard solution={current} isVisible={inView} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

// ----- Lifecycle (scroll-sync) -----
const LIFECYCLE_STEPS = [
  {
    title: 'Strategy & Planning',
    desc: 'Turns goals into structured plans, timelines, and priorities aligned to business strategy.',
    mockup: 'goal',
  },
  {
    title: 'Resource Management',
    desc: 'Allocates work across people and agents, balancing capacity, cost, skills, and impact.',
    mockup: 'heatmap',
  },
  {
    title: 'Execution & Delivery',
    desc: 'Coordinates tasks, handoffs, and approvals across teams, agents, and tools.',
    mockup: 'kanban',
  },
  {
    title: 'Tracking & Monitoring',
    desc: 'Continuously monitors progress, predicts risk, and recommends corrective actions.',
    mockup: 'risk',
  },
  {
    title: 'Reporting & Insights',
    desc: 'Delivers role-based views that connect progress, spend, and outcomes.',
    mockup: 'dashboard',
  },
]

const LIFECYCLE_AGENT_ACTIVITY = {
  goal: ['Agent broke down goal into 2 projects', 'Timeline aligned to strategy', 'Project A assigned to agent'],
  heatmap: ['Agent balanced capacity across 3 teams', 'Workload reallocated · 2h ago', 'Resource suggestion applied'],
  kanban: ['Agent moved task to Done', 'Handoff approved · Execution', 'New task created by agent'],
  risk: ['Agent flagged 2 at-risk items', 'Recommendation: extend timeline', 'Risk score updated'],
  dashboard: ['Agent generated Q4 summary', '94% adoption · live', 'Insights synced for leadership'],
}

function LifecycleBoard({ step, isVisible }) {
  const [activityIndex, setActivityIndex] = useState(0)
  const activities = LIFECYCLE_AGENT_ACTIVITY[step] || LIFECYCLE_AGENT_ACTIVITY.goal

  useEffect(() => {
    if (!isVisible) return
    const t = setInterval(() => {
      setActivityIndex((i) => (i + 1) % activities.length)
    }, 2800)
    return () => clearInterval(t)
  }, [isVisible, activities.length])

  return (
    <div className="rounded-xl border border-[var(--border-light)] bg-white overflow-hidden shadow-sm min-h-[360px]">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--light-bg)] border-b border-[var(--border-light)]">
        <Bot className="w-4 h-4 text-[var(--primary)] shrink-0" />
        <AnimatePresence mode="wait">
          <motion.span
            key={`${step}-${activityIndex}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.25 }}
            className="text-xs text-[var(--text-muted)] truncate"
          >
            {activities[activityIndex]}
          </motion.span>
        </AnimatePresence>
        <span className="ml-auto w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse" title="Live" />
      </div>
      <LifecycleMockup step={step} />
    </div>
  )
}

function LifecycleMockup({ step }) {
  const mockups = {
    goal: (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="space-y-3 p-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">Goal → Projects</span>
          <span className="flex items-center gap-1.5 text-[10px] text-[var(--primary)]">
            <Bot className="w-3 h-3" />
            Agent
          </span>
        </div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '75%' }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="h-2 rounded bg-[var(--primary)]"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '50%' }}
          transition={{ delay: 0.16, duration: 0.4 }}
          className="h-2 rounded bg-[var(--border-light)]"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '66%' }}
          transition={{ delay: 0.22, duration: 0.4 }}
          className="h-2 rounded bg-[var(--border-light)]"
        />
        <div className="flex gap-2 mt-4">
          {['Project A', 'Project B'].map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.3 }}
              className={`flex-1 rounded-lg border border-[var(--border-light)] p-2 flex items-center gap-2 ${i === 0 ? '' : ''}`}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${i === 0 ? 'bg-[var(--primary)]/30' : 'bg-[var(--light-bg)]'}`}>
                {i === 0 ? <Bot className="w-3 h-3 text-[var(--primary)]" /> : <User className="w-3 h-3 text-[var(--text-muted)]" />}
              </div>
              <span className="text-xs text-[var(--text-primary)]">{label}</span>
            </motion.div>
          ))}
        </div>
        <div className="flex items-center gap-4 pt-1 text-[10px] text-[var(--text-muted)]">
          <span className="flex items-center gap-1"><Bot className="w-3 h-3 text-[var(--primary)]" /> Agent</span>
          <span className="flex items-center gap-1"><User className="w-3 h-3" /> Owner</span>
        </div>
      </motion.div>
    ),
    heatmap: (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.05 }} className="p-4 space-y-2">
        <div className="text-xs text-[var(--text-muted)]">Workload</div>
        <div className="grid grid-cols-5 gap-1">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 + (i % 5) * 0.15 }}
              transition={{ delay: 0.05 + i * 0.02, duration: 0.25 }}
              className="h-6 rounded bg-[var(--accent-amber)]/20 border border-[var(--border-light)]"
            />
          ))}
        </div>
        <div className="flex justify-between items-center text-xs text-[var(--text-muted)] mt-2">
          <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Human</span>
          <span className="flex items-center gap-1.5"><Bot className="w-3.5 h-3.5 text-[var(--primary)]" /> Agent</span>
        </div>
      </motion.div>
    ),
    kanban: (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.05 }} className="p-4 flex gap-2">
        {['To Do', 'Doing', 'Done'].map((col, ci) => (
          <motion.div
            key={col}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * ci, duration: 0.3 }}
            className="flex-1 rounded-lg border border-[var(--border-light)] p-2"
          >
            <div className="text-xs text-[var(--text-muted)] mb-2">{col}</div>
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + ci * 0.08 }}
              className="h-8 rounded bg-[var(--primary)]/20 mb-1 flex items-center gap-1.5 px-2"
            >
              <Bot className="w-3 h-3 text-[var(--primary)] shrink-0" />
              <span className="text-[10px] text-[var(--text-primary)] truncate">Agent task</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + ci * 0.08 }}
              className="h-8 rounded bg-[var(--light-bg)] flex items-center gap-1.5 px-2"
            >
              <User className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
              <span className="text-[10px] text-[var(--text-muted)] truncate">Human</span>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    ),
    risk: (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.05 }} className="p-4 space-y-3">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-2 text-[var(--accent-amber)]">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">2 at-risk items</span>
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="origin-left h-16 rounded border border-[var(--border-light)] flex items-center px-3"
        >
          <div className="flex-1 h-2 bg-[var(--accent-green)] rounded-l" style={{ width: '60%' }} />
          <div className="flex-1 h-2 bg-[var(--accent-amber)] rounded-r" style={{ width: '40%' }} />
        </motion.div>
        <div className="flex flex-wrap items-center gap-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--primary)]/20 border border-[var(--primary)]/50"
          >
            <Bot className="w-3 h-3 text-[var(--primary)]" />
            <span className="text-[10px] text-[var(--text-primary)]">Agent recommendation</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--light-bg)] border border-[var(--border-light)]"
          >
            <User className="w-3 h-3 text-[var(--text-muted)]" />
            <span className="text-[10px] text-[var(--text-muted)]">Review</span>
          </motion.div>
        </div>
        <div className="text-xs text-[var(--text-muted)]">Predictive timeline</div>
      </motion.div>
    ),
    dashboard: (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.05 }} className="p-4 space-y-3">
        <div className="flex gap-2">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 + i * 0.1, duration: 0.35 }}
              className="flex-1 rounded-lg border border-[var(--border-light)] h-20 flex flex-col items-center justify-center gap-1"
            >
              {i === 0 ? (
                <>
                  <div className="flex items-center gap-1">
                    <Bot className="w-5 h-5 text-[var(--primary)]" />
                    <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)]">+ Agent insights</span>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-[var(--accent-green)]" />
                    <span className="text-2xl font-normal text-[var(--accent-green)]">94%</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)]">adoption</span>
                </>
              )}
            </motion.div>
          ))}
        </div>
        <div className="flex items-center gap-4 text-[10px] text-[var(--text-muted)]">
          <span className="flex items-center gap-1"><Bot className="w-3 h-3 text-[var(--primary)]" /> Agent</span>
          <span className="flex items-center gap-1"><User className="w-3 h-3" /> Your team</span>
        </div>
      </motion.div>
    ),
  }
  return <div className="min-h-[300px] flex flex-col justify-center">{mockups[step] || mockups.goal}</div>
}

function LifecycleSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  // Smoother scroll zones so step doesn't flicker at boundaries
  const stepIndex = useTransform(scrollYProgress, [0, 0.16, 0.36, 0.56, 0.76, 1], [0, 1, 2, 3, 4, 4])
  const [currentStep, setCurrentStep] = useState(0)
  useEffect(() => {
    const unsub = stepIndex.on('change', (v) => {
      setCurrentStep(Math.min(4, Math.max(0, Math.round(v))))
    })
    return () => unsub()
  }, [stepIndex])

  return (
    <section ref={sectionRef} className="relative bg-[var(--light-bg)]">
      {/* Desktop: scroll-synced — all titles visible, active bold + text & image */}
      <div className="hidden md:block sticky top-0 min-h-screen flex flex-col justify-center py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-10 w-full">
          <h2 className="font-sans font-normal text-4xl md:text-5xl text-[var(--text-primary)] text-center mb-4">
            From intent to outcome, powered by AI
          </h2>
          <p className="text-center text-[var(--text-muted)] text-lg md:text-xl max-w-2xl mx-auto mb-16">
            Every step of work, in one place.
          </p>
          {/* Full-width title + description so copy spans the component */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="mb-10"
            >
              <h3 className="font-sans font-normal text-2xl md:text-3xl text-[var(--text-primary)] mb-2">
                {LIFECYCLE_STEPS[currentStep].title}
              </h3>
              <p className="text-[var(--text-muted)] text-base md:text-lg max-w-none">
                {LIFECYCLE_STEPS[currentStep].desc}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="grid md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4 flex flex-col">
              {/* All titles visible as you scroll — numbers + bullets aligned, active bold */}
              <ul className="space-y-4 list-none p-0 m-0">
                {LIFECYCLE_STEPS.map((step, i) => (
                  <li
                    key={step.title}
                    className={`flex items-center gap-4 py-4 min-h-[3.5rem] border-l-2 -ml-0.5 pl-1 transition-colors ${
                      i === currentStep
                        ? 'border-[var(--primary)] text-[var(--text-primary)]'
                        : 'border-transparent text-[var(--text-muted)]'
                    }`}
                  >
                    <span className="flex items-center gap-2 shrink-0 w-10">
                      <span
                        className={`font-mono text-sm tabular-nums w-6 text-right ${
                          i === currentStep ? 'text-[var(--primary)] font-normal' : 'text-[var(--text-muted)]'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}.
                      </span>
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        animate={{
                          backgroundColor: i === currentStep ? 'var(--primary)' : 'var(--border-light)',
                          boxShadow: i === currentStep ? '0 0 8px var(--primary)' : 'none',
                        }}
                      />
                    </span>
                    <h3
                      className={`font-sans text-lg md:text-xl leading-snug ${
                        i === currentStep ? 'font-normal' : 'font-normal'
                      }`}
                    >
                      {step.title}
                    </h3>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-8 min-h-[380px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                  className="w-full"
                >
                  <LifecycleBoard step={LIFECYCLE_STEPS[currentStep].mockup} isVisible />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:block h-[500vh]" />

      {/* Mobile: simple stepper */}
      <div className="md:hidden py-20 px-6 bg-[var(--light-bg)]">
        <h2 className="font-sans font-normal text-4xl text-[var(--text-primary)] text-center mb-4">
          From intent to outcome, powered by AI
        </h2>
        <p className="text-center text-[var(--text-muted)] text-lg max-w-xl mx-auto mb-10">
          Every step of work, in one place.
        </p>
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex gap-2">
            {LIFECYCLE_STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentStep(i)}
                className={`w-2 h-2 rounded-full transition ${
                  i === currentStep ? 'bg-[var(--primary)] scale-125' : 'bg-[var(--border-light)]'
                }`}
                aria-label={`Step ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
            {LIFECYCLE_STEPS.map((step, i) => (
              <button
                key={step.title}
                type="button"
                onClick={() => setCurrentStep(i)}
                className={i === currentStep ? 'font-normal text-[var(--text-primary)]' : 'font-normal text-[var(--text-muted)]'}
              >
                {step.title}
              </button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-2xl mx-auto"
          >
            <h3 className="font-sans font-normal text-2xl text-[var(--text-primary)] mb-2">
              {LIFECYCLE_STEPS[currentStep].title}
            </h3>
            <p className="text-[var(--text-muted)] text-sm mb-6 w-full">
              {LIFECYCLE_STEPS[currentStep].desc}
            </p>
            <LifecycleBoard step={LIFECYCLE_STEPS[currentStep].mockup} isVisible />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

// ----- Guardrails: two-column, pillars left, dissolving panel right -----
const GUARDRAILS_PILLARS = [
  { id: 'security', title: 'Security', sub: 'Data protection and access controls, built in.' },
  { id: 'transparency', title: 'Transparency', sub: 'See exactly what AI does and why.' },
  { id: 'accountability', title: 'Accountability', sub: 'Every action owned by a person or an agent.' },
  { id: 'control', title: 'Control', sub: 'Adjust, pause, or override anything. Always.' },
]

const GUARDRAILS_PILLAR_TOGGLES = {
  security: [
    { key: 'roleBased', label: 'Role-based permissions', defaultOn: true },
    { key: 'encryption', label: 'Data encryption at rest', defaultOn: true },
    { key: 'sso', label: 'SSO & identity management', defaultOn: true },
    { key: 'thirdParty', label: 'Third-party access controls', defaultOn: false },
  ],
  transparency: [
    { key: 'explanations', label: 'AI action explanations', defaultOn: true },
    { key: 'auditLog', label: 'Decision audit log', defaultOn: true },
    { key: 'activityFeed', label: 'Agent activity feed', defaultOn: false },
    { key: 'weeklyDigest', label: 'Weekly AI summary digest', defaultOn: false },
  ],
  accountability: [
    { key: 'signOff', label: 'Human sign-off on critical actions', defaultOn: true },
    { key: 'timestamped', label: 'Timestamped approval records', defaultOn: true },
    { key: 'attribution', label: 'Agent attribution on all changes', defaultOn: true },
    { key: 'complianceReports', label: 'Automated compliance reports', defaultOn: false },
  ],
  control: [
    { key: 'override', label: 'Override any agent action', defaultOn: true },
    { key: 'pause', label: 'Pause agents by board or workspace', defaultOn: true },
  ],
}

function getDefaultToggles(pillarId) {
  const rows = GUARDRAILS_PILLAR_TOGGLES[pillarId] || []
  return Object.fromEntries(rows.map((t) => [t.key, t.defaultOn]))
}

function GuardrailsToggle({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm text-[var(--text-primary)]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative rounded-full min-w-[44px] h-6 flex-shrink-0 transition-colors duration-200 ${
          value ? 'bg-[var(--primary)]' : 'bg-[var(--border-light)]'
        }`}
      >
        <motion.span
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
          initial={false}
          animate={{ left: value ? 22 : 3 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  )
}

function GuardrailsPanelContent({ pillarId, toggles, setToggles, scope, setScope }) {
  const rows = GUARDRAILS_PILLAR_TOGGLES[pillarId] || []
  const isControl = pillarId === 'control'

  return (
    <div className="space-y-3">
      {rows.map(({ key, label }) => (
        <div
          key={key}
          className="rounded-xl bg-white border border-[rgba(0,0,0,0.07)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] px-4 py-3"
        >
          <GuardrailsToggle
            label={label}
            value={toggles[key]}
            onChange={() => setToggles((s) => ({ ...s, [key]: !s[key] }))}
          />
        </div>
      ))}
      {isControl && (
        <>
          <div className="rounded-xl bg-white border border-[rgba(0,0,0,0.07)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] px-4 py-3">
            <p className="text-sm text-[var(--text-primary)] mb-3">Level of context</p>
            <div className="flex gap-4">
              {[
                { value: 'board', label: 'Board' },
                { value: 'workspace', label: 'Workspace' },
                { value: 'account', label: 'Account' },
              ].map(({ value: v, label }) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="guardrails-scope"
                    checked={scope === v}
                    onChange={() => setScope(v)}
                    className="accent-[var(--primary)] w-3.5 h-3.5"
                  />
                  <span className="text-sm text-[var(--text-primary)]">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-white border border-[rgba(0,0,0,0.07)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] px-4 py-3">
            <p className="text-sm text-[var(--text-muted)]">Connected tools: Slack · Jira · Salesforce</p>
          </div>
        </>
      )}
    </div>
  )
}

// ----- Guardrails -----
function GuardrailsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px 80px 0px' })
  const [activePillar, setActivePillar] = useState('security')
  const [toggles, setToggles] = useState(() => getDefaultToggles('security'))
  const [scope, setScope] = useState('workspace')

  // Reset toggles to pillar defaults when pillar changes
  useEffect(() => {
    setToggles(getDefaultToggles(activePillar))
  }, [activePillar])

  return (
    <section ref={ref} className="py-16 md:py-24 px-6 md:px-10" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: SECTION_INITIAL_Y }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.06, ...SECTION_TRANSITION }}
          className="font-sans font-normal text-4xl md:text-5xl text-[var(--text-primary)] text-center mb-2"
        >
          You set the guardrails.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: SECTION_INITIAL_Y }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.12, ...SECTION_TRANSITION }}
          className="text-base md:text-lg text-[var(--text-muted)] text-center mb-14 md:mb-16 max-w-2xl mx-auto"
        >
          You decide what people and AI can do. Easy.
        </motion.p>

        <div className="grid md:grid-cols-[0.4fr_0.6fr] gap-10 md:gap-14 items-start">
          {/* Left: 4 pillars — bold title + one line, 48px spacing, inactive 0.3 opacity */}
          <div className="space-y-12">
            {GUARDRAILS_PILLARS.map((pillar) => {
              const isActive = activePillar === pillar.id
              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => setActivePillar(pillar.id)}
                  className="text-left w-full transition-opacity duration-200"
                  style={{ opacity: isActive ? 1 : 0.3 }}
                >
                  <h3 className="font-sans font-normal text-xl md:text-2xl text-[var(--text-primary)] leading-tight">
                    {pillar.title}
                  </h3>
                  <p className="mt-1 text-sm md:text-base text-[var(--text-muted)] leading-snug max-w-sm">
                    {pillar.sub}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Right: dissolving card — content fades out/in, card height animates */}
          <motion.div
            layout
            className="relative rounded-[20px] bg-white p-6 md:p-8 min-h-[200px]"
            style={{
              border: '1px solid rgba(0,0,0,0.07)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <span
              className="guardrails-live-dot absolute top-5 right-5 w-2 h-2 rounded-full bg-[var(--accent-green)]"
              title="Live"
              aria-hidden
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={activePillar}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ exit: { duration: 0.2 }, enter: { duration: 0.3 } }}
                className="pr-6"
              >
                <GuardrailsPanelContent
                  pillarId={activePillar}
                  toggles={toggles}
                  setToggles={setToggles}
                  scope={scope}
                  setScope={setScope}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ----- Org Intelligence Graph -----
const NODES = [
  { id: 'ai', label: 'monday AI', cx: 50, cy: 50, central: true },
  { id: 'slack', label: 'Slack', cx: 20, cy: 25, arm: 1 },
  { id: 'salesforce', label: 'Salesforce', cx: 15, cy: 35, arm: 1 },
  { id: 'drive', label: 'Drive', cx: 25, cy: 15, arm: 1 },
  { id: 'jira', label: 'Jira', cx: 18, cy: 42, arm: 1 },
  { id: 'github', label: 'GitHub', cx: 22, cy: 48, arm: 1 },
  { id: 'boards', label: 'Boards', cx: 78, cy: 28, arm: 2 },
  { id: 'timelines', label: 'Timelines', cx: 82, cy: 38, arm: 2 },
  { id: 'people', label: 'People', cx: 75, cy: 48, arm: 2 },
  { id: 'org', label: 'Org chart', cx: 85, cy: 52, arm: 2 },
  { id: 'docs', label: 'Docs', cx: 50, cy: 82, arm: 3 },
  { id: 'archived', label: 'Archived projects', cx: 42, cy: 88, arm: 3 },
  { id: 'decisions', label: 'Decisions', cx: 58, cy: 86, arm: 3 },
  { id: 'leavers', label: 'Leavers', cx: 52, cy: 92, arm: 3 },
]

// Context diagram: left (sources) → center (monday AI) → right (teams + agents)
const CONTEXT_SOURCES = [
  { id: 'company', title: 'Company Data', line: 'All your tools, connected', tools: 'Slack · Jira · Drive · +', Icon: Database },
  { id: 'active', title: 'Active Work Context', line: 'Projects, resources, and real-time state of work', Icon: LayoutDashboard, prominent: true },
  { id: 'historical', title: 'Historical Knowledge', line: 'Institutional memory that stays even as teams change', Icon: FolderArchive },
]

function ContextFlowDiagram({ inView }) {
  const [hoveredSource, setHoveredSource] = useState(null)

  return (
    <div className="context-diagram-bg overflow-hidden w-full max-w-4xl mx-auto">
      <div className="relative w-full min-h-[380px] md:min-h-[420px] flex items-stretch px-6 md:px-10 py-10 md:py-12">
        {/* SVG: curved connector lines (behind content), dashed flow animation */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ zIndex: 0 }}>
          {/* Left → center (3 curves, 40% opacity; hover = full) */}
          <path d="M 18 22 C 32 32 40 40 50 50" fill="none" stroke="var(--primary)" strokeWidth="0.7" strokeLinecap="round" className={hoveredSource === 0 ? 'context-flow-line-fast' : 'context-flow-line'} style={{ opacity: hoveredSource === 0 ? 1 : 0.4 }} />
          <path d="M 18 50 C 32 50 40 50 50 50" fill="none" stroke="var(--primary)" strokeWidth="0.7" strokeLinecap="round" className={hoveredSource === 1 ? 'context-flow-line-fast' : 'context-flow-line'} style={{ opacity: hoveredSource === 1 ? 1 : 0.4 }} />
          <path d="M 18 78 C 32 68 40 60 50 50" fill="none" stroke="var(--primary)" strokeWidth="0.7" strokeLinecap="round" className={hoveredSource === 2 ? 'context-flow-line-fast' : 'context-flow-line'} style={{ opacity: hoveredSource === 2 ? 1 : 0.4 }} />
          {/* Center → right (2 curves, 80% opacity) */}
          <path d="M 50 50 C 62 45 78 38 88 32" fill="none" stroke="var(--primary)" strokeWidth="0.75" strokeLinecap="round" className="context-flow-line" style={{ opacity: hoveredSource !== null ? 1 : 0.8 }} />
          <path d="M 50 50 C 62 55 78 62 88 68" fill="none" stroke="var(--primary)" strokeWidth="0.75" strokeLinecap="round" className="context-flow-line" style={{ opacity: hoveredSource !== null ? 1 : 0.8 }} />
        </svg>

        {/* Left column — 3 source cards, slightly offset, stagger in */}
        <div className="relative z-10 flex flex-col justify-center gap-6 w-[38%] min-w-0 shrink-0">
          {CONTEXT_SOURCES.map((source, i) => (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.08 + i * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setHoveredSource(i)}
              onMouseLeave={() => setHoveredSource(null)}
              className={`rounded-xl bg-white border border-[rgba(0,0,0,0.07)] cursor-default transition-shadow duration-200 ${
                source.prominent ? 'p-4 md:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]' : 'p-3.5 md:p-4'
              }`}
              style={{
                marginLeft: i === 0 ? 4 : i === 1 ? 0 : 8,
                marginRight: i === 1 ? 0 : 6,
                transform: hoveredSource === i ? 'translateY(-3px)' : 'translateY(0)',
                boxShadow: hoveredSource === i ? '0 4px 12px rgba(0,0,0,0.06)' : undefined,
              }}
            >
              <div className="flex items-start gap-2.5">
                <source.Icon className="w-5 h-5 text-[var(--primary)]/80 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className={`font-normal text-[var(--text-primary)] ${source.prominent ? 'text-base' : 'text-sm'}`}>{source.title}</div>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-snug">{source.line}</p>
                  {source.tools && <p className="text-[11px] text-[var(--text-muted)]/90 mt-1">{source.tools}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Center — monday AI node */}
        <div className="relative z-10 flex items-center justify-center w-[24%] shrink-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: inView ? 1 : 0,
              scale: inView ? (hoveredSource !== null ? 1.05 : 1) : 0.9,
            }}
            transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white flex items-center justify-center border-2 border-[var(--primary)]"
            style={{ boxShadow: '0 0 24px rgba(108,71,255,0.25)' }}
          >
            <Sparkles className="w-8 h-8 md:w-9 md:h-9 text-[var(--primary)]" />
          </motion.div>
        </div>

        {/* Right column — output chips, stagger in from right */}
        <div className="relative z-10 flex flex-col justify-center gap-6 w-[38%] min-w-0 shrink-0">
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.28, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl p-3.5 md:p-4 border border-[var(--primary)]/30 transition-shadow duration-200"
            style={{
              backgroundColor: 'rgba(108,71,255,0.05)',
              boxShadow: hoveredSource !== null ? '0 0 20px rgba(108,71,255,0.15)' : undefined,
            }}
          >
            <div className="flex items-center gap-2.5">
              <User className="w-5 h-5 text-[var(--text-primary)] shrink-0" />
              <div>
                <div className="font-normal text-sm text-[var(--text-primary)]">Your teams</div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Always in context</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.36, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl p-3.5 md:p-4 border border-[var(--primary)]/30 transition-shadow duration-200"
            style={{
              backgroundColor: 'rgba(108,71,255,0.05)',
              boxShadow: hoveredSource !== null ? '0 0 20px rgba(108,71,255,0.15)' : undefined,
            }}
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-[var(--primary)] shrink-0" />
              <div>
                <div className="font-normal text-sm text-[var(--text-primary)]">Your agents</div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Ready to act</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function OrgIntelligenceSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px 80px 0px' })

  return (
    <section ref={ref} className="py-20 md:py-28 px-6 md:px-10 bg-[var(--light-bg)]">
      <div className="max-w-3xl mx-auto text-center mb-14 md:mb-16">
        <motion.h2
          initial={{ opacity: 0, y: SECTION_INITIAL_Y }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.06, ...SECTION_TRANSITION }}
          className="font-sans font-normal text-4xl md:text-5xl text-[var(--text-primary)] mb-4"
        >
          Give your teams and your agents the full context.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: SECTION_INITIAL_Y }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.12, ...SECTION_TRANSITION }}
          className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto"
        >
          All of your organizational knowledge in one place.
        </motion.p>
      </div>
      <div className="w-full flex justify-center px-0">
        <ContextFlowDiagram inView={inView} />
      </div>
    </section>
  )
}

// ----- Build any work app (Vibe) — multiple prompts, multiple desktop apps -----
const VIBE_PROMPTS = [
  'Build a project tracker for TechConnect Summit 2026',
  'Create an OKR dashboard for Q4 company goals',
  'Set up a risk register for compliance and audits',
]
const VIBE_APP_SETS = [
  [
    { title: 'Project overview', sub: 'TechConnect Summit 2026', dark: true },
    { title: 'Milestones', sub: 'Venue · Sponsoring · Marketing', dark: true },
    { title: 'Work focus', sub: '13:41 min left · 25 tasks', primary: true },
    { title: 'Up next', sub: 'Social media · Project plan', dark: false },
    { title: 'Task dashboard', sub: '$144.2k · On track', dark: true },
  ],
  [
    { title: 'OKR overview', sub: 'Q4 company goals', dark: true },
    { title: 'Key results', sub: 'Revenue · NPS · Launch', dark: true },
    { title: 'Progress', sub: '72% · On track', primary: true },
    { title: 'Team alignment', sub: 'Engineering · Product · Sales', dark: false },
    { title: 'Scorecard', sub: 'Red · Amber · Green', dark: true },
  ],
  [
    { title: 'Risk register', sub: 'Compliance & audits', dark: true },
    { title: 'Risk matrix', sub: 'Likelihood · Impact', dark: true },
    { title: 'Mitigations', sub: '12 active · 3 overdue', primary: true },
    { title: 'Controls', sub: 'Policy · Process · Tech', dark: false },
    { title: 'Audit trail', sub: 'Last review Nov 2025', dark: true },
  ],
]
const VIBE_PILLS = ['OKR monitoring', 'Project tracker', 'Project documentation', 'Risk register', 'Time tracker', 'Resource insights']

// Short window titles per app type
const VIBE_WINDOW_TITLES = ['Project tracker · TechConnect 2026', 'OKR dashboard · Q4 goals', 'Risk register · Compliance']

// Desktop app window — one per prompt, stacks like overlapping cards
function VibeAppWindow({ index, stackPosition, totalInStack }) {
  const cards = VIBE_APP_SETS[index] || VIBE_APP_SETS[0]
  const title = VIBE_WINDOW_TITLES[index] ?? 'App'
  // Back cards at (0,0); each newer card offset down-right so they stack like a pack
  const offset = stackPosition * 28
  const scale = 1 - (totalInStack - 1 - stackPosition) * 0.04
  const zIndex = stackPosition

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        position: 'absolute',
        left: offset,
        top: offset,
        zIndex,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
      className="w-full max-w-[420px] rounded-xl border border-[var(--border-light)] bg-white shadow-xl overflow-hidden"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border-light)] bg-[var(--light-bg)]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <span className="text-xs text-[var(--text-muted)] truncate flex-1 ml-2 font-normal">{title}</span>
      </div>
      {/* App content — landing-style */}
      <div className="p-5 pb-6 bg-white">
        <h3 className="font-sans font-normal text-lg text-[var(--text-primary)] mb-1">
          {cards[0]?.title}
        </h3>
        <p className="text-sm text-[var(--text-muted)] mb-4">{cards[0]?.sub}</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {cards.slice(1, 5).map((card, i) => (
            <div
              key={i}
              className={`rounded-lg border p-3 ${
                card.primary
                  ? 'bg-[var(--primary)]/10 border-[var(--primary)]/40'
                  : 'bg-[var(--light-bg)] border-[var(--border-light)]'
              }`}
            >
              <div className={`font-normal text-xs ${card.primary ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]'}`}>
                {card.title}
              </div>
              <div className={`text-[10px] mt-0.5 ${card.primary ? 'text-[var(--primary)]/80' : 'text-[var(--text-muted)]'}`}>
                {card.sub}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-normal">
            Open app
          </span>
          <span className="px-3 py-1.5 rounded-lg border border-[var(--border-light)] text-[var(--text-muted)] text-xs font-normal">
            Share
          </span>
        </div>
      </div>
    </motion.div>
  )
}

function VibeAppSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-100px' })
  const [phase, setPhase] = useState('idle')
  const [typedText, setTypedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [stackIndices, setStackIndices] = useState([])

  // Start animation on mount so the stack appears without needing to scroll into view
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      for (let index = 0; index < VIBE_PROMPTS.length; index++) {
        if (cancelled) return
        setCurrentIndex(index)
        if (index === 0) setStackIndices([])
        const prompt = VIBE_PROMPTS[index]
        setPhase('typing')
        setTypedText('')
        await delay(400)
        for (let i = 0; i <= prompt.length; i++) {
          if (cancelled) return
          setTypedText(prompt.slice(0, i))
          await delay(40)
        }
        await delay(400)
        if (cancelled) return
        setPhase('app')
        setStackIndices((prev) => (prev.includes(index) ? prev : [...prev, index]))
        await delay(4000)
        if (cancelled) return
        setPhase('idle')
        await delay(300)
      }
      if (cancelled) return
      run()
    }
    run()
    return () => { cancelled = true }
  }, [])

  const currentPrompt = VIBE_PROMPTS[currentIndex]
  const displayText = phase === 'typing' ? typedText : phase === 'app' ? currentPrompt : ''

  return (
    <section ref={ref} className="py-16 md:py-24 px-6 md:px-10 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="font-sans font-normal text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[var(--text-primary)] mb-3 leading-tight">
            Any workflow, any view, any app.
            <br />
            <span className="block mt-1">In minutes.</span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg md:text-xl max-w-2xl mx-auto mb-4">
            Generate any view or app to fit how your teams work, on top of monday work management.
          </p>
        </motion.div>

        {/* Prompter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-[var(--border-light)] bg-white p-6 md:p-8 mb-12"
        >
          <div className="rounded-xl bg-white border border-[var(--border-light)] px-4 py-3 min-h-[56px] flex items-center">
            {phase === 'typing' ? (
              <>
                <span className="text-[var(--text-primary)]">{typedText}</span>
                <span className="inline-block w-0.5 h-5 bg-[var(--primary)] animate-pulse ml-0.5 align-middle" />
              </>
            ) : (
              <span className={displayText ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}>
                {displayText || 'What do you want to build?'}
              </span>
            )}
          </div>
          <div className="flex gap-3 mt-3">
            <button type="button" className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)]">
              Upload files
            </button>
            <button type="button" className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)]">
              Discuss
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {VIBE_PILLS.map((label) => (
              <span
                key={label}
                className="px-3 py-1.5 rounded-full text-xs font-normal border border-[var(--border-light)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] cursor-default"
              >
                {label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Stack of desktop app windows — pack of cards */}
        <div
          className="relative mx-auto rounded-xl border border-dashed border-[var(--border-light)] bg-[var(--light-bg)]"
          style={{
            minHeight: Math.max(340, 320 + (stackIndices.length > 0 ? (stackIndices.length - 1) * 28 : 0)),
            width: '100%',
            maxWidth: Math.min(520, stackIndices.length > 0 ? 420 + (stackIndices.length - 1) * 28 : 420),
          }}
        >
          <AnimatePresence>
            {stackIndices.map((appIndex, stackPosition) => (
              <VibeAppWindow
                key={`${appIndex}-${stackPosition}`}
                index={appIndex}
                stackPosition={stackPosition}
                totalInStack={stackIndices.length}
              />
            ))}
          </AnimatePresence>
          {stackIndices.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-[var(--text-muted)]">
              Generating your first app…
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ----- Editorial: Why monday work management (4 full-width rows) -----
const EDITORIAL_ROWS = [
  {
    num: '01',
    title: 'Ease of use that drives adoption',
    body: 'Hyper-personalization and intuitive design drive the adoption rates that give you a complete picture of work.',
    proof: 'g2',
  },
  {
    num: '02',
    title: 'Expertise from real-world work',
    body: 'AI capabilities informed by 250K+ customers across industries and the patterns of the world\'s most productive teams.',
    proof: 'customerScale',
  },
  {
    num: '03',
    title: 'Enterprise control without compromise',
    body: 'Trusted by the world\'s most complex organizations, with the permissions, approval gates, and governance to prove it.',
    proof: 'fortune500',
  },
  {
    num: '04',
    title: 'Deep understanding of your business',
    body: 'Unifies your data, work context, and institutional knowledge into a single intelligence layer for people and agents.',
    proof: 'integrations',
  },
]

// Col 4 proof — Row 01: G2 Highest Adoption Badge (~120×140px, #FF492C)
function G2Badge() {
  return (
    <div
      className="rounded-xl flex flex-col items-center justify-center text-center shadow-md"
      style={{ width: 120, minHeight: 140, backgroundColor: '#FF492C', color: 'white' }}
    >
      <div className="flex gap-0.5 mb-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-current" strokeWidth={1.5} />
        ))}
      </div>
      <span className="text-[10px] font-normal opacity-90">G2</span>
      <span className="text-[11px] font-semibold uppercase leading-tight mt-2">Highest</span>
      <span className="text-[11px] font-semibold uppercase leading-tight">Adoption</span>
      <span className="text-[10px] mt-2 opacity-90">Winter 2025</span>
    </div>
  )
}

// Col 4 proof — Row 02: Customer scale stat (Instrument Serif ~48px, CountUp)
function CustomerScaleStat({ inView }) {
  const count250 = useCountUp(250, 1200, inView)
  const count200 = useCountUp(200, 1200, inView)
  return (
    <div className="text-right w-full">
      <div className="font-serif text-[var(--text-primary)] leading-tight" style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
        <div>{count250}K+ customers</div>
        <div>{count200}+ industries</div>
      </div>
      <p className="text-[10px] md:text-xs text-[var(--text-muted)] mt-2">From startups to enterprises, worldwide</p>
    </div>
  )
}

// Col 4 proof — Row 03: Fortune 500 stat (60% countUp, no container)
function Fortune500Stat({ inView }) {
  const pct = useCountUp(60, 1200, inView)
  return (
    <div className="text-right w-full">
      <div className="font-serif text-[var(--text-primary)] leading-none" style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
        {pct}%
      </div>
      <p className="font-sans text-sm text-[var(--text-muted)] mt-1">of the Fortune 500</p>
      <p className="font-sans text-sm text-[var(--text-muted)]">run on monday</p>
    </div>
  )
}

// Col 4 proof — Row 04: Integration stack (monospace, right-aligned)
const INTEGRATION_ITEMS = [
  { label: '200+ integrations', desc: 'Connect your entire stack' },
  { label: 'REST API', desc: 'Build on top of monday' },
  { label: 'MCP support', desc: 'Native AI agent protocol' },
]

function IntegrationStack() {
  return (
    <div className="text-right w-full space-y-3">
      {INTEGRATION_ITEMS.map(({ label, desc }) => (
        <div key={label}>
          <div className="font-mono text-xs md:text-sm text-[var(--text-primary)]">{label}</div>
          <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{desc}</div>
        </div>
      ))}
    </div>
  )
}

function EditorialProof({ row, inView }) {
  if (row.proof === 'g2') return <G2Badge />
  if (row.proof === 'customerScale') return <CustomerScaleStat inView={inView} />
  if (row.proof === 'fortune500') return <Fortune500Stat inView={inView} />
  if (row.proof === 'integrations') return <IntegrationStack />
  return null
}

// Flip card: click (or hover on desktop) to show proof on back. size: 'default' (larger) | 'compact' (smaller)
function FlipCard({ front, back, className = '', delay = 0, inView, size = 'default' }) {
  const [flipped, setFlipped] = useState(false)
  const isCompact = size === 'compact'
  const minH = isCompact ? 'min-h-[200px] md:min-h-[220px]' : 'min-h-[240px] md:min-h-[280px]'
  return (
    <motion.div
      initial={{ opacity: 0, y: SECTION_INITIAL_Y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, ...SECTION_TRANSITION }}
      className={`perspective-[1000px] ${minH} ${className}`}
    >
      <motion.div
        className={`relative w-full h-full ${minH} cursor-pointer`}
        onClick={() => setFlipped((f) => !f)}
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      >
        <div className="absolute inset-0 rounded-2xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(0deg)]">
          {front}
        </div>
        <div className="absolute inset-0 rounded-2xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {back}
        </div>
      </motion.div>
    </motion.div>
  )
}

function DifferentiatorsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px 80px 0px' })

  return (
    <section ref={ref} className="py-20 md:py-32 bg-[var(--light-bg)] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: SECTION_INITIAL_Y }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.06, ...SECTION_TRANSITION }}
          className="font-sans font-normal text-4xl md:text-5xl text-[var(--text-primary)] mb-14 md:mb-16"
        >
          Why monday work management
        </motion.h2>

        {/* Top row: 2 flip cards with proof points */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 mb-10 md:mb-14">
          <FlipCard
            delay={0.1}
            inView={inView}
            front={
              <div className="bg-white rounded-2xl p-8 md:p-10 flex flex-col min-h-[240px] md:min-h-[280px] justify-between">
                <h3 className="font-sans font-semibold text-xl md:text-2xl text-[var(--text-primary)] pr-10">
                  Ease of use that drives proven adoption
                </h3>
                <p className="text-[var(--text-muted)] text-sm md:text-base mt-3 leading-relaxed">
                  Hyper-personalization and intuitive design drive the adoption rates that give you a complete picture of work.
                </p>
                <div className="flex justify-end">
                  <Plus className="w-6 h-6 text-[var(--text-muted)]" strokeWidth={2} />
                </div>
              </div>
            }
            back={
              <div className="bg-white rounded-2xl p-8 md:p-10 flex flex-col min-h-[240px] md:min-h-[280px] items-center justify-center">
                <G2Badge />
              </div>
            }
          />
          <FlipCard
            delay={0.14}
            inView={inView}
            front={
              <div className="rounded-2xl p-8 md:p-10 flex flex-col min-h-[240px] md:min-h-[280px] justify-between" style={{ backgroundColor: 'rgba(79, 124, 255, 0.08)' }}>
                <h3 className="font-sans font-semibold text-xl md:text-2xl text-[var(--text-primary)] pr-10">
                  Expertise built on real-world work
                </h3>
                <p className="text-[var(--text-muted)] text-sm md:text-base mt-3 leading-relaxed">
                  AI capabilities informed by 250K+ customers across industries and the patterns of the world's most productive teams.
                </p>
                <div className="flex justify-end">
                  <X className="w-6 h-6 text-[var(--text-muted)]" strokeWidth={2} />
                </div>
              </div>
            }
            back={
              <div className="rounded-2xl p-8 md:p-10 flex flex-col min-h-[240px] md:min-h-[280px] items-center justify-center" style={{ backgroundColor: 'rgba(79, 124, 255, 0.08)' }}>
                <CustomerScaleStat inView={inView} />
              </div>
            }
          />
        </div>

        {/* Middle: image + Deep understanding flip card (proof: integrations) */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-10 mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: SECTION_INITIAL_Y }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.18, ...SECTION_TRANSITION }}
            className="md:col-span-2 rounded-2xl overflow-hidden aspect-[2.2/1] md:aspect-auto md:min-h-[280px] bg-[var(--dark)]"
          >
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
              alt="Team collaborating"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <FlipCard
            delay={0.2}
            inView={inView}
            front={
              <div className="bg-white rounded-2xl p-8 md:p-10 flex flex-col min-h-[240px] md:min-h-[280px] justify-between">
                <h3 className="font-sans font-semibold text-xl md:text-2xl text-[var(--text-primary)] pr-10">
                  Deep understanding of your business
                </h3>
                <p className="text-[var(--text-muted)] text-sm md:text-base mt-3 leading-relaxed">
                  Unifies your data, work context, and institutional knowledge into a single intelligence layer for people and agents.
                </p>
                <div className="flex justify-end">
                  <Plus className="w-6 h-6 text-[var(--text-muted)]" strokeWidth={2} />
                </div>
              </div>
            }
            back={
              <div className="bg-white rounded-2xl p-8 md:p-10 flex flex-col min-h-[240px] md:min-h-[280px] items-center justify-center">
                <IntegrationStack />
              </div>
            }
          />
        </div>

        {/* Bottom row: 4 flip cards — Enterprise, G2, Gartner, Forrester (smaller) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <FlipCard
            size="compact"
            delay={0.22}
            inView={inView}
            front={
              <div className="bg-white rounded-2xl p-6 md:p-8 flex flex-col min-h-[200px] md:min-h-[220px] justify-between">
                <h3 className="font-sans font-semibold text-lg text-[var(--text-primary)]">
                  Enterprise control without compromise
                </h3>
                <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
                  Trusted by the world's most complex organizations, with the permissions, approval gates, and governance to prove it.
                </p>
                <div className="flex justify-end">
                  <Plus className="w-6 h-6 text-[var(--text-muted)]" strokeWidth={2} />
                </div>
              </div>
            }
            back={
              <div className="bg-white rounded-2xl p-6 md:p-8 flex flex-col min-h-[200px] md:min-h-[220px] items-center justify-center">
                <Fortune500Stat inView={inView} />
              </div>
            }
          />
          <FlipCard
            size="compact"
            delay={0.26}
            inView={inView}
            front={
              <div className="bg-white rounded-2xl p-6 md:p-8 flex flex-col min-h-[200px] md:min-h-[220px] justify-between">
                <h3 className="font-sans font-semibold text-lg text-[var(--text-primary)]">
                  Most popular work management software on G2
                </h3>
                <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
                  Backed by 14K+ customer reviews. Rated by real users as the leader in work management.
                </p>
                <div className="flex justify-end">
                  <Plus className="w-6 h-6 text-[var(--text-muted)]" strokeWidth={2} />
                </div>
              </div>
            }
            back={
              <div className="bg-white rounded-2xl p-6 md:p-8 flex flex-col min-h-[200px] md:min-h-[220px] justify-center">
                <div className="rounded-xl flex flex-col items-center justify-center text-center py-4 px-3 mb-3" style={{ backgroundColor: '#FF492C', color: 'white', minHeight: 100 }}>
                  <span className="text-[10px] font-semibold uppercase tracking-wider opacity-90">Leader</span>
                  <span className="text-xs mt-1 font-medium">WINTER 2026</span>
                  <div className="flex gap-0.5 mt-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" strokeWidth={1.5} />
                    ))}
                  </div>
                  <span className="text-xs mt-1">4.7/5</span>
                </div>
                <p className="text-sm text-[var(--text-muted)] text-center">Based on 14K+ customer reviews</p>
              </div>
            }
          />
          <FlipCard
            size="compact"
            delay={0.28}
            inView={inView}
            front={
              <div className="bg-white rounded-2xl p-6 md:p-8 flex flex-col min-h-[200px] md:min-h-[220px] justify-between">
                <h3 className="font-sans font-semibold text-lg text-[var(--text-primary)]">
                  Leader in Gartner Magic Quadrant
                </h3>
                <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
                  The only Leader in 3 Work Management Gartner® Magic Quadrant™ reports.
                </p>
                <div className="flex justify-end">
                  <Plus className="w-6 h-6 text-[var(--text-muted)]" strokeWidth={2} />
                </div>
              </div>
            }
            back={
              <div className="bg-white rounded-2xl p-6 md:p-8 flex flex-col min-h-[200px] md:min-h-[220px] justify-between">
                <p className="font-sans font-normal text-lg text-[var(--text-primary)] mb-2">The only Leader in</p>
                <p className="text-4xl md:text-5xl font-normal text-[var(--text-primary)] mb-1">3</p>
                <p className="text-sm text-[var(--text-muted)] mb-4">Work Management Gartner® Magic Quadrant™ reports.</p>
                <a href="#" className="text-sm font-normal text-[var(--primary)] hover:underline inline-flex items-center gap-1 mt-auto" onClick={(e) => e.stopPropagation()}>
                  Learn more <ChevronRight className="w-4 h-4" />
                </a>
                <div className="mt-4 pt-4 border-t border-[var(--border-light)]">
                  <span className="text-lg font-normal text-[var(--text-primary)] tracking-tight">Gartner</span>
                </div>
              </div>
            }
          />
          <FlipCard
            size="compact"
            delay={0.3}
            inView={inView}
            front={
              <div className="rounded-2xl p-6 md:p-8 flex flex-col min-h-[200px] md:min-h-[220px] justify-between" style={{ backgroundColor: 'var(--accent-green)' }}>
                <h3 className="font-sans font-semibold text-lg text-white">
                  Recognized by industry leaders
                </h3>
                <p className="text-sm text-white/90 mt-2 leading-relaxed">
                  Independent research validates significant ROI for monday.com customers, including Forrester's Total Economic Impact™ study.
                </p>
                <div className="flex justify-end">
                  <Plus className="w-6 h-6 text-white/80" strokeWidth={2} />
                </div>
              </div>
            }
            back={
              <div className="rounded-2xl p-6 md:p-8 flex flex-col min-h-[200px] md:min-h-[220px] justify-between" style={{ backgroundColor: 'var(--accent-green)' }}>
                <div>
                  <p className="text-5xl md:text-6xl font-bold text-white leading-none">346%</p>
                  <p className="text-sm text-white/90 mt-2 leading-snug">
                    ROI in the Total Economic Impact Study of monday.com
                  </p>
                </div>
                <div className="pt-4 border-t border-white/20">
                  <span className="text-sm font-semibold text-white uppercase tracking-widest">Forrester</span>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </section>
  )
}

function EditorialRow({ row, index, inView }) {
  const rowRef = useRef(null)
  const rowInView = useInView(rowRef, { once: true, margin: '-50px' })
  const fromLeft = index % 2 === 0

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, y: 20, x: fromLeft ? -24 : 24 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: SECTION_EASE, delay: index * 0.15 }}
      className="group relative grid grid-cols-[80px_1fr_2fr_200px] max-md:grid-cols-1 gap-4 md:gap-8 py-8 md:py-10 px-0 border-b border-[var(--dark-border)] items-center hover:bg-white/50 transition-colors duration-300"
    >
      <span className="absolute left-0 top-0 bottom-0 w-0 bg-[var(--primary)] pointer-events-none transition-[width] duration-200 group-hover:w-[3px]" />
      {/* Col 1: Large number 01–04, mono, muted, ~40px */}
      <div className="flex items-center justify-center md:justify-start transition-transform duration-200 group-hover:scale-110 origin-left">
        <motion.span
          className="font-mono text-[var(--text-muted)]"
          style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.5rem)', fontVariantNumeric: 'tabular-nums' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={rowInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.1 + index * 0.15, duration: 0.4 }}
        >
          {row.num}
        </motion.span>
      </div>
      {/* Col 2: Bold title Instrument Serif ~52px */}
      <h3
        className="font-serif font-normal text-[var(--text-primary)] leading-tight"
        style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(1.75rem, 3.5vw, 3.25rem)' }}
      >
        {row.title}
      </h3>
      {/* Col 3: Body copy, max 2 lines, Geist/sans */}
      <p className="font-sans text-[var(--text-muted)] text-base md:text-lg leading-snug line-clamp-2">
        {row.body}
      </p>
      {/* Col 4: Proof element */}
      <div className="flex justify-end items-center max-md:justify-start min-h-[140px]">
        <EditorialProof row={row} inView={rowInView} />
      </div>
    </motion.div>
  )
}

// ----- Social Proof -----
const CUSTOMER_LOGO_ROW1 = ['Uber', 'Coca-Cola', 'Canva', 'Hulu', 'Lionsgate', 'NBC', 'Universal', 'Unilever', 'Adobe', 'Netflix']
const CUSTOMER_LOGO_ROW2 = ['Spotify', 'PayPal', 'Dropbox', 'Salesforce', 'HubSpot', 'Airbnb', 'Lyft', 'Tesla', 'Nike', 'IKEA']

function SocialProofSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px 80px 0px' })
  const count = useCountUp(50, 1500, inView)

  return (
    <section ref={ref} className="py-20 md:py-28 px-6 md:px-10 bg-[var(--light-bg)] overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: SECTION_INITIAL_Y }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.08, ...SECTION_TRANSITION }}
          className="font-sans font-normal text-2xl md:text-3xl text-[var(--text-primary)] text-center max-w-2xl mx-auto mb-8"
        >
          Join 250,000+ teams who rely on monday to reach their goals
        </motion.h2>
        <div className="marquee-track py-2 mb-6">
          {[...Array(2)].map((_, set) => (
            <div key={set} className="flex gap-14 items-center shrink-0 px-4">
              {CUSTOMER_LOGO_ROW1.map((name) => (
                <span key={`${set}-${name}`} className="text-base font-normal text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-300">
                  {name}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-stretch max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: SECTION_INITIAL_Y }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.16, ...SECTION_TRANSITION }}
          className="bg-white text-[var(--text-primary)] rounded-2xl p-8 md:p-12 text-left relative"
        >
            <span className="text-5xl font-sans text-[var(--primary)] absolute top-6 left-8">"</span>
            <p className="text-lg md:text-xl pl-8 pr-4 italic">
              monday.com's AI helped us cut our project planning time in half. What used to take days now takes minutes, and that speed has directly translated into faster delivery for our clients.
            </p>
            <p className="mt-6 font-normal pl-8">Sarah Luxemberg</p>
            <p className="text-sm text-[var(--text-muted)] pl-8">Operations Director, VML</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: SECTION_INITIAL_Y }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, ...SECTION_TRANSITION }}
            className="flex flex-col justify-center md:pl-4"
          >
            <div>
              <span className="text-6xl md:text-7xl font-normal text-[var(--text-primary)]">{count}%</span>
              <p className="text-xl text-[var(--text-muted)] mt-2">faster project delivery</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 md:gap-6 text-sm text-[var(--text-muted)]">
              <span>Most popular work management software on G2</span>
              <span>Backed by 14K+ customer reviews</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-24 h-12 rounded-lg bg-white border border-[var(--border-light)] flex items-center justify-center text-xs text-[var(--text-muted)]"
                >
                  G2 ★★★★
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="marquee-track-reverse py-2 mt-8">
          {[...Array(2)].map((_, set) => (
            <div key={set} className="flex gap-14 items-center shrink-0 px-4">
              {CUSTOMER_LOGO_ROW2.map((name) => (
                <span key={`rev-${set}-${name}`} className="text-base font-normal text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-300">
                  {name}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ----- Enterprise -----
function EnterpriseSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px 80px 0px' })

  return (
    <section ref={ref} className="py-16 md:py-24 px-6 md:px-10 bg-white relative">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between md:flex-wrap gap-4 mb-10">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.05, ...SECTION_TRANSITION }}
              className="text-sm text-[var(--text-muted)] mb-2"
            >
              Enterprise-ready AI work platform
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: SECTION_INITIAL_Y }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08, ...SECTION_TRANSITION }}
              className="font-sans font-normal text-3xl md:text-4xl lg:text-[2.5rem] text-[var(--text-primary)] leading-tight"
            >
              Trusted by enterprises.<br />
              Recognized by industry leaders.
            </motion.h2>
          </div>
          <motion.a
            href="#"
            initial={{ opacity: 0, x: 10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--border-light)] text-[var(--text-primary)] text-sm font-normal hover:bg-[var(--light-bg)] transition-colors shrink-0"
          >
            Contact sales <ChevronRight className="w-4 h-4" />
          </motion.a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: SECTION_INITIAL_Y }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.12, ...SECTION_TRANSITION }}
          className="bg-white text-[var(--text-primary)] rounded-2xl p-6 md:p-8 flex flex-col max-w-2xl"
        >
          <h3 className="font-sans font-normal text-xl md:text-2xl text-[var(--text-primary)] mb-3">
            Enterprise-grade security
          </h3>
          <p className="text-[var(--text-muted)] text-sm md:text-base leading-relaxed mb-4 flex-1">
            Built-in security, data privacy, governance, and compliance so every human and AI action is protected and auditable.
          </p>
          <a href="#" className="text-sm font-normal text-[var(--primary)] hover:underline inline-flex items-center gap-1 w-fit">
            Explore our Trust Center <ChevronRight className="w-4 h-4" />
          </a>
          <div className="mt-6 pt-6 border-t border-[var(--border-light)] flex flex-wrap gap-4 items-center">
            {['GDPR', 'SOC 2', 'ISO 27001', 'HIPAA'].map((badge) => (
              <span
                key={badge}
                className="text-xs font-normal text-[var(--text-muted)] uppercase tracking-wider px-3 py-1.5 rounded-lg bg-[var(--light-bg)]"
              >
                {badge}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ----- Final CTA -----
function FinalCTASection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px 80px 0px' })
  const particles = [...Array(40)].map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 3 + Math.random() * 2,
  }))

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-6 md:px-10 bg-[var(--light-bg)] overflow-hidden final-cta-light">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="star-particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
      <div className="relative max-w-2xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: SECTION_INITIAL_Y }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.08, ...SECTION_TRANSITION }}
          className="font-sans font-normal text-4xl md:text-5xl leading-tight mb-4 text-[var(--text-primary)]"
        >
          Faster execution.
          <br />
          Better decisions.
          <br />
          Across every department.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: SECTION_INITIAL_Y }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.14, ...SECTION_TRANSITION }}
          className="text-[var(--text-muted)] text-lg md:text-xl max-w-2xl mx-auto mb-10"
        >
          Start free and see how fast your output can match your ambition.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: SECTION_INITIAL_Y }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.22, ...SECTION_TRANSITION }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#"
            className="inline-flex justify-center px-8 py-4 rounded-lg bg-[var(--text-primary)] text-white font-normal hover:opacity-90"
          >
            Get started free
          </a>
          <a
            href="#"
            className="inline-flex justify-center px-8 py-4 rounded-lg border border-[var(--border-light)] text-[var(--text-primary)] font-normal hover:bg-[var(--light-bg)]"
          >
            Talk to sales
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// ----- Footer -----
function Footer() {
  const cols = [
    { title: 'Product', links: ['Features', 'Integrations', 'Pricing', 'Changelog'] },
    { title: 'Solutions', links: ['By team', 'By use case', 'Enterprise'] },
    { title: 'Resources', links: ['Blog', 'Help', 'API', 'Community'] },
    { title: 'Company', links: ['About', 'Careers', 'Contact', 'Partners'] },
  ]

  return (
    <footer className="bg-[var(--light-bg)] border-t border-[var(--border-light)] py-16 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-[var(--primary)]" />
              <span className="font-normal text-lg text-[var(--text-primary)]">monday</span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">The AI-powered work OS</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {cols.map((col) => (
              <div key={col.title}>
                <h4 className="font-normal mb-4 text-[var(--text-primary)]">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-8 border-t border-[var(--border-light)]">
          <div className="flex gap-6">
            <a href="#" className="text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label="LinkedIn">LinkedIn</a>
            <a href="#" className="text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label="X">X</a>
            <a href="#" className="text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label="YouTube">YouTube</a>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-[var(--text-muted)]">
            <span>© {new Date().getFullYear()} monday.com</span>
            <a href="#" className="hover:text-[var(--text-primary)]">Privacy</a>
            <a href="#" className="hover:text-[var(--text-primary)]">Terms</a>
            <a href="#" className="hover:text-[var(--text-primary)]">Security</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ----- App -----
export default function App() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar scrolled={scrolled} />
      <main>
        <HeroSection />
        <HeroLogoRow />
        <SolutionsSection />
        <LifecycleSection />
        <GuardrailsSection />
        <OrgIntelligenceSection />
        <VibeAppSection />
        <DifferentiatorsSection />
        <SocialProofSection />
        <EnterpriseSection />
        <FinalCTASection />
        <Footer />
      </main>
    </div>
  )
}
