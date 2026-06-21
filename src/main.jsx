import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { ConvexProvider, ConvexReactClient, useMutation } from "convex/react";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  CircleHelp,
  Compass,
  Copy,
  HeartHandshake,
  MessageCircle,
  Phone,
  Send,
  Share2,
  Sparkles,
  UserRound,
  WandSparkles
} from "lucide-react";
import { api } from "../convex/_generated/api";
import { trackSupabaseEvent } from "./supabaseClient";
import "./styles.css";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

const whatsappNumber = import.meta.env.VITE_HARSHA_WHATSAPP_NUMBER || "918374283166";
const publicSiteUrl = import.meta.env.VITE_PUBLIC_SITE_URL || window.location.href.split("#")[0];

const slides = [
  {
    id: "hello",
    icon: HeartHandshake,
    title: "If you know me, this is for you.",
    body: "This is Harsha. I am doing a small AI readiness check for people I personally care about.",
    cta: "Why I am doing this",
    paragraphs: [
      <>I have spent the last many months going deep into AI tools, workflows, automations, prompts, agents, websites, systems and all the strange new ways work is changing.</>,
      <>And honestly, one thought keeps coming back to me: <strong>the people around me should not have to figure all this out alone.</strong></>,
      <>This is <em>not a course</em>. Not a webinar. Not a pitch. Think of it as me putting my heart out and asking: <strong>where are you with AI right now, and how can I help you take the next sensible step?</strong></>
    ]
  },
  {
    id: "credibility",
    icon: Sparkles,
    title: "Why I feel responsible to say this.",
    body: "I am not speaking from AI hype. I am speaking from daily hands-on work.",
    cta: "Why AI matters now",
    paragraphs: [
      <>For context, I head <strong>Business Intelligence and AI at Beforest</strong>, and a lot of my work is around turning messy business problems into useful dashboards, AI workflows, automations, and decision systems.</>,
      <>I have seen how quickly the right AI workflow can change someone’s confidence. The real shift is not just speed. It is the moment your mind starts seeing ten new possibilities where earlier you saw only one slow manual path.</>,
      <>That is the feeling I want more people in my circle to experience.</>
    ]
  },
  {
    id: "why-now",
    icon: BrainCircuit,
    title: "AI is slowly becoming a basic life skill.",
    body: "Some people are already using it daily. Some tried ChatGPT once. Some still do not know why it matters.",
    cta: "Okay, where do I stand?",
    paragraphs: [
      <>A school kid, an employee, a founder, a homemaker, a singer, a consultant, a shop owner, a creator; everyone will slowly need to understand how to pair <strong>human intelligence</strong> with <strong>artificial intelligence</strong>.</>,
      <>This does not mean everyone must become technical. It simply means we should know what to ask, what to trust, what to avoid, and where AI can actually save time.</>,
      <>All stages are fine. I just do not want people of my circle to be left behind because nobody explained it simply and practically.</>
    ]
  },
  {
    id: "identity",
    icon: UserRound,
    title: "Before the questions, tell me who you are.",
    body: "I will personally sort these responses, so your name helps me connect the answer to the person.",
    paragraphs: [
      <>I am not collecting this like some random internet form. I want to know who is answering because the advice for a student, a working professional, a business owner, or someone running the home will be completely different.</>,
      <>Your response stays with me. I will use it only to understand your current AI stage and decide what kind of help makes sense.</>
    ],
    identity: true
  },
  {
    id: "what-happens",
    icon: Compass,
    title: "After you answer, I will sort things quietly.",
    body: "I will privately bucket people by their AI readiness and then decide what kind of help makes sense.",
    cta: "What about money?",
    paragraphs: [
      <>Some people may only need a simple beginner video. Some may need tool suggestions. Some may need prompts for their exact work. Some may be ready for workflows, automation, or even monetising a skill with AI.</>,
      <>I do not want to give everyone the same generic gyaan. <strong>First I want to understand where you are.</strong> Then I can share something that is actually useful for your stage.</>
    ]
  },
  {
    id: "pricing",
    icon: Sparkles,
    title: "Money is not the point right now.",
    body: "For this first version, I am trying to understand where everyone is. Pricing is not decided.",
    cta: "Start the readiness check",
    paragraphs: [
      <>My first intention is to help my own circle move forward. I want to create a <strong>regular free feed of videos, examples, tools, and AI workflows</strong> that actually move the needle.</>,
      <>Trust me, I do not want to share basic “how to use ChatGPT” type content that everyone is already making for general people. I want to share what is useful for <em>you</em>, your work, your business, your studies, your home, your creativity, or your next income idea.</>,
      <>Sometimes I may understand the exact problem from your answers before I even make the video. That is the whole point of this readiness check. I want the help to come from real problems inside my circle, not from random internet content calendars.</>,
      <>The result I want for you is simple: <strong>more confidence, better questions, and a flood of new thoughts</strong> about how AI can accelerate your life.</>,
      <>If someone needs deeper time from me later, I may keep it free, bare-minimum, or pay-what-feels-right. I have not decided that yet, and <strong>I do not want money to become the first conversation.</strong></>
    ]
  },
  {
    id: "survey",
    icon: CircleHelp,
    title: "Now answer honestly. This is not a test.",
    body: "The clearer your answers are, the better I can guide you.",
    paragraphs: [
      <>Even if your answer is <strong>“I have no idea where to start,”</strong> that is a perfectly valid answer.</>,
      <>The only thing I ask is: do not answer to impress me. Answer so I can actually help you.</>
    ],
    survey: true
  },
  {
    id: "ask",
    icon: MessageCircle,
    title: "Last step: ask me one question.",
    body: "Ask anything about using AI in your work, studies, business, personal life, or even monetising your skills with AI.",
    paragraphs: [
      <>This question will open in WhatsApp with your message already prepared. You can read it once and send it to me.</>,
      <>Ask naturally. It can be basic, specific, confused, ambitious, or even slightly messy.</>
    ],
    final: true
  },
  {
    id: "share",
    icon: Share2,
    title: "Know someone who should see this?",
    body: "You can share this with people in your circle too. The more honest responses I get, the better I can create useful help.",
    paragraphs: [
      <>If you know someone who is curious, stuck, or quietly worried that AI is moving too fast, send this to them.</>,
      <>Let this stay personal. Share it like you would forward a useful note from a friend.</>
    ],
    share: true
  }
];

