import { useEffect } from "react";

const FAQ_ITEMS = [
  {
    question: "What does ProductHelp AI do?",
    answer:
      "ProductHelp AI analyzes user search behavior to identify missing or underperforming documentation and suggests what to improve.",
  },
  {
    question: "How does it collect data?",
    answer:
      "It collects search queries from your documentation site using a lightweight tracking script.",
  },
  {
    question: "How do I integrate ProductHelp AI?",
    answer:
      "Add a script to your docs and call window.productHelp.track(query) when users search.",
  },
  {
    question: "Does it replace my search engine?",
    answer:
      "No. ProductHelp AI works alongside your existing search and provides insights.",
  },
  {
    question: "Why am I seeing sample data?",
    answer:
      "Sample data is shown by default. Real data will appear once integration is set up.",
  },
  {
    question: "What insights does it provide?",
    answer: null,
    list: [
      "Missing content (no results searches)",
      "Low engagement searches",
      "Top search trends",
      "Recommended actions",
    ],
  },
  {
    question: "Who is this for?",
    answer:
      "Product teams, documentation teams, and support teams who want to improve user experience and reduce support tickets.",
  },
];

export default function HelpModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;

    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-modal-title"
      >
        <div className="modal-header">
          <h2 id="help-modal-title" className="modal-title">
            ProductHelp AI – Help &amp; FAQs
          </h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {FAQ_ITEMS.map((item) => (
            <article key={item.question} className="faq-item">
              <h3 className="faq-question">{item.question}</h3>
              {item.answer && <p className="faq-answer">{item.answer}</p>}
              {item.list && (
                <ul className="faq-list">
                  {item.list.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
