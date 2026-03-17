export default function SciencePage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-text">The Science of Kairos</h1>
          <p className="text-slate-500 text-lg">Built on decades of validated psychological research.</p>
        </div>
        <div className="space-y-8">
          {[
            { title: 'Big Five Personality Model', body: 'The most replicated and validated personality framework in academic psychology. Openness, Conscientiousness, Extraversion, Agreeableness, and Emotional Stability predict life outcomes across cultures.' },
            { title: 'HEXACO Model', body: 'Adds Honesty-Humility to capture ethical orientation and integrity, which predicts counterproductive work behavior and leadership effectiveness beyond the Big Five.' },
            { title: 'Self-Determination Theory', body: "Ryan & Deci's framework for intrinsic vs extrinsic motivation forms the basis of our Motivational Architecture layer, including autonomy need and purpose orientation." },
            { title: 'Adaptive Item Response Theory', body: 'Our simplified IRT engine identifies ambiguous dimensions (35–65 range) after calibration and targets additional questions, maximizing measurement precision.' },
            { title: 'Behavioral Inference', body: 'Response time and revision rate provide implicit behavioral signals that complement self-reported answers, detecting socially desirable responding.' },
            { title: 'HPIF Framework', body: 'The Human Potential Intelligence Framework integrates all 29 dimensions into 6 structural layers: Cognitive OS, Motivational Architecture, Behavioral Expression, Growth Vector, Career Potential Matrix, and Team Compatibility.' },
          ].map(({ title, body }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-slate-100 space-y-2">
              <h2 className="text-xl font-semibold text-indigo">{title}</h2>
              <p className="text-slate-600">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