const slideIndexById = Object.fromEntries(slides.map((slide, index) => [slide.id, index]));

const questions = [
  {
    id: "persona",
    label: "What best describes you right now?",
    type: "choice",
    options: ["Student", "Working professional", "Business owner / founder", "Freelancer / consultant", "Homemaker / family manager", "Creator / marketer / salesperson", "Other"]
  },
  {
    id: "comfort",
    label: "How comfortable are you with AI tools today?",
    type: "choice",
    options: ["I have never used them", "I tried once or twice", "I use ChatGPT sometimes", "I use AI regularly", "I am advanced and experimenting"]
  },
  {
    id: "goal",
    label: "What do you mainly want AI to help with?",
    type: "choice",
    options: ["Saving time", "Learning faster", "Writing/content", "Business growth", "Sales/marketing", "Office work", "Research", "Personal productivity", "Automation", "Not sure yet"]
  },
  {
    id: "stuck",
    label: "Where do you feel most stuck?",
    type: "choice",
    options: ["I do not know where to start", "I do not know which tools to use", "I do not know what to ask AI", "I get poor answers", "I do not trust AI outputs", "I do not have time", "I need use cases for my work/business"]
  },
  {
    id: "repeatedTask",
    label: "What is one repeated task you do often?",
    type: "text",
    placeholder: "Example: reports, follow-ups, research, invoices, lesson plans, content..."
  },
  {
    id: "headache",
    label: "If AI could remove one headache from your life or work, what would it be?",
    type: "textarea",
    placeholder: "Write naturally. No need to sound technical."
  },
  {
    id: "tools",
    label: "Which AI tools have you used?",
    type: "choice",
    options: ["Never", "Only ChatGPT", "2-3 tools", "Many tools", "I do not remember the names"]
  },
  {
    id: "frequency",
    label: "How often do you currently use AI?",
    type: "choice",
    options: ["Never", "Less than once a month", "A few times a month", "Weekly", "Daily"]
  },
  {
    id: "help",
    label: "What kind of help would be most useful?",
    type: "choice",
    options: ["Basic beginner guide", "Prompts for my exact work", "Tool recommendations", "One practical AI workflow", "Automation ideas", "Content/marketing help", "Personal suggestion from Harsha"]
  },
  {
    id: "consent",
    label: "Are you okay if I personally review your answers and privately bucket your AI readiness?",
    type: "choice",
    options: ["Yes", "No"]
  }
];

