import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const trackEvent = mutation({
  args: {
    visitorId: v.string(),
    sessionId: v.optional(v.string()),
    eventName: v.string(),
    payload: v.any(),
    url: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("analyticsEvents", {
      ...args,
      eventVersion: 1
    });

    const payload = args.payload || {};
    const visitor = await ctx.db
      .query("visitors")
      .withIndex("by_visitor_id", (q) => q.eq("visitorId", args.visitorId))
      .first();

    if (visitor) {
      await ctx.db.patch(visitor._id, {
        lastSeenAt: args.createdAt,
        visitCount: args.eventName === "page_view" ? visitor.visitCount + 1 : visitor.visitCount,
        isReturning: payload.isReturning ?? visitor.isReturning
      });
    } else {
      await ctx.db.insert("visitors", {
        visitorId: args.visitorId,
        firstSeenAt: args.createdAt,
        lastSeenAt: args.createdAt,
        visitCount: 1,
        isReturning: Boolean(payload.isReturning),
        firstReferrer: payload.referrer,
        firstUtm: payload.utm
      });
    }

    if (args.sessionId) {
      const session = await ctx.db
        .query("sessions")
        .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
        .first();

      const sessionPatch = {
        lastEventAt: args.createdAt,
        completed: payload.completedSurvey ?? session?.completed ?? false,
        whatsappCtaClicked: args.eventName === "whatsapp_cta_clicked" || session?.whatsappCtaClicked || false,
        shareClicked: args.eventName.includes("share") || session?.shareClicked || false
      };

      if (session) {
        await ctx.db.patch(session._id, sessionPatch);
      } else {
        await ctx.db.insert("sessions", {
          sessionId: args.sessionId,
          visitorId: args.visitorId,
          startedAt: args.createdAt,
          isReturningVisitor: Boolean(payload.isReturning),
          referrer: payload.referrer,
          utm: payload.utm,
          userAgent: args.userAgent,
          viewport: payload.viewport,
          ...sessionPatch
        });
      }
    }

    if (
      args.eventName === "identity_updated" ||
      args.eventName === "answer_updated" ||
      args.eventName === "whatsapp_question_typed" ||
      args.eventName === "whatsapp_cta_clicked" ||
      args.eventName.includes("share")
    ) {
      const existing = await ctx.db
        .query("surveySnapshots")
        .withIndex(args.sessionId ? "by_session" : "by_visitor", (q) =>
          args.sessionId ? q.eq("sessionId", args.sessionId) : q.eq("visitorId", args.visitorId)
        )
        .first();

      const patch = {
        updatedAt: args.createdAt,
        completed: Boolean(payload.completedSurvey),
        completionStatus: payload.completedSurvey ? "completed" : "partial"
      };

      if (payload.identity) {
        patch.name = payload.identity.name;
        patch.phone = payload.identity.phone;
        patch.identityEnteredAt = args.createdAt;
      }

      if (payload.bucket) patch.bucket = payload.bucket;
      if (payload.readinessScore) patch.readinessScore = payload.readinessScore;
      if (payload.questionDraft !== undefined) patch.whatsappQuestion = payload.questionDraft;
      else if (payload.questionLength !== undefined) patch.whatsappQuestion = `typed:${payload.questionLength}`;
      if (args.eventName === "whatsapp_cta_clicked") {
        patch.whatsappCtaClickedAt = args.createdAt;
        patch.completionStatus = "whatsapp_cta_clicked";
      }
      if (args.eventName.includes("share")) patch.shareClickedAt = args.createdAt;

      if (existing) {
        await ctx.db.patch(existing._id, {
          ...patch,
          answers: payload.answers || existing.answers || {}
        });
      } else {
        await ctx.db.insert("surveySnapshots", {
          sessionId: args.sessionId,
          visitorId: args.visitorId,
          answers: payload.answers || {},
          createdAt: args.createdAt,
          ...patch
        });
      }
    }
  }
});
