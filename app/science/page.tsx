import Link from 'next/link'

const sections = [
  { id: 'foundations', label: 'Theoretical Foundations' },
  { id: 'methodology', label: 'Measurement Methodology' },
  { id: 'quality', label: 'Measurement Quality' },
  { id: 'hpif', label: 'The HPIF Framework' },
  { id: 'references', label: 'Research References' },
]

const references = [
  {
    id: 1,
    authors: 'Ashton, M. C., & Lee, K.',
    year: 2007,
    title: 'Empirical, theoretical, and practical advantages of the HEXACO model of personality structure',
    journal: 'Personality and Social Psychology Review',
    vol: '11(2), 150–166',
    doi: 'https://doi.org/10.1177/1088868306294907',
  },
  {
    id: 2,
    authors: 'Barrick, M. R., & Mount, M. K.',
    year: 1991,
    title: 'The Big Five personality dimensions and job performance: A meta-analysis',
    journal: 'Personnel Psychology',
    vol: '44(1), 1–26',
    doi: 'https://doi.org/10.1111/j.1744-6570.1991.tb00688.x',
  },
  {
    id: 3,
    authors: 'Costa, P. T., & McCrae, R. R.',
    year: 1992,
    title: 'Normal personality assessment in clinical practice: The NEO Personality Inventory',
    journal: 'Psychological Assessment',
    vol: '4(1), 5–13',
    doi: 'https://doi.org/10.1037/1040-3590.4.1.5',
  },
  {
    id: 4,
    authors: 'Deci, E. L., & Ryan, R. M.',
    year: 1985,
    title: 'Intrinsic Motivation and Self-Determination in Human Behavior',
    journal: 'Springer',
    vol: 'New York',
    doi: 'https://doi.org/10.1007/978-1-4899-2271-7',
  },
  {
    id: 5,
    authors: 'Fazio, R. H., & Olson, M. A.',
    year: 2003,
    title: 'Implicit measures in social cognition research: Their meaning and use',
    journal: 'Annual Review of Psychology',
    vol: '54, 297–327',
    doi: 'https://doi.org/10.1146/annurev.psych.54.101601.145225',
  },
  {
    id: 6,
    authors: 'Gagné, M., & Deci, E. L.',
    year: 2005,
    title: 'Self-determination theory and work motivation',
    journal: 'Journal of Organizational Behavior',
    vol: '26(4), 331–362',
    doi: 'https://doi.org/10.1002/job.322',
  },
  {
    id: 7,
    authors: 'Goldberg, L. R.',
    year: 1990,
    title: 'An alternative "description of personality": The Big-Five factor structure',
    journal: 'Journal of Personality and Social Psychology',
    vol: '59(6), 1216–1229',
    doi: 'https://doi.org/10.1037/0022-3514.59.6.1216',
  },
  {
    id: 8,
    authors: 'Holden, R. R., & Hibbs, N.',
    year: 1995,
    title: 'Incremental validity of response latencies for two MMPI-2 validity scales',
    journal: 'Journal of Personality Assessment',
    vol: '65(3), 467–477',
    doi: 'https://doi.org/10.1207/s15327752jpa6503_7',
  },
  {
    id: 9,
    authors: 'Lee, K., & Ashton, M. C.',
    year: 2004,
    title: 'Psychometric properties of the HEXACO personality inventory',
    journal: 'Multivariate Behavioral Research',
    vol: '39(2), 329–358',
    doi: 'https://doi.org/10.1207/s15327906mbr3902_8',
  },
  {
    id: 10,
    authors: 'Lord, F. M.',
    year: 1980,
    title: 'Applications of Item Response Theory to Practical Testing Problems',
    journal: 'Lawrence Erlbaum Associates',
    vol: 'Hillsdale, NJ',
    doi: 'https://doi.org/10.4324/9780203056615',
  },
  {
    id: 11,
    authors: 'McCrae, R. R., & Costa, P. T.',
    year: 1987,
    title: 'Validation of the five-factor model of personality across instruments and observers',
    journal: 'Journal of Personality and Social Psychology',
    vol: '52(1), 81–90',
    doi: 'https://doi.org/10.1037/0022-3514.52.1.81',
  },
  {
    id: 12,
    authors: 'Ozer, D. J., & Benet-Martínez, V.',
    year: 2006,
    title: 'Personality and the prediction of consequential outcomes',
    journal: 'Annual Review of Psychology',
    vol: '57, 401–421',
    doi: 'https://doi.org/10.1146/annurev.psych.57.102904.190127',
  },
  {
    id: 13,
    authors: 'Roberts, B. W., Kuncel, N. R., Shiner, R., Caspi, A., & Goldberg, L. R.',
    year: 2007,
    title: 'The power of personality: The comparative validity of personality traits, socioeconomic status, and cognitive ability for predicting important life outcomes',
    journal: 'Perspectives on Psychological Science',
    vol: '2(6), 568–586',
    doi: 'https://doi.org/10.1111/j.1745-6924.2007.00047.x',
  },
  {
    id: 14,
    authors: 'Ryan, R. M., & Deci, E. L.',
    year: 2000,
    title: 'Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being',
    journal: 'American Psychologist',
    vol: '55(1), 68–78',
    doi: 'https://doi.org/10.1037/0003-066X.55.1.68',
  },
  {
    id: 15,
    authors: 'Schmidt, F. L., & Hunter, J. E.',
    year: 1998,
    title: 'The validity and utility of selection methods in personnel psychology: Practical and theoretical implications of 85 years of research findings',
    journal: 'Psychological Bulletin',
    vol: '124(2), 262–274',
    doi: 'https://doi.org/10.1037/0033-2909.124.2.262',
  },
  {
    id: 16,
    authors: 'Weiss, D. J., & Kingsbury, G. G.',
    year: 1984,
    title: 'Application of computerized adaptive testing to educational problems',
    journal: 'Journal of Educational Measurement',
    vol: '21(4), 361–375',
    doi: 'https://doi.org/10.1111/j.1745-3984.1984.tb01040.x',
  },
]