const bucketScores = {
  comfort: {
    "I have never used them": 0,
    "I tried once or twice": 1,
    "I use ChatGPT sometimes": 2,
    "I use AI regularly": 3,
    "I am advanced and experimenting": 4
  },
  frequency: {
    Never: 0,
    "Less than once a month": 1,
    "A few times a month": 2,
    Weekly: 3,
    Daily: 4
  },
  tools: {
    Never: 0,
    "Only ChatGPT": 1,
    "2-3 tools": 2,
    "Many tools": 4,
    "I do not remember the names": 1
  }
};

function getVisitorId() {
  const key = "innerCircleAiVisitorId";
  const existing = localStorage.getItem(key);
  if (existing) return { visitorId: existing, isReturning: true };
  const next = crypto.randomUUID();
  localStorage.setItem(key, next);
  return { visitorId: next, isReturning: false };
}

function getSessionId() {
  const key = "innerCircleAiSessionId";
  const existing = sessionStorage.getItem(key);
  if (existing) return existing;
  const next = crypto.randomUUID();
  sessionStorage.setItem(key, next);
  return next;
}

function getBucket(answers) {
  const score =
    (bucketScores.comfort[answers.comfort] ?? 0) +
    (bucketScores.frequency[answers.frequency] ?? 0) +
    (bucketScores.tools[answers.tools] ?? 0);
  if (answers.help === "Automation ideas" || answers.goal === "Automation") return "Workflow Builder";
  if (score <= 1) return "AI Curious";
  if (score <= 3) return "AI Starter";
  if (score <= 6) return "AI User";
  if (score <= 9) return "AI Operator";
  return "AI Multiplier";
}

function AnalyticsBoundary() {
  if (!convex) return <App />;
  return (
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  );
}

