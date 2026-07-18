import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { toolName, description, category, email } = await req.json();

  if (!toolName || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: process.env.SUGGESTION_FROM_EMAIL!,
    to: process.env.SUGGESTION_TO_EMAIL!,
    subject: `Tool Suggestion: ${toolName}`,
    html: `
      <h2>New Tool Suggestion</h2>
      <p><strong>Tool:</strong> ${toolName}</p>
      <p><strong>Description:</strong> ${description}</p>
      ${category ? `<p><strong>Category:</strong> ${category}</p>` : ""}
      ${email ? `<p><strong>Submitter email:</strong> ${email}</p>` : ""}
    `,
  });

  if (error) {
    console.error("[suggest-tool]", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