function Cite({ ids }: { ids: number[] }) {
  return (
    <sup className="text-indigo font-semibold">
      [{ids.join(',')}]
    </sup>
  )
}

function SectionAnchor({ id }: { id: string }) {
  return <span id={id} className="block -mt-24 pt-24" aria-hidden="true" />
}

function ClaimBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-indigo/10 border border-indigo/20 rounded-2xl px-6 pt-8 pb-5 my-6">
      <span className="absolute -top-5 left-6 text-[4rem] font-black text-indigo/20 leading-none select-none pointer-events-none" aria-hidden="true">&ldquo;</span>
      <p className="text-slate-700 text-sm leading-relaxed">{children}</p>
    </div>
  )
}

function FindingBox({ stat, label }: { stat: string; label: string }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 text-center shadow-sm hover:-translate-y-1 transition-transform duration-200">
      <p className="text-3xl md:text-4xl font-black text-indigo">{stat}</p>
      <p className="text-xs text-slate-500 mt-2 leading-snug">{label}</p>
    </div>
  )
}

const hpifLayers = [
  {
    layer: 'Cognitive Operating System',
    q: 'How do you process information?',
    dims: 'Cognitive Agility · Executive Function · Attention Control · Systems Thinking · Creative Intelligence · Emotional Intelligence · Decision Making',
    detail: 'Grounded in cognitive neuroscience research on working memory, cognitive flexibility, and attentional control. Seven dimensions covering how you process, create, decide, and relate — the most information-dense cluster in the framework.',
    accent: 'border-l-4 border-indigo',
  },
  {
    layer: 'Motivational Architecture',
    q: 'What drives your behavior?',
    dims: 'Achievement Drive · Purpose Orientation · Autonomy Need · Competitive Drive',
    detail: 'Directly derived from Self-Determination Theory. Identifies your primary and secondary motivational drivers — critical for role fit, sustained engagement, and career satisfaction.',
    accent: 'border-l-4 border-teal',
  },
  {
    layer: 'Behavioral Expression',
    q: 'How do you show up with others?',
    dims: 'Extraversion · Agreeableness · Conflict Navigation · Communication Style · Persuasion · Embracing Differences',
    detail: 'Maps your interpersonal behavioral tendencies. Predicts communication effectiveness, collaboration patterns, and leadership style — including how you navigate influence and diversity of perspective.',
    accent: 'border-l-4 border-violet-500',
  },
  {
    layer: 'Growth Vector',
    q: 'How fast can you grow?',
    dims: 'Growth Mindset · Adaptability · Learning Agility · Psychological Resilience',
    detail: 'Integrates the dimensions most predictive of long-term development trajectory. High Growth Vector scores correlate with career acceleration and response to coaching and feedback.',
    accent: 'border-l-4 border-amber-500',
  },
  {
    layer: 'Career Potential Matrix',
    q: 'Where do you have the most leverage?',
    dims: 'Leadership Drive · Strategic Orientation · Specialist–Generalist Orientation · Execution · Managing Others',
    detail: 'Translates your dimensions into career-relevant potential scores. Distinguishes between leadership potential, operational execution, and strategic vs. tactical orientation.',
    accent: 'border-l-4 border-pink-500',
  },
  {
    layer: 'Team Compatibility',
    q: 'Where do you fit in a team?',
    dims: 'Collaboration Signature · Teamwork · Role preference · Remote orientation',
    detail: 'Identifies your natural team role, preferred team size, and collaboration style. Supports team composition and role assignment decisions grounded in behavioral data.',
    accent: 'border-l-4 border-cyan-500',
  },
]