function App() {
  const [active, setActive] = useState(0);
  const [identity, setIdentity] = useState({ name: "", phone: "" });
  const [answers, setAnswers] = useState({});
  const [question, setQuestion] = useState("");
  const [copied, setCopied] = useState(false);
  const [modalCopied, setModalCopied] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [visitor] = useState(() => getVisitorId());
  const [sessionId] = useState(() => getSessionId());
  const track = useTracker(visitor.visitorId, sessionId);
  const answerCount = Object.values(answers).filter(Boolean).length;
  const bucket = useMemo(() => getBucket(answers), [answers]);
  const completedSurvey = answerCount === questions.length;
  const deckRef = useRef(null);

  useEffect(() => {
    track("page_view", {
      isReturning: visitor.isReturning,
      path: window.location.pathname,
      referrer: document.referrer,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
  }, []);

  useEffect(() => {
    const root = deckRef.current;
    if (!root) return undefined;
    const viewed = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number(entry.target.dataset.index);
          if (!Number.isFinite(index)) return;
          setActive(index);
          if (!viewed.has(index)) {
            viewed.add(index);
            track("slide_viewed", { slideId: slides[index].id, index });
          }
        });
      },
      { threshold: 0.58 }
    );
    Array.from(root.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [track]);

  useEffect(() => {
    if (!identity.name && !identity.phone) return;
    track("identity_updated", { identity });
  }, [identity.name, identity.phone]);

  useEffect(() => {
    if (!question.trim()) return;
    const timeout = window.setTimeout(() => {
      track("whatsapp_question_typed", {
        questionLength: question.trim().length,
        questionDraft: question.trim(),
        bucket
      });
    }, 900);
    return () => window.clearTimeout(timeout);
  }, [question]);

  const goTo = (index) => {
    const root = deckRef.current;
    if (!root) return;
    const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
    const target = root.children?.[nextIndex];
    if (!target) return;
    target.scrollTop = 0;
    root.scrollTo({ top: target.offsetTop - root.offsetTop, behavior: "smooth" });
    setActive(nextIndex);
    track("slide_navigated", { index: nextIndex, slideId: slides[nextIndex]?.id });
  };

  const goToSlide = (slideId) => {
    const index = slideIndexById[slideId];
    if (typeof index === "number") goTo(index);
  };

  const updateAnswer = (id, value) => {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    track("answer_updated", {
      questionId: id,
      value,
      answers: next,
      answeredCount: Object.values(next).filter(Boolean).length,
      bucket: getBucket(next)
    });
  };

  const whatsappMessage = [
    "Hi Harsha, I completed your AI for my inner circle readiness check.",
    "",
    `Name: ${identity.name || ""}`,
    `Phone: ${identity.phone || ""}`,
    `Private readiness bucket: ${bucket}`,
    "",
    "My question:",
    question || ""
  ].join("\n");

  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const shareText = "My friend Harsha is doing something useful around AI for people in his circle. Take this quick readiness check.";
  const shareHref = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${publicSiteUrl}`)}`;

  const openWhatsApp = () => {
    track("whatsapp_cta_clicked", { bucket, completedSurvey, questionLength: question.trim().length });
  };

  const copyShare = async (eventName = "share_copy_clicked") => {
    await navigator.clipboard.writeText(`${shareText}\n\n${publicSiteUrl}`);
    setCopied(true);
    track(eventName, { publicSiteUrl });
    setTimeout(() => setCopied(false), 1600);
  };

  const completeSurvey = () => {
    track("survey_completed", { answers, bucket, completedSurvey: true });
    setShowCompletionModal(true);
    track("completion_modal_viewed", { bucket, publicSiteUrl });
  };

  const askFromModal = () => {
    setShowCompletionModal(false);
    track("completion_modal_whatsapp_clicked", { bucket });
    goToSlide("ask");
  };

  const continueFromModal = () => {
    setShowCompletionModal(false);
    track("completion_modal_continue_clicked", { bucket });
    goToSlide("ask");
  };

  const copyShareFromModal = async () => {
    await navigator.clipboard.writeText(`${shareText}\n\n${publicSiteUrl}`);
    setModalCopied(true);
    track("completion_modal_copy_clicked", { publicSiteUrl, bucket });
    setTimeout(() => setModalCopied(false), 1600);
  };

  return (
    <main>
      <section
        className="deck"
        ref={deckRef}
        aria-label="AI readiness story"
      >
        {slides.map((slide, index) => (
          <StorySlide key={slide.id} slide={slide} index={index} active={active} goTo={goTo}>
            {slide.identity && (
              <IdentityForm identity={identity} setIdentity={setIdentity} onContinue={() => goTo(index + 1)} />
            )}
            {slide.survey && (
              <Survey
                answers={answers}
                updateAnswer={updateAnswer}
                answerCount={answerCount}
                onDone={completeSurvey}
              />
            )}
            {slide.final && (
              <FinalAsk
                question={question}
                setQuestion={setQuestion}
                whatsappHref={whatsappHref}
                openWhatsApp={openWhatsApp}
                completedSurvey={completedSurvey}
                identity={identity}
                setIdentity={setIdentity}
              />
            )}
            {slide.share && (
              <ShareBlock shareHref={shareHref} copyShare={copyShare} copied={copied} track={track} />
            )}
          </StorySlide>
        ))}
      </section>
      {showCompletionModal && (
        <CompletionModal
          copied={modalCopied}
          onAsk={askFromModal}
          onCopy={copyShareFromModal}
          onContinue={continueFromModal}
        />
      )}
    </main>
  );
}

