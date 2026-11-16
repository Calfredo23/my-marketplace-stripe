import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseConfig } from "@/lib/supabase/config";

export async function GET() {
  return NextResponse.json({
    supabase: Boolean(getSupabaseConfig()),
    admin: Boolean(getSupabaseAdminClient()),
    stripe: Boolean(getStripe()),
    webhookSecret: Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim()),
    serviceKey:
      Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) ||
      Boolean(process.env.SUPABASE_SECRET_KEY?.trim()),
  });
}
