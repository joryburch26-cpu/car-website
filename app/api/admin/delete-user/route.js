import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// The public address and public key of the Supabase project (safe to be here)
const supabaseUrl = "https://mbhcgrbescrqzuswrpjj.supabase.co";
const publicKey = "sb_publishable_f4P-wthCDQjmn4NdXOSfcQ_50CAJXbY";

export async function POST(request) {
  // The secret key lives only in Vercel's settings, never in the code
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json(
      { error: "The secret key is not added in Vercel yet." },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const userId = body && body.userId;
  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "Missing user." }, { status: 400 });
  }

  const adminClient = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 1. Find out who is asking
  const { data: caller, error: callerError } = await adminClient.auth.getUser(token);
  if (callerError || !caller || !caller.user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  // 2. Make sure the person asking is the real admin (checked by the database)
  const callerClient = createClient(supabaseUrl, publicKey, {
    global: { headers: { Authorization: "Bearer " + token } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: isAdmin } = await callerClient.rpc("is_admin");
  if (isAdmin !== true) {
    return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  }

  // 3. Never let the admin delete their own account by mistake
  if (caller.user.id === userId) {
    return NextResponse.json(
      { error: "You cannot delete your own admin account." },
      { status: 400 }
    );
  }

  // 4. Delete products, seller profile, then the login itself
  await adminClient.from("products").delete().eq("seller_id", userId);
  await adminClient.from("sellers").delete().eq("user_id", userId);

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
