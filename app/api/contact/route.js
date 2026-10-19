import { text, isEmail, isSpam, getFiles, table, sendMail, recipients, wantsConfirmation, esc, fail, UserError } from "@/lib/forms";
import { site } from "@/lib/site";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const fd = await req.formData();
    if (isSpam(fd)) return Response.json({ ok: true });

    const d = {
      name: text(fd, "name", 120),
      email: text(fd, "email", 200),
      phone: text(fd, "phone", 40),
      company: text(fd, "company", 160),
      role: text(fd, "role", 60),
      projectType: text(fd, "projectType", 60),
      location: text(fd, "location", 160),
      timeline: text(fd, "timeline", 120),
      link: text(fd, "link", 500),
      message: text(fd, "message", 6000),
    };
    if (!d.name || !isEmail(d.email) || !d.message) {
      throw new UserError("Name, a valid email and a project description are required.");
    }

    const attachments = await getFiles(fd, "files", [
      "pdf", "jpg", "jpeg", "png", "webp", "heic", "dwg", "dxf", "zip", "doc", "docx", "xls", "xlsx",
    ]);
    const to = recipients("CONTACT_TO");
    if (!to.length) throw new Error("No recipient configured (MAIL_TO or CONTACT_TO)");

    await sendMail({
      to,
      replyTo: d.email,
      attachments,
      subject: `Bid request: ${d.projectType || "Project"}, ${d.name}${d.company ? ` (${d.company})` : ""}`,
      html:
        `<p style="font-family:Arial,sans-serif">New project inquiry from beamsmillwork.com</p>` +
        table([
          ["Name", d.name],
          ["Company", d.company],
          ["Email", d.email],
          ["Phone", d.phone],
          ["I am a", d.role],
          ["Project type", d.projectType],
          ["Location", d.location],
          ["Timeline", d.timeline],
          ["Plans link", d.link],
          ["Project details", d.message],
        ]) +
        `<p style="font-family:Arial,sans-serif;color:#555">${attachments.length} file(s) attached. Reply to this email to respond.</p>`,
    });

    if (wantsConfirmation()) {
      try {
        await sendMail({
          to: [d.email],
          subject: `We received your project details`,
          html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5"><p>Hi ${esc(d.name.split(" ")[0])},</p><p>Thanks for reaching out to Beam\u2019s Millwork. Someone from our team will follow up within one business day.</p><p>Beam\u2019s Millwork<br>${site.phone}</p></div>`,
        });
      } catch (e) {
        console.error("Confirmation email failed", e);
      }
    }

    return Response.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