function useTracker(visitorId, sessionId) {
  const mutation = convex ? useMutation(api.analytics.trackEvent) : null;
  return useMemo(() => {
    return (eventName, payload = {}) => {
      const event = {
        visitorId,
        sessionId,
        eventName,
        payload,
        url: window.location.href,
        userAgent: navigator.userAgent,
        createdAt: Date.now()
      };
      if (mutation) {
        mutation(event).catch(() => queueEvent(event));
      } else {
        queueEvent(event);
      }
      trackSupabaseEvent(event).catch(() => queueEvent({ ...event, eventName: `supabase_failed:${event.eventName}` }));
    };
  }, [mutation, visitorId]);
}

function queueEvent(event) {
  const key = "innerCircleAiQueuedAnalytics";
  const current = JSON.parse(localStorage.getItem(key) || "[]");
  current.push(event);
  localStorage.setItem(key, JSON.stringify(current.slice(-200)));
}

function StorySlide({ slide, index, active, goTo, children }) {
  const isActive = active === index;
  const customChildren = React.Children.toArray(children);
  const hasCustomChildren = customChildren.length > 0;
  return (
    <article className={`slide ${slide.id} ${isActive ? "active" : ""}`} id={slide.id} data-index={index}>
      {index > 0 && (
        <div className="floating-avatar" aria-label="Harsha">
          <img src="/harsha.png" alt="" />
        </div>
      )}
      <div className="slide-copy">
        <p className="letter-progress">From Harsha · {index + 1} of {slides.length}</p>
        <h1>{slide.title}</h1>
        <p className="lead">{slide.body}</p>
        {slide.paragraphs?.map((paragraph, paragraphIndex) => (
          <p className="note" key={`${slide.id}-${paragraphIndex}`}>{paragraph}</p>
        ))}
        {!hasCustomChildren && (
          <button className="primary-button" type="button" onClick={() => goTo(Math.min(index + 1, slides.length - 1))}>
            {slide.cta || "Continue"} <ArrowRight size={18} />
          </button>
        )}
      </div>
      {(hasCustomChildren || slide.id === "hello") && (
        <div className="slide-panel">
          {hasCustomChildren ? customChildren : <PanelPreview slideId={slide.id} />}
        </div>
      )}
    </article>
  );
}

function CompletionModal({ copied, onAsk, onCopy, onContinue }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="completion-modal" role="dialog" aria-modal="true" aria-labelledby="completion-title">
        <div className="modal-avatar" aria-hidden="true">
          <img src="/harsha.png" alt="" />
        </div>
        <p className="letter-progress">A small next step</p>
        <h2 id="completion-title">I got your answers.</h2>
        <p>I will personally review this and privately understand where you are with AI.</p>
        <p>Next, you can ask me one question on WhatsApp, or share this with someone in your circle.</p>
        <div className="modal-actions">
          <button className="primary-button" type="button" onClick={onAsk}>
            Ask Harsha on WhatsApp <Send size={18} />
          </button>
          <button className="secondary-button" type="button" onClick={onCopy}>
            {copied ? "Copied" : "Copy share message"} <Copy size={18} />
          </button>
          <button className="quiet-button" type="button" onClick={onContinue}>
            Continue <ArrowRight size={17} />
          </button>
        </div>
      </section>
    </div>
  );
}

function PanelPreview({ slideId }) {
  if (slideId === "hello") {
    return (
      <div className="photo-card">
        <div className="photo-frame">
          <img src="/harsha.png" alt="Harsha" />
        </div>
        <div className="photo-note">
          <span>From Harsha</span>
          <strong>I have been learning and building with AI. This is my way of sharing that with my own people first.</strong>
        </div>
      </div>
    );
  }

  return null;
}