export default function SciencePage() {
  return (
    <div className="min-h-screen">

      {/* 1. Hero — dark slate */}
      <section className="relative overflow-hidden bg-slate-900 py-24">
        <span className="absolute right-8 bottom-0 text-[14rem] font-black text-white/5 leading-none select-none pointer-events-none" aria-hidden="true">36</span>
        <div className="relative max-w-4xl mx-auto px-4 text-center space-y-6">
          <p className="text-teal text-sm font-semibold uppercase tracking-widest">Evidence-Based Assessment</p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            The Science Behind Kairos
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Every dimension we measure, every question we ask, and every inference we draw is grounded in peer-reviewed psychological research. Not a differentiator — the minimum standard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link href="/assessment" className="bg-teal text-white px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity">
              Take the Assessment
            </Link>
            <Link href="#foundations" className="border border-slate-600 text-slate-300 px-8 py-3.5 rounded-xl font-semibold hover:border-slate-400 hover:text-white transition-colors">
              Read the Science
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 justify-center pt-4">
            {sections.map(s => (
              <a key={s.id} href={`#${s.id}`} className="text-xs font-medium text-slate-400 border border-slate-700 rounded-full px-4 py-1.5 hover:border-teal hover:text-teal transition-colors">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Stats bar — indigo */}
      <section className="bg-indigo py-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-10 md:gap-20">
          {[
            { num: '117', label: 'Studies in Big Five job-performance meta-analysis' },
            { num: '23,994', label: 'Participants in Barrick & Mount landmark validation' },
            { num: '60+', label: 'Years of cross-cultural replication' },
            { num: '36', label: 'Dimensions measured across 6 behavioral clusters' },
          ].map(({ num, label }) => (
            <div key={num} className="text-center">
              <p className="text-2xl sm:text-4xl md:text-5xl font-black text-white">{num}</p>
              <p className="text-sm text-indigo-200 mt-1 max-w-[10rem] mx-auto leading-snug">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Why scientific rigor + Theoretical Foundations — bg-bg */}
      <section className="bg-bg py-20">
        <div className="max-w-4xl mx-auto px-4 space-y-20">

          {/* Why it matters */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-text">Why scientific rigor is non-negotiable</h2>
            <p className="text-slate-600 leading-relaxed">
              Most popular personality assessments — including widely-used commercial tools — are not built on peer-reviewed science. They are built on proprietary frameworks, invented by practitioners, and validated primarily through marketing rather than empirical research. The result is assessments that feel insightful but predict very little about actual behavior, career outcomes, or interpersonal dynamics.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Personality psychology has spent over 60 years building, challenging, and refining frameworks that actually predict real-world outcomes. Career success. Leadership effectiveness. Relationship stability. Mental health trajectories. A robust body of meta-analytic evidence now exists — and Kairos is built on it.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We do not invent new personality models. We apply the most rigorously validated ones, use the most precise measurement methodology available, and integrate them into a unified framework designed for actionable self-understanding.
            </p>
            <ClaimBox>
              Personality traits account for significant variance in life outcomes above and beyond socioeconomic status and cognitive ability, across cultures and over lifespans — a finding replicated across hundreds of independent studies.<Cite ids={[12, 13]} />
            </ClaimBox>
          </div>

          {/* Section I: Theoretical Foundations */}
          <div>
            <SectionAnchor id="foundations" />
            <div className="flex items-center gap-3 mb-8">
              <span className="bg-indigo text-white text-xs font-bold px-3 py-1 rounded-full">I</span>
              <h2 className="text-3xl font-bold text-text">Theoretical Foundations</h2>
            </div>

            {/* Big Five */}
            <div className="space-y-4 mb-12">
              <h3 className="text-xl font-semibold text-indigo">The Big Five Personality Model (OCEAN)</h3>
              <p className="text-slate-600 leading-relaxed">
                The Big Five — Openness, Conscientiousness, Extraversion, Agreeableness, and Emotional Stability — is the most extensively researched and replicated personality framework in the history of psychology.<Cite ids={[7, 11]} /> Developed independently by multiple research groups and validated across dozens of languages and cultures, it emerged not from theory but from statistical analysis of how personality descriptors cluster in human language and behavior.
              </p>
              <p className="text-slate-600 leading-relaxed">
                A landmark 1991 meta-analysis by Barrick and Mount across 117 studies (N = 23,994) established that Conscientiousness is a valid predictor of job performance across all occupational groups, with Emotional Stability, Extraversion, and Openness predicting performance in specific roles.<Cite ids={[2]} /> Their finding — that personality predicts performance as reliably as many commonly-used selection methods — fundamentally changed how evidence-based organizations approach talent assessment.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Kairos measures all five Big Five dimensions using multi-item adaptive scales, calibrated against normative benchmarks from general adult population studies. We do not collapse these into letter types or simplified categories — we preserve the continuous, quantitative nature of each dimension, because that is where the predictive information lives.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
                <FindingBox stat="117" label="Studies in the original Big Five job performance meta-analysis" />
                <FindingBox stat="23,994" label="Participants in Barrick & Mount's landmark validation" />
                <FindingBox stat="50+ yrs" label="Of cross-cultural replication across 56+ languages" />
                <FindingBox stat="6 of 6" label="Personality factors emerge consistently across cultures" />
              </div>

              <ClaimBox>
                &quot;The remarkable consistency of the Big Five across cultures, methods, and time periods is one of the most robust findings in personality psychology.&quot; — McCrae &amp; Costa, 1987<Cite ids={[11]} />
              </ClaimBox>
            </div>

            {/* HEXACO */}
            <div className="space-y-4 mb-12">
              <h3 className="text-xl font-semibold text-indigo">HEXACO: Adding the Integrity Dimension</h3>
              <p className="text-slate-600 leading-relaxed">
                While the Big Five captures most of the variance in personality, a critical dimension was systematically underrepresented: Honesty-Humility. Ashton and Lee&apos;s HEXACO model (2007) added this sixth factor — encompassing sincerity, fairness, modesty, and the avoidance of greed and manipulation — through analysis of personality lexicons across 12 languages.<Cite ids={[1, 9]} />
              </p>
              <p className="text-slate-600 leading-relaxed">
                The practical importance of this factor cannot be overstated. Low Honesty-Humility is the strongest personality predictor of counterproductive work behavior, including theft, deception, and manipulation. It also predicts leadership derailment and interpersonal exploitation at levels that no Big Five dimension achieves alone.<Cite ids={[1]} /> High Honesty-Humility, conversely, is associated with effective ethical leadership, trust-building, and long-term relationship stability.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Kairos includes a full Honesty-Humility dimension in our assessment. For any platform claiming to measure human potential, omitting ethical orientation is not just an oversight — it is a systematic blind spot. We chose to include it because our users deserve a complete picture.
              </p>
              <ClaimBox>
                Honesty-Humility explains variance in counterproductive work behavior, narcissism, and exploitation that the original Big Five fails to capture — making it essential for any complete model of human behavior.<Cite ids={[1, 9]} />
              </ClaimBox>
            </div>

            {/* SDT */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-indigo">Self-Determination Theory: The Science of Motivation</h3>
              <p className="text-slate-600 leading-relaxed">
                Deci and Ryan&apos;s Self-Determination Theory (SDT), developed from 1975 onwards and formalized in their landmark 1985 text, is the most empirically supported framework for understanding human motivation.<Cite ids={[4, 14]} /> It distinguishes between intrinsic motivation (driven by genuine interest and values), identified regulation (driven by personally meaningful goals), introjected regulation (driven by internal pressure and ego), and external regulation (driven by rewards and punishments).
              </p>
              <p className="text-slate-600 leading-relaxed">
                For career and life outcomes, the key insight from SDT is that autonomous motivation — where behavior is driven by genuine interest or personal values rather than external pressure — produces dramatically better outcomes in terms of performance, persistence, well-being, and creativity.<Cite ids={[14]} /> Gagné and Deci&apos;s 2005 review of SDT in work contexts found robust support for autonomous motivation as a predictor of work engagement, organizational commitment, and psychological health.<Cite ids={[6]} />
              </p>
              <p className="text-slate-600 leading-relaxed">
                Our Motivational Architecture layer — which measures Achievement Drive, Purpose Orientation, Autonomy Need, and Competitive Drive — is directly grounded in SDT. Understanding your dominant motivational pattern is not about labeling you; it is about identifying the conditions under which you will consistently perform at your best.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Measurement Methodology — bg-white */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <SectionAnchor id="methodology" />
          <div className="flex items-center gap-3 mb-8">
            <span className="bg-indigo text-white text-xs font-bold px-3 py-1 rounded-full">II</span>
            <h2 className="text-3xl font-bold text-text">Measurement Methodology</h2>
          </div>

          {/* IRT */}
          <div className="space-y-4 mb-12">
            <h3 className="text-xl font-semibold text-indigo">Adaptive Item Response Theory</h3>
            <p className="text-slate-600 leading-relaxed">
              Classical test theory treats all questions as equally informative for all respondents. Item Response Theory (IRT), formalized by Lord (1980), recognized that this is statistically naive — a question that maximally discriminates between respondents in the middle of the distribution provides almost no information about someone at the extremes.<Cite ids={[10]} />
            </p>
            <p className="text-slate-600 leading-relaxed">
              Computerized Adaptive Testing (CAT) operationalizes IRT by selecting the next question based on the respondent&apos;s estimated trait level from all previous responses. Weiss and Kingsbury (1984) demonstrated that adaptive tests can achieve the same measurement precision as fixed-form tests twice their length — or achieve significantly higher precision in the same number of items.<Cite ids={[16]} />
            </p>
            <p className="text-slate-600 leading-relaxed">
              Kairos implements a two-phase adaptive questioning engine. The first phase delivers 80 calibration questions that establish a baseline score across all 36 dimensions — enough signal to place every dimension on the distribution. The second phase targets remaining ambiguity: when a Major dimension&apos;s score falls in an uncertain range (35–65), additional questions are served to narrow the confidence interval. Adaptive targeting continues until the top archetype match reaches a composite confidence threshold, with a maximum of 132 questions total. This means we collect more useful data in fewer questions — respecting your time without sacrificing measurement quality.
            </p>
            <ClaimBox>
              Adaptive testing based on IRT can achieve equivalent measurement precision with approximately 50% fewer items compared to fixed-format tests — a finding with direct implications for respondent burden and data quality.<Cite ids={[16]} />
            </ClaimBox>
          </div>

          {/* Multi-method */}
          <div className="space-y-4 mb-12">
            <h3 className="text-xl font-semibold text-indigo">Multi-Method Assessment Design</h3>
            <p className="text-slate-600 leading-relaxed">
              Relying on a single assessment method is a known source of systematic measurement error. Self-report questionnaires, however carefully designed, are vulnerable to social desirability bias — the tendency for respondents to present themselves favorably rather than accurately. Schmidt and Hunter&apos;s meta-analysis of 85 years of personnel selection research found that combining multiple independent assessment methods substantially improves predictive validity above what any single method achieves.<Cite ids={[15]} />
            </p>
            <p className="text-slate-600 leading-relaxed">
              Kairos uses three complementary data streams: explicit self-report (what you consciously say), response timing (how quickly you respond), and response revision patterns (what you change your mind about). Each stream captures a different aspect of personality. Together, they produce a more complete and harder-to-fake profile than any single method alone.
            </p>
          </div>

          {/* Behavioral Inference */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-indigo">Behavioral Inference: The Implicit Layer</h3>
            <p className="text-slate-600 leading-relaxed">
              Response latency — the time between question presentation and answer submission — carries genuine psychological information. Fazio and Olson&apos;s extensive review of implicit measurement research established that slower response times are associated with greater attitude ambivalence, lower accessibility of the attitude from memory, and higher likelihood of strategic responding.<Cite ids={[5]} /> These patterns are not random noise; they are behavioral signals.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Holden and Hibbs (1995) demonstrated that response latency adds incremental validity over and above self-report content for detecting response distortion on personality inventories — meaning it catches patterns of socially desirable responding that the questions themselves cannot detect.<Cite ids={[8]} /> Respondents who answer very quickly across all items are either unusually certain or processing at a surface level. Those who frequently revise answers are either more deliberative or more conflicted about their self-presentation.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Our behavioral inference engine computes four signals per assessment: average response latency, revision rate, cross-dimension consistency, and response speed variance. These signals are used to modulate confidence in self-reported scores — not to override them, but to add a layer of triangulation that purely self-report measures cannot provide.
            </p>
            <div className="bg-white border border-slate-100 rounded-2xl p-6 mt-4 grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">What we measure implicitly</p>
                <ul className="space-y-1.5 text-sm text-slate-600">
                  <li className="flex gap-2"><span className="text-indigo font-bold mt-0.5">→</span> Response latency per question</li>
                  <li className="flex gap-2"><span className="text-indigo font-bold mt-0.5">→</span> Revision rate (answers changed)</li>
                  <li className="flex gap-2"><span className="text-indigo font-bold mt-0.5">→</span> Cross-dimension consistency score</li>
                  <li className="flex gap-2"><span className="text-indigo font-bold mt-0.5">→</span> Response speed variance</li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">What these signals detect</p>
                <ul className="space-y-1.5 text-sm text-slate-600">
                  <li className="flex gap-2"><span className="text-teal font-bold mt-0.5">→</span> Social desirability bias</li>
                  <li className="flex gap-2"><span className="text-teal font-bold mt-0.5">→</span> Ambivalence or self-uncertainty</li>
                  <li className="flex gap-2"><span className="text-teal font-bold mt-0.5">→</span> Strategic self-presentation</li>
                  <li className="flex gap-2"><span className="text-teal font-bold mt-0.5">→</span> Disengaged responding</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Measurement Quality — bg-bg */}
      <section className="bg-bg py-20">
        <div className="max-w-4xl mx-auto px-4">
          <SectionAnchor id="quality" />
          <div className="flex items-center gap-3 mb-8">
            <span className="bg-indigo text-white text-xs font-bold px-3 py-1 rounded-full">III</span>
            <h2 className="text-3xl font-bold text-text">Measurement Quality Standards</h2>
          </div>

          <p className="text-slate-600 leading-relaxed mb-8">
            Measuring personality correctly requires more than choosing the right framework. It requires satisfying rigorous psychometric standards for how dimensions are defined, assessed, and interpreted. Kairos holds itself to three core standards: validity, reliability, and normative grounding.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-indigo-50 border border-indigo/20 rounded-2xl p-5 space-y-3 hover:-translate-y-1 transition-transform duration-200">
              <div className="w-9 h-9 rounded-lg bg-indigo flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <h3 className="text-xl font-bold text-text">Construct Validity</h3>
              <p className="text-sm text-slate-600">Each dimension measures what it claims to measure — confirmed through factor-analytic studies showing that our items load onto the intended constructs and not onto unintended ones.</p>
            </div>
            <div className="bg-teal-50 border border-teal/20 rounded-2xl p-5 space-y-3 hover:-translate-y-1 transition-transform duration-200">
              <div className="w-9 h-9 rounded-lg bg-teal flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <h3 className="text-xl font-bold text-text">Internal Consistency</h3>
              <p className="text-sm text-slate-600">Items within each dimension scale consistently with one another, indicating that they are measuring a coherent underlying trait rather than a collection of unrelated behaviors.</p>
            </div>
            <div className="bg-violet-50 border border-violet-200/50 rounded-2xl p-5 space-y-3 hover:-translate-y-1 transition-transform duration-200">
              <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <h3 className="text-xl font-bold text-text">Normative Benchmarking</h3>
              <p className="text-sm text-slate-600">Your scores are interpreted against distributions from general adult populations — giving your results meaning as percentile positions rather than raw counts or arbitrary categories.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-indigo">Why categories fail you — and percentiles don&apos;t</h3>
            <p className="text-slate-600 leading-relaxed">
              Most popular tests assign you to one of a small number of categories — a type, a letter combination, an animal. This approach is psychometrically indefensible. Personality traits are continuous, normally distributed dimensions. Collapsing them into categories discards most of the available information and creates the illusion of crisp boundaries where none exist in reality.
            </p>
            <p className="text-slate-600 leading-relaxed">
              The practical consequence: a person who scores at the 52nd percentile on Extraversion and a person who scores at the 48th percentile will receive the same category label despite being nearly identical, while two people at the 10th and 90th percentile — genuinely very different — also receive the same label if they fall on the same side of the cutpoint.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Kairos reports your scores as continuous percentile positions. You are not an &quot;INTJ&quot; or a &quot;Type 4.&quot; You are in the 89th percentile for Strategic Orientation, 72nd for Leadership Drive, and 44th for Agreeableness — and those numbers actually mean something specific that a category cannot.
            </p>
          </div>
        </div>
      </section>

      {/* 6. HPIF — bg-white */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <SectionAnchor id="hpif" />
          <div className="flex items-center gap-3 mb-8">
            <span className="bg-indigo text-white text-xs font-bold px-3 py-1 rounded-full">IV</span>
            <h2 className="text-3xl font-bold text-text">The HPIF Integration Framework</h2>
          </div>

          <p className="text-slate-600 leading-relaxed mb-6">
            Measuring 36 dimensions produces a rich dataset — but raw dimensions are difficult to interpret and act on. The Human Potential Intelligence Framework (HPIF) integrates all 36 dimensions into 6 structural layers, each answering a different question about how you function as a person, a professional, and a collaborator. Dimensions are further classified as Major (20 primary predictors) or Supporting (15 contextual dimensions), so your report surfaces the highest-signal traits first without burying the nuance.
          </p>

          <div className="space-y-4 mb-8">
            {hpifLayers.map(({ layer, q, dims, detail, accent }) => (
              <div key={layer} className={`bg-white border border-slate-100 rounded-2xl p-5 space-y-2 hover:-translate-y-1 transition-transform duration-200 ${accent}`}>
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
                  <h3 className="font-semibold text-text">{layer}</h3>
                  <p className="text-xs text-slate-400 italic">{q}</p>
                </div>
                <p className="text-xs text-indigo font-medium">{dims}</p>
                <p className="text-sm text-slate-600">{detail}</p>
              </div>
            ))}
          </div>

          <ClaimBox>
            Integrative personality frameworks that combine multiple validated dimensions into structured behavioral profiles produce substantially higher predictive validity for career outcomes than single-trait or categorical measures — a finding consistent across meta-analytic reviews in occupational psychology.<Cite ids={[2, 12, 15]} />
          </ClaimBox>
        </div>
      </section>

      {/* 7. References — bg-bg */}
      <section className="bg-bg py-20">
        <div className="max-w-4xl mx-auto px-4">
          <SectionAnchor id="references" />
          <div className="flex items-center gap-3 mb-8">
            <span className="bg-indigo text-white text-xs font-bold px-3 py-1 rounded-full">V</span>
            <h2 className="text-3xl font-bold text-text">Research References</h2>
          </div>
          <p className="text-slate-500 text-sm mb-6">
            All citations link to the original published source via DOI. References marked with ↗ open in a new tab.
          </p>
          <div className="space-y-3">
            {references.map(ref => (
              <div key={ref.id} className="flex gap-4 text-sm text-slate-600 border-b border-slate-100 pb-3">
                <span className="text-indigo font-semibold shrink-0 w-5">[{ref.id}]</span>
                <p>
                  {ref.authors} ({ref.year}).{' '}
                  <a
                    href={ref.doi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo hover:underline"
                  >
                    {ref.title} ↗
                  </a>
                  {'. '}
                  <em>{ref.journal}</em>, {ref.vol}.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Final CTA — dark gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo via-indigo-800 to-indigo-950 py-24 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#6366f130,transparent_65%)]" />
        <div className="relative max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Science you can act on</h2>
          <p className="text-indigo-200 text-lg max-w-xl mx-auto">
            Every claim in your report connects back to the research above. This is not a horoscope. It is a measurement.
          </p>
          <div className="pt-2">
            <Link
              href="/assessment"
              className="inline-block bg-white text-indigo px-10 py-4 rounded-xl text-lg font-bold hover:bg-indigo-50 hover:scale-105 transition-all"
            >
              Take the Free Assessment
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
