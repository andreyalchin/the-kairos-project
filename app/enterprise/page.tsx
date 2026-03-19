import Link from 'next/link'

const USE_CASES = [
  {
    title: 'Trait-Based Candidate Screening',
    tag: 'Talent Acquisition',
    tagColor: 'bg-indigo/10 text-indigo',
    body: 'Unstructured interviews have a validity coefficient of r = .38 for predicting job performance — meaning they explain roughly 14% of performance variance. When you add a validated personality assessment to the selection process, incremental validity increases substantially, particularly for roles requiring high Conscientiousness, Emotional Stability, or interpersonal judgment.',
    outcome: 'Reduce time-to-hire and improve offer acceptance rates by screening for the dimensions that actually predict role success — before the first call.',
    cite: 'Schmidt & Hunter, 1998',
  },
  {
    title: 'Leadership Pipeline Identification',
    tag: 'Talent Development',
    tagColor: 'bg-teal/10 text-teal',
    body: "Judge et al.'s landmark 2002 meta-analysis across 222 studies found that the Big Five personality composite correlates r = .48 with leadership emergence and effectiveness — a stronger predictor than many situational factors organizations traditionally rely on. Extraversion, Conscientiousness, Openness, and low Neuroticism are the strongest individual contributors.",
    outcome: "Identify high-potential leaders earlier using Kairos's Leadership Tier scoring (Emerging → Rising → Established → Visionary) and 29-dimension behavioral profile.",
    cite: 'Judge et al., 2002',
  },
  {
    title: 'Team Composition & Cognitive Diversity',
    tag: 'Team Effectiveness',
    tagColor: 'bg-violet-100 text-violet-700',
    body: "Barrick et al. (1998) demonstrated that team-level mean scores on Conscientiousness, Agreeableness, and Extraversion predict team performance above individual contributions alone — and that the variance in team personality composition matters as much as the mean. Homogeneous teams often have execution strength but low innovation. Cognitively diverse teams solve novel problems faster but require strong conflict navigation skills.",
    outcome: "Use Kairos Team Compatibility profiles to build teams with intentional cognitive diversity — pairing Architects with Catalysts, matching Executors to operational roles, and flagging archetype friction risks before they become team dysfunction.",
    cite: 'Barrick et al., 1998',
  },
  {
    title: 'Culture Fit vs. Culture Add',
    tag: 'Cultural Intelligence',
    tagColor: 'bg-amber-100 text-amber-700',
    body: 'The research distinction between culture fit and culture add is critical for long-term organizational health. Hiring strictly for fit — selecting candidates whose personality profiles mirror existing team members — produces homogeneity that reduces creative problem-solving and increases groupthink. Culture add hiring, by contrast, seeks candidates who share core values but contribute distinct cognitive styles.',
    outcome: "Kairos provides both: identify candidates who align on the values dimensions (Honesty-Humility, Purpose Orientation, Agreeableness) while explicitly flagging where they bring differentiated cognitive and motivational profiles that expand the team's range.",
    cite: 'Ashton & Lee, 2007',
  },
  {
    title: 'Onboarding & Role Alignment',
    tag: 'People Operations',
    tagColor: 'bg-pink-100 text-pink-700',
    body: "New hire failure within the first 18 months is disproportionately driven by motivation misalignment, not skill gaps. Ryan and Deci's Self-Determination Theory predicts that employees in roles that satisfy their core autonomy, competence, and relatedness needs demonstrate significantly higher engagement, lower turnover intention, and stronger performance ratings — even when controlling for salary and role level.",
    outcome: "Use Motivational Architecture profiles to align new hires to roles that match their primary drivers from day one. Reduce 90-day churn and increase time-to-full-productivity.",
    cite: 'Ryan & Deci, 2000',
  },
  {
    title: 'Manager–Report Compatibility',
    tag: 'People Operations',
    tagColor: 'bg-pink-100 text-pink-700',
    body: "The relationship between a manager's behavioral style and a direct report's psychological needs is a significant predictor of engagement and voluntary turnover. Mismatched communication styles, autonomy expectations, and conflict navigation preferences create friction that compounds over time — and is almost never surfaced in traditional performance reviews until it is too late.",
    outcome: "Kairos Team Compatibility profiles surface potential friction archetypes between managers and reports before tension escalates. Use this data proactively during team restructuring, promotion decisions, and onboarding design.",
    cite: 'Hogan & Kaiser, 2005',
  },
]