function IdentityForm({ identity, setIdentity, onContinue }) {
  const canContinue = identity.name.trim();
  return (
    <div className="form-card">
      <label>
        <span>Your name</span>
        <input value={identity.name} onChange={(event) => setIdentity((current) => ({ ...current, name: event.target.value }))} placeholder="Example: Ravi, Priya, Sandeep..." />
      </label>
      <button className="primary-button" type="button" disabled={!canContinue} onClick={onContinue}>
        Continue <ArrowRight size={18} />
      </button>
    </div>
  );
}

function Survey({ answers, updateAnswer, answerCount, onDone }) {
  const [step, setStep] = useState(0);
  const current = questions[step];
  const value = answers[current.id] || "";
  const isLast = step === questions.length - 1;
  const canMove = Boolean(value);

  const next = () => {
    if (!canMove) return;
    if (isLast) onDone();
    else setStep((currentStep) => currentStep + 1);
  };

  return (
    <div className="survey-card">
      <div className="survey-head">
        <span>{step + 1} / {questions.length}</span>
        <div className="mini-progress"><i style={{ width: `${(answerCount / questions.length) * 100}%` }} /></div>
      </div>
      <Question field={current} value={value} onChange={(nextValue) => updateAnswer(current.id, nextValue)} />
      <div className="survey-actions">
        <button className="secondary-button" type="button" disabled={step === 0} onClick={() => setStep((currentStep) => currentStep - 1)}>Back</button>
        <button className="primary-button" type="button" disabled={!canMove} onClick={next}>
          {isLast ? "Finish check" : "Next"} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function Question({ field, value, onChange }) {
  return (
    <div className="question">
      <h2>{field.label}</h2>
      {field.type === "choice" ? (
        <div className="choices">
          {field.options.map((option) => (
            <button className={value === option ? "selected" : ""} type="button" key={option} onClick={() => onChange(option)}>
              {option}
            </button>
          ))}
        </div>
      ) : field.type === "textarea" ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder} rows={5} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder} />
      )}
    </div>
  );
}

function FinalAsk({ question, setQuestion, whatsappHref, openWhatsApp, completedSurvey, identity, setIdentity }) {
  const canSend = question.trim() && identity.name.trim() && identity.phone.trim();
  return (
    <div className="final-card">
      {!completedSurvey && <p className="warning">You can still message me, but the readiness check is not fully complete.</p>}
      <label>
        <span>Your WhatsApp number</span>
        <input
          value={identity.phone}
          onChange={(event) => setIdentity((current) => ({ ...current, phone: event.target.value }))}
          placeholder="Add your WhatsApp number so I know where to reply"
        />
      </label>
      <textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask me anything about using AI in your work, studies, business, personal life, or monetising your skills with AI." rows={6} />
      <p className="small-note">When you click this, WhatsApp will open with your message already prepared. You can review it once and send it to me.</p>
      <a className={`primary-button link-button ${canSend ? "" : "disabled"}`} href={canSend ? whatsappHref : undefined} target="_blank" rel="noreferrer" onClick={openWhatsApp}>
        Open WhatsApp message <Send size={18} />
      </a>
      <p className="done-note"><Check size={16} /> After this, I will personally sort responses and get back with what makes sense.</p>
    </div>
  );
}

function ShareBlock({ shareHref, copyShare, copied, track }) {
  return (
    <div className="share-card">
      <div className="share-icon"><WandSparkles size={34} /></div>
      <h2>Share this with someone who trusts your judgement.</h2>
      <p>Maybe they are curious, stuck, or quietly worried they are missing the AI bus. Send it to them.</p>
      <div className="share-actions">
        <a className="primary-button link-button" href={shareHref} target="_blank" rel="noreferrer" onClick={() => track("share_whatsapp_clicked", { publicSiteUrl })}>
          Share on WhatsApp <Phone size={18} />
        </a>
        <button className="secondary-button" type="button" onClick={() => copyShare()}>
          {copied ? "Copied" : "Copy share text"} <Copy size={18} />
        </button>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<AnalyticsBoundary />);
