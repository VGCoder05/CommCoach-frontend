import React from 'react';

function DetailedReport({ latestReport, ScoreBox }) {
    const [openSections, setOpenSections] = React.useState(
        () => new Set(["vocabulary"])
    );

  const toggleSection = (key) =>
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const vocab    = latestReport.diagnosisData?.vocabulary;
  const flow     = latestReport.diagnosisData?.flow;
  const struct   = latestReport.diagnosisData?.structure;
  const final    = latestReport.diagnosisData?.finalAnswer;
  const weakness = latestReport.diagnosisData?.biggestWeakness;

  return (
    <div className="practice-page__result fade-in">

      <h4 className="practice-page__result-heading">
        Attempt #{latestReport.attemptNumber}
      </h4>

      <div className="practice-page__scores">
        <ScoreBox label="Overall"    value={latestReport.scores?.overall}    highlight />
        <ScoreBox label="Vocabulary" value={latestReport.scores?.vocabulary} />
        <ScoreBox label="Flow"       value={latestReport.scores?.flow} />
        <ScoreBox label="Structure"  value={latestReport.scores?.structure} />
      </div>

      {weakness && (
        <div className="practice-page__weakness-banner">
          <span className="practice-page__weakness-icon" aria-hidden="true">⚠️</span>
          <p className="practice-page__weakness-text">{weakness}</p>
        </div>
      )}

      <div className="practice-page__accordion">

        {/* VOCABULARY */}
        {vocab && (
          <div className="practice-page__accordion-item">
            <button
              className={`practice-page__accordion-trigger ${openSections.has("vocabulary") ? "practice-page__accordion-trigger--open" : ""}`}
              onClick={() => toggleSection("vocabulary")}
              aria-expanded={openSections.has("vocabulary")}
            >
              <span className="practice-page__accordion-label">
                <span className="practice-page__accordion-icon">📝</span>
                Vocabulary
              </span>
              <span className="practice-page__accordion-score-badge">{vocab.score}/10</span>
              <span className="practice-page__accordion-chevron" aria-hidden="true">▾</span>
            </button>

            {openSections.has("vocabulary") && (
              <div className="practice-page__accordion-body">
                {vocab.weakWords?.length > 0 ? (
                  <div className="practice-page__weak-words">
                    {vocab.weakWords.map((item, idx) => (
                      <div key={idx} className="practice-page__weak-word-card">
                        <div className="practice-page__weak-word-diff">
                          <span className="practice-page__diff-tag practice-page__diff-tag--before">
                            {item.original}
                          </span>
                          <span className="practice-page__diff-arrow" aria-hidden="true">→</span>
                          <span className="practice-page__diff-tag practice-page__diff-tag--after">
                            {item.better}
                          </span>
                        </div>
                        <p className="practice-page__weak-word-reason">{item.reason}</p>
                        <div className="practice-page__sentence-compare">
                          <div className="practice-page__sentence practice-page__sentence--original">
                            <span className="practice-page__sentence-label">Before</span>
                            <p>{item.originalSentence}</p>
                          </div>
                          <div className="practice-page__sentence practice-page__sentence--improved">
                            <span className="practice-page__sentence-label">After</span>
                            <p>{item.improvedSentence}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="practice-page__accordion-empty">No vocabulary issues found.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* FLOW */}
        {flow && (
          <div className="practice-page__accordion-item">
            <button
              className={`practice-page__accordion-trigger ${openSections.has("flow") ? "practice-page__accordion-trigger--open" : ""}`}
              onClick={() => toggleSection("flow")}
              aria-expanded={openSections.has("flow")}
            >
              <span className="practice-page__accordion-label">
                <span className="practice-page__accordion-icon">🔗</span>
                Flow
              </span>
              <span className="practice-page__accordion-score-badge">{flow.score}/10</span>
              <span className="practice-page__accordion-chevron" aria-hidden="true">▾</span>
            </button>

            {openSections.has("flow") && (
              <div className="practice-page__accordion-body">
                {flow.gaps?.length > 0 && (
                  <div className="practice-page__flow-group">
                    <h6 className="practice-page__flow-group-title">Gaps Identified</h6>
                    <ul className="practice-page__gap-list">
                      {flow.gaps.map((gap, idx) => (
                        <li key={idx} className="practice-page__gap-item">{gap}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {flow.transitions?.length > 0 && (
                  <div className="practice-page__flow-group">
                    <h6 className="practice-page__flow-group-title">Suggested Transitions</h6>
                    <div className="practice-page__transitions">
                      {flow.transitions.map((t, idx) => (
                        <div key={idx} className="practice-page__transition-card">
                          <span className="practice-page__transition-suggestion">"{t.suggestion}"</span>
                          <p className="practice-page__transition-where">{t.missing}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STRUCTURE */}
        {struct && (
          <div className="practice-page__accordion-item">
            <button
              className={`practice-page__accordion-trigger ${openSections.has("structure") ? "practice-page__accordion-trigger--open" : ""}`}
              onClick={() => toggleSection("structure")}
              aria-expanded={openSections.has("structure")}
            >
              <span className="practice-page__accordion-label">
                <span className="practice-page__accordion-icon">🏗️</span>
                Structure
              </span>
              <span className="practice-page__accordion-score-badge">{struct.score}/10</span>
              <span className="practice-page__accordion-chevron" aria-hidden="true">▾</span>
            </button>

            {openSections.has("structure") && (
              <div className="practice-page__accordion-body">
                <div className="practice-page__struct-checks">
                  {["define", "explain", "contrast"].map((key) => {
                    const item = struct[key];
                    if (!item) return null;
                    return (
                      <div
                        key={key}
                        className={`practice-page__struct-check ${item.present ? "practice-page__struct-check--pass" : "practice-page__struct-check--fail"}`}
                      >
                        <span className="practice-page__struct-check-icon" aria-hidden="true">
                          {item.present ? "✓" : "✗"}
                        </span>
                        <div>
                          <span className="practice-page__struct-check-label">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </span>
                          <p className="practice-page__struct-check-feedback">{item.feedback}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* IMPROVED ANSWER */}
        {final && (
          <div className="practice-page__accordion-item">
            <button
              className={`practice-page__accordion-trigger ${openSections.has("final") ? "practice-page__accordion-trigger--open" : ""}`}
              onClick={() => toggleSection("final")}
              aria-expanded={openSections.has("final")}
            >
              <span className="practice-page__accordion-label">
                <span className="practice-page__accordion-icon">✨</span>
                Improved Answer
              </span>
              <span className="practice-page__accordion-chevron" aria-hidden="true">▾</span>
            </button>

            {openSections.has("final") && (
              <div className="practice-page__accordion-body">
                <div className="practice-page__final-answer">
                  {final.split("\n\n").map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default DetailedReport;