const STATS = [
  { stat: 'r = .48', label: "Big Five composite correlation with leadership effectiveness across 222 studies", cite: "Judge et al., 2002" },
  { stat: '$15k–$50k', label: 'Estimated cost of a bad mid-level hire (direct + indirect costs)', cite: 'SHRM, 2022' },
  { stat: '85 years', label: 'Of personnel selection research supporting personality + cognitive assessment', cite: 'Schmidt & Hunter, 1998' },
  { stat: '+24%', label: 'Incremental predictive validity gained by adding personality to cognitive testing', cite: 'Schmidt & Hunter, 1998' },
]

const RESEARCH = [
  {
    authors: 'Barrick, M. R., & Mount, M. K.',
    year: 1991,
    title: 'The Big Five personality dimensions and job performance: A meta-analysis',
    journal: 'Personnel Psychology, 44(1), 1–26',
    doi: 'https://doi.org/10.1111/j.1744-6570.1991.tb00688.x',
  },
  {
    authors: 'Barrick, M. R., Stewart, G. L., Neubert, M. J., & Mount, M. K.',
    year: 1998,
    title: 'Relating member ability and personality to work-team processes and team effectiveness',
    journal: 'Journal of Applied Psychology, 83(3), 377–391',
    doi: 'https://doi.org/10.1037/0021-9010.83.3.377',
  },
  {
    authors: 'Hogan, R., & Kaiser, R. B.',
    year: 2005,
    title: 'What we know about leadership',
    journal: 'Review of General Psychology, 9(2), 169–180',
    doi: 'https://doi.org/10.1037/1089-2680.9.2.169',
  },
  {
    authors: 'Judge, T. A., Bono, J. E., Ilies, R., & Gerhardt, M. W.',
    year: 2002,
    title: 'Personality and leadership: A qualitative and quantitative review',
    journal: 'Journal of Applied Psychology, 87(4), 765–780',
    doi: 'https://doi.org/10.1037/0021-9010.87.4.765',
  },
  {
    authors: 'Ryan, R. M., & Deci, E. L.',
    year: 2000,
    title: 'Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being',
    journal: 'American Psychologist, 55(1), 68–78',
    doi: 'https://doi.org/10.1037/0003-066X.55.1.68',
  },
  {
    authors: 'Schmidt, F. L., & Hunter, J. E.',
    year: 1998,
    title: 'The validity and utility of selection methods in personnel psychology: Practical and theoretical implications of 85 years of research findings',
    journal: 'Psychological Bulletin, 124(2), 262–274',
    doi: 'https://doi.org/10.1037/0033-2909.124.2.262',
  },
  {
    authors: 'Ashton, M. C., & Lee, K.',
    year: 2007,
    title: 'Empirical, theoretical, and practical advantages of the HEXACO model of personality structure',
    journal: 'Personality and Social Psychology Review, 11(2), 150–166',
    doi: 'https://doi.org/10.1177/1088868306294907',
  },
]

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-bg">

      {/* Hero */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <p className="text-teal text-sm font-semibold uppercase tracking-widest">For Organizations</p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            The science of hiring right.<br className="hidden md:block" /> The cost of hiring wrong.
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Most organizations make their most consequential decisions — who to hire, who to promote, how to build teams — with almost no objective behavioral data. Kairos changes that.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="mailto:andrey.alchin@gmail.com?subject=Enterprise inquiry"
              className="bg-teal text-white px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Contact Sales
            </Link>
            <Link
              href="/pricing"
              className="border border-white/20 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-indigo py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ stat, label, cite }, i) => (
            <div key={stat} className="text-center space-y-2">
              {i > 0 && <div className="hidden md:block absolute left-0 top-0 w-px h-full bg-white/10" />}
              <p className="text-3xl md:text-5xl font-black text-white">{stat}</p>
              <p className="text-xs text-indigo-200 leading-snug">{label}</p>
              <p className="text-xs text-indigo-300 italic">{cite}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The problem */}
      <section className="bg-bg py-24">
        <div className="max-w-5xl mx-auto px-4 space-y-10">
          <h2 className="text-4xl font-bold text-text">The hiring problem no one talks about honestly</h2>
          <div className="grid md:grid-cols-2 gap-8 text-slate-600 leading-relaxed">
            <div className="space-y-4">
              <p>
                Schmidt and Hunter&apos;s monumental 1998 synthesis of 85 years of personnel selection research found that the most commonly used hiring methods — unstructured interviews, reference checks, and years-of-experience requirements — are among the least valid predictors of actual job performance. Yet they remain the default.
              </p>
              <p>
                Unstructured interviews, which most companies rely on as the primary decision input, have a validity coefficient of just r = .38. General cognitive ability combined with a validated personality assessment achieves r = .63 — nearly double the predictive power. The data has been available for decades. The adoption has not followed.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                The cost consequence is substantial. A mis-hire at the mid-level — someone who fails to perform or leaves within 18 months — costs an organization between 50% and 200% of their annual salary in recruitment, onboarding, lost productivity, and team disruption. For senior roles, that figure climbs further.
              </p>
              <p>
                The solution is not more interviews. It is better data. Specifically: validated, multi-dimensional behavioral data collected before the interview, used to structure the conversation around the dimensions that actually predict success in that role.
              </p>
            </div>
          </div>
          {/* Pull-quote */}
          <div className="relative rounded-2xl bg-indigo/10 border border-indigo/20 px-8 py-10 md:px-14">
            <span className="absolute top-4 left-6 text-8xl text-indigo/20 font-serif leading-none select-none pointer-events-none" aria-hidden="true">&ldquo;</span>
            <p className="relative text-text italic text-lg leading-relaxed text-center max-w-3xl mx-auto">
              The most valid predictors of job performance are general cognitive ability and a valid structured personality assessment. Together, they explain substantially more variance in performance than any single method and outperform unstructured interviews by a wide margin.
            </p>
            <p className="text-slate-500 text-sm text-center mt-5">— Schmidt &amp; Hunter, Psychological Bulletin, 1998</p>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-bold text-text">Where Kairos fits your HR process</h2>
            <p className="text-slate-500 text-lg">Six evidence-backed applications across the employee lifecycle.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {USE_CASES.map(({ title, tag, tagColor, body, outcome, cite }) => (
              <div key={title} className="bg-bg rounded-2xl border border-slate-100 p-6 space-y-3 flex flex-col hover:-translate-y-1 transition-transform duration-200 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-text leading-tight">{title}</h3>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${tagColor}`}>{tag}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
                <div className="bg-white rounded-xl border border-slate-100 px-4 py-3 mt-auto space-y-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Outcome</p>
                  <p className="text-sm text-slate-700">{outcome}</p>
                </div>
                <p className="text-xs text-slate-400 italic">Research basis: {cite}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Validity table */}
      <section className="bg-slate-900 py-24">
        <div className="max-w-5xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-bold text-white">Why psychometric assessment outperforms the alternatives</h2>
            <p className="text-slate-400 text-lg">Validity coefficients from Schmidt &amp; Hunter (1998). r = correlation with job performance.</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/50">
                  <th className="text-left py-4 px-5 text-slate-400 font-medium">Selection Method</th>
                  <th className="text-left py-4 px-5 text-slate-400 font-medium">Validity (r)</th>
                  <th className="text-left py-4 px-5 text-slate-400 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { method: 'Work sample tests', r: '.54', note: 'High validity, but expensive and role-specific', highlight: false },
                  { method: 'Cognitive ability + personality', r: '.63', note: 'Highest combined validity of practical methods', highlight: true },
                  { method: 'Structured interview', r: '.51', note: 'Valid but resource-intensive to administer consistently', highlight: false },
                  { method: 'Validated personality assessment', r: '.40', note: 'Incremental validity above cognitive tests alone', highlight: true },
                  { method: 'Unstructured interview', r: '.38', note: 'Most commonly used; among the least valid', highlight: false },
                  { method: 'Reference checks', r: '.26', note: 'Socially desirable responding severely limits validity', highlight: false },
                  { method: 'Years of experience', r: '.18', note: 'Weakest predictor of performance; widely over-relied upon', highlight: false },
                ].map(({ method, r, note, highlight }) => (
                  <tr key={method} className={`border-b border-slate-800 last:border-0 ${highlight ? 'bg-indigo/20' : 'bg-slate-900'}`}>
                    <td className={`py-4 px-5 font-semibold ${highlight ? 'text-white' : 'text-slate-300'}`}>{method}</td>
                    <td className={`py-4 px-5 font-black text-lg ${highlight ? 'text-teal' : 'text-slate-500'}`}>{r}</td>
                    <td className="py-4 px-5 text-slate-400 text-xs leading-relaxed">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-bg py-24">
        <div className="max-w-5xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-bold text-text">How it works in your hiring process</h2>
            <p className="text-slate-500 text-lg">Four steps. No platform fee. No minimums.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { step: '01', title: 'Send assessment link', body: 'Candidates complete the Kairos assessment in 15–20 minutes. No registration required on their end.', color: 'bg-indigo-50 border-indigo/10' },
              { step: '02', title: 'Receive structured data', body: 'You get a full 29-dimension profile per candidate, including HPIF layers, archetype, and role fit scores.', color: 'bg-teal-50 border-teal/10' },
              { step: '03', title: 'Compare against role profile', body: 'Match candidate dimensions to the behavioral profile of your highest performers in that role.', color: 'bg-violet-50 border-violet-200/50' },
              { step: '04', title: 'Structure the interview', body: 'Use dimension gaps and strengths to build a targeted interview guide — asking about what matters, not what is comfortable.', color: 'bg-amber-50 border-amber-200/50' },
            ].map(({ step, title, body, color }) => (
              <div key={step} className={`relative rounded-2xl border p-6 ${color} hover:-translate-y-1 transition-transform duration-200 shadow-sm overflow-hidden`}>
                <span className="absolute -right-2 -top-2 text-[6rem] font-black text-black/5 leading-none select-none pointer-events-none" aria-hidden="true">{step}</span>
                <div className="relative">
                  <p className="text-3xl font-black text-indigo/20 mb-3">{step}</p>
                  <h3 className="font-semibold text-text mb-2">{title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Kairos different */}
      <section className="bg-slate-900 py-24">
        <div className="max-w-5xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-bold text-white">What makes Kairos different for enterprise use</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { title: '29 dimensions, not 4 types', body: "Most popular assessments assign candidates to one of 16 types or 4 letters. Kairos measures 29 continuous dimensions — providing actual data for every role requirement rather than a label that obscures more than it reveals.", accent: 'border-teal/30' },
              { title: 'Behavioral inference layer', body: "Response latency and revision patterns are scored on every assessment. Candidates cannot game a system that measures how they respond, not just what they say. This is particularly valuable for senior-level and leadership hires where impression management is highest.", accent: 'border-indigo/30' },
              { title: 'HEXACO includes integrity', body: "We measure Honesty-Humility — the dimension most predictive of counterproductive work behavior, theft, manipulation, and leadership derailment. Most tools skip it. We include it because organizations deserve a complete picture.", accent: 'border-violet-500/30' },
              { title: 'Built on open science', body: "The Big Five and HEXACO emerged from decades of open, peer-reviewed research across 56+ languages and cultures. Our framework is not proprietary pseudo-science. Every dimension we measure has published academic validation behind it.", accent: 'border-amber-500/30' },
              { title: 'Archetype compatibility matrices', body: "Team composition research shows that specific archetype pairings predict performance and conflict. Our compatibility matrix surfaces high-fit and friction-risk pairings before a hire is made.", accent: 'border-pink-500/30' },
              { title: 'Per-candidate pricing', body: "No platform fee. No seat minimums. You pay $9.99 per candidate assessment — nothing more. For a $15,000 cost-per-hire, spending $9.99 on behavioral data is not a budget item. It is a risk management decision.", accent: 'border-cyan-500/30' },
            ].map(({ title, body, accent }) => (
              <div key={title} className={`rounded-2xl bg-slate-800/60 border ${accent} p-6 space-y-2 hover:-translate-y-1 transition-transform duration-200`}>
                <div className="flex items-start gap-2">
                  <span className="text-teal font-bold mt-0.5">✓</span>
                  <h3 className="font-semibold text-white">{title}</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed pl-5">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research references */}
      <section className="bg-bg py-16">
        <div className="max-w-5xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl font-bold text-text">Research references</h2>
          <p className="text-slate-500 text-sm">All claims on this page are grounded in peer-reviewed research. Full citations below.</p>
          <div className="space-y-2.5">
            {RESEARCH.map(ref => (
              <div key={ref.doi} className="flex gap-3 text-sm text-slate-600 border-b border-slate-100 pb-2.5">
                <span className="text-indigo shrink-0">→</span>
                <p>
                  {ref.authors} ({ref.year}).{' '}
                  <a href={ref.doi} target="_blank" rel="noopener noreferrer" className="text-indigo hover:underline">
                    {ref.title} ↗
                  </a>
                  {'. '}
                  <em>{ref.journal}</em>.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo via-indigo-800 to-indigo-950 py-24 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#6366f130,transparent_65%)]" />
        <div className="relative max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            Ready to make better hiring decisions?
          </h2>
          <p className="text-indigo-200 text-lg max-w-xl mx-auto">
            Corporate and Recruiter plans are in development. Join the waitlist for early access and grandfather pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <a
              href="mailto:andrey.alchin@gmail.com?subject=Enterprise inquiry"
              className="inline-block bg-white text-indigo font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-50 hover:scale-105 transition-all"
            >
              Contact Sales
            </a>
            <Link
              href="/pricing"
              className="inline-block border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              View All Plans
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
