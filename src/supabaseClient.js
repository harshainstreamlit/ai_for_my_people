import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function trackSupabaseEvent(event) {
  if (!supabase) return;

  const payload = event.payload || {};

  await supabase.from("analytics_events").insert({
    visitor_id: event.visitorId,
    session_id: event.sessionId,
    event_name: event.eventName,
    payload: event.payload,
    url: event.url,
    user_agent: event.userAgent,
    created_at_ms: event.createdAt
  });

  await supabase.from("visitors").upsert({
    visitor_id: event.visitorId,
    first_seen_at_ms: event.createdAt,
    last_seen_at_ms: event.createdAt,
    is_returning: Boolean(payload.isReturning),
    first_referrer: payload.referrer || null,
    first_utm: payload.utm || null
  }, {
    onConflict: "visitor_id",
    ignoreDuplicates: false
  });

  if (event.sessionId) {
    const sessionPatch = {
      session_id: event.sessionId,
      visitor_id: event.visitorId,
      started_at_ms: event.createdAt,
      last_event_at_ms: event.createdAt,
      is_returning_visitor: Boolean(payload.isReturning),
      referrer: payload.referrer || null,
      viewport: payload.viewport || null,
      user_agent: event.userAgent
    };
    if (payload.completedSurvey) sessionPatch.completed = true;
    if (event.eventName === "whatsapp_cta_clicked") sessionPatch.whatsapp_cta_clicked = true;
    if (event.eventName.includes("share")) sessionPatch.share_clicked = true;

    await supabase.from("sessions").upsert(sessionPatch, {
      onConflict: "session_id",
      ignoreDuplicates: false
    });

    if (
      event.eventName === "identity_updated" ||
      event.eventName === "answer_updated" ||
      event.eventName === "whatsapp_question_typed" ||
      event.eventName === "survey_completed" ||
      event.eventName === "whatsapp_cta_clicked" ||
      event.eventName.includes("share")
    ) {
      const responsePatch = {
        session_id: event.sessionId,
        visitor_id: event.visitorId,
        updated_at_ms: event.createdAt
      };
      if (payload.identity?.name) responsePatch.name = payload.identity.name;
      if (payload.identity?.phone) responsePatch.phone = payload.identity.phone;
      if (payload.answers) responsePatch.answers = payload.answers;
      if (payload.bucket) responsePatch.readiness_bucket = payload.bucket;
      if (payload.questionDraft) responsePatch.final_whatsapp_question = payload.questionDraft;
      if (event.eventName === "whatsapp_cta_clicked") {
        responsePatch.whatsapp_cta_clicked_at_ms = event.createdAt;
        responsePatch.completion_status = "whatsapp_cta_clicked";
      } else if (payload.completedSurvey) {
        responsePatch.completion_status = "completed";
      } else {
        responsePatch.completion_status = "partial";
      }
      if (event.eventName.includes("share")) responsePatch.share_clicked_at_ms = event.createdAt;

      await supabase.from("survey_responses").upsert(responsePatch, {
        onConflict: "session_id",
        ignoreDuplicates: false
      });
    }
  }
}
