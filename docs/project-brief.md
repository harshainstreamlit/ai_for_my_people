# Inner Circle AI Readiness Initiative

## Core Narrative

This is not a course launch.

The narrative is: Harsha personally calling his circle into the AI era.

Public name:

```text
AI for my inner circle
```

The page should feel like a personal note from Harsha to family, friends, neighbours, apartment/community people, and close/far inner-circle contacts. It should not feel corporate, salesy, or like a generic AI workshop funnel.

Harsha has spent significant time learning, testing, building, and applying AI tools, workflows, and systems. Now he wants to share that knowledge with people around him because AI is becoming important for everyone: school kids, employees, founders, homemakers, creators, consultants, and people exploring income opportunities.

The emotional angle:

- "I have learned a lot, and you already have access to my knowledge and time."
- "Before this AI gap becomes too big, I want to help my people know where they stand."
- "This is a simple readiness check first. I will personally sort responses and get back."
- "Some people may need a small video. Some may need a call. Some may need deeper workflow help."

## Tone

Use English only, but understandable Indian English.

The writing should be direct, familiar, and personal. It should use Harsha's name and voice directly.

Copy direction:

- Conversational direct response copywriting.
- Warm, clear, personal, and simple.
- No jargon unless explained immediately.
- No heavy "AI expert" posturing.
- No "course" positioning as the primary frame.

Preferred language examples:

- "I am doing a small AI readiness check for people I personally know."
- "Be honest. This is not a test."
- "I will personally sort these responses and come back with what makes sense for you."
- "If a simple video is enough, I will send that. If you need a call, I will try to create time slots."
- "I have not decided the pricing yet. The first goal is to help my circle move forward."

Avoid:

- "Enroll now"
- "Limited-time course"
- "Master AI in 30 days"
- Corporate SaaS tone
- Fake urgency
- Stock images

## Survey Submission Flow

The survey should not start cold. First, the page should reveal why people are here and why Harsha is doing this. Around the 2nd or 3rd slide/fold, ask who they are.

Initial identity fields:

- Name
- Phone number

The final step should let the person ask Harsha a question.

There should be a placeholder input, something like:

> Ask me anything about using AI in your work, studies, business, personal life, or even monetising your skills with AI.

When the person clicks the final button, the answer should be embedded into a WhatsApp message to Harsha.

WhatsApp number:

```text
+918374283166
```

Implementation note: Use the WhatsApp URL format with country code, likely:

```text
https://wa.me/918374283166?text=...
```

Before the button, include a small note so people understand what happens:

> When you click this, WhatsApp will open with your message already prepared. You can review it once and send it to me.

## Result Handling

User-facing result:

- Do not show a hard bucket immediately.
- Show a reassuring message:

> Thank you. I will personally sort this and get back with what makes sense for you.

Backend:

- We can still calculate the bucket immediately and save it in the backend.
- Convex is preferred first.
- The project should be Netlify compatible.
- Preference for the proof of concept: free or free-tier friendly tools only.

Analytics should be treated as a first-class requirement, not an afterthought.

Track as much useful, privacy-respectful behavior as practical:

- Page/session visit.
- Returning visitor detection.
- Slide/fold viewed.
- Survey started.
- Name/phone entered.
- Answers selected or typed.
- Partial survey progress.
- Person typed the final WhatsApp question but did not click send.
- Person clicked the WhatsApp send CTA.
- Share CTA clicked.
- Approximate completion bucket saved internally.

Important nuance: WhatsApp itself cannot confirm whether the person finally pressed send inside WhatsApp, only whether they clicked the page CTA that opened WhatsApp.

## Pricing And Monetisation Thought

Do not make money the main focus.

Current thinking:

- This is first about helping Harsha's inner circle jump the AI ladder.
- Harsha may eventually charge a bare minimum to stay motivated and make the time sustainable.
- Pricing is not decided yet.
- Possible models to park and revisit:
  - Free videos for common needs.
  - Free group calls for beginner buckets.
  - Low-cost paid slots for people who need personal help.
  - Pay-what-you-want.
  - A friendly support line such as: "Help me cover my monthly expenses up to 40k, pay whatever feels right."

Recommendation:

For the first version, do not ask for payment on the page. Mention only that some deeper help may later be free, paid, or pay-what-you-feel depending on time and need. Keep the first ask as trust-building and response collection.

Possible copy:

> I have not decided any pricing yet. For now, I want to understand where everyone is. Some help may be free, some may be videos, and if someone needs deeper time from me, I may keep a bare-minimum or pay-what-feels-right option later.

## Design Direction

Reference project:

```text
C:\Ai articrafts\devsharsha
```

Observed style DNA:

- React + Vite.
- Warm paper-like background.
- Bold but friendly typography.
- Black borders.
- Pastel accents.
- Lucide icons.
- Direct AI-at-work positioning.

New page should keep some DNA but become:

- More intimate.
- More minimal.
- More personal-note-like.
- Less course-like.
- Less corporate.

Preferred concept:

- Horizontal storytelling flow on desktop, where each scroll reveals one idea/fold.
- Mobile should gracefully become vertical.
- No stock images.
- Simple icons only.
- Premium but not corporate.

Audience language:

- Use "people in my circle" and "people of my circle".
- Avoid narrowing too much to only family/friends/neighbours because the page should also encourage sharing outward.

Sharing direction:

- The end of the experience should include a WhatsApp share/story option.
- The intent is that people can share it in their own circle.
- Sharing should feel curious and personal, not promotional.

Possible share copy direction:

> My friend Harsha is doing something useful around AI for people in his circle. Take this quick readiness check.

Open Graph requirement:

- Create a neat Open Graph preview image with Harsha's photo and the title.
- The preview should feel personal, curious, and premium.
- It should work well when Harsha shares the page and when people in his circle share it further.
- Suggested OG title: "AI for my inner circle"
- Suggested OG angle: "Harsha is personally mapping where people stand with AI."

## Recommended Buckets

Do not show these labels immediately to the user unless Harsha later approves.

Internal bucket ideas:

- AI Unaware: Has barely used AI and may not understand why it matters.
- AI Curious: Has heard/seen tools but does not know where to start.
- Casual User: Uses ChatGPT/Gemini occasionally but not as a workflow.
- Practical User: Uses AI for real tasks but needs structure, quality control, and better prompting.
- Workflow Builder: Ready for automations, repeatable systems, agents, and tool chains.
- Monetisation Seeker: Wants to use AI to earn, grow, sell, create, or build around their skill.

## Open Decisions

- Exact final OG image layout and source photo.
- Exact intro copy in Harsha's voice.
- Final survey question set.
- Convex schema and whether auth is needed.
- Whether to collect relationship to Harsha, age range, work/study field, and city/apartment/community.
- Whether to store WhatsApp-sent users separately from users who only complete survey.
- Netlify deployment method and environment variable naming.
