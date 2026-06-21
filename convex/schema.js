import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  visitors: defineTable({
    visitorId: v.string(),
    firstSeenAt: v.number(),
    lastSeenAt: v.number(),
    visitCount: v.number(),
    isReturning: v.boolean(),
    firstReferrer: v.optional(v.string()),
    firstUtm: v.optional(v.any())
  }).index("by_visitor_id", ["visitorId"]),
  sessions: defineTable({
    sessionId: v.string(),
    visitorId: v.string(),
    startedAt: v.number(),
    lastEventAt: v.number(),
    isReturningVisitor: v.boolean(),
    referrer: v.optional(v.string()),
    utm: v.optional(v.any()),
    userAgent: v.optional(v.string()),
    viewport: v.optional(v.any()),
    completed: v.boolean(),
    whatsappCtaClicked: v.boolean(),
    shareClicked: v.boolean()
  })
    .index("by_session_id", ["sessionId"])
    .index("by_visitor_id", ["visitorId"]),
  analyticsEvents: defineTable({
    sessionId: v.optional(v.string()),
    visitorId: v.string(),
    eventName: v.string(),
    eventVersion: v.optional(v.number()),
    payload: v.any(),
    url: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number()
  })
    .index("by_visitor", ["visitorId"])
    .index("by_session", ["sessionId"])
    .index("by_event", ["eventName"])
    .index("by_created_at", ["createdAt"]),
  surveySnapshots: defineTable({
    sessionId: v.optional(v.string()),
    visitorId: v.string(),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    identityEnteredAt: v.optional(v.number()),
    answers: v.any(),
    bucket: v.optional(v.string()),
    readinessScore: v.optional(v.number()),
    whatsappQuestion: v.optional(v.string()),
    whatsappCtaClickedAt: v.optional(v.number()),
    shareClickedAt: v.optional(v.number()),
    completionStatus: v.optional(v.string()),
    completed: v.boolean(),
    createdAt: v.optional(v.number()),
    updatedAt: v.number()
  })
    .index("by_visitor", ["visitorId"])
    .index("by_session", ["sessionId"])
    .index("by_bucket", ["bucket"])
});
