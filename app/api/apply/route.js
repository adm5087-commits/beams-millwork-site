import { isSpam, getFiles, sendMail, recipients, wantsConfirmation, esc, fail } from "@/lib/forms";
import { parseApplication, renderHtml } from "@/lib/application";
import { applicationPdf } from "@/lib/pdf";
import { site } from "@/lib/site";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const fd = await req.formData();
    if (isSpam(fd)) return Response.json({ ok: true });

    const app = parseApplication(fd);
    const files = await getFiles(fd, "files", ["pdf", "doc", "docx", "rtf", "txt", "jpg", "jpeg", "png"]);
    const to = recipients("CAREERS_TO");
    if (!to.length) throw new Error("No recipient configured (MAIL_TO or CAREERS_TO)");

    const pdf = await applicationPdf(app.sections, { title: `Employment application: ${app.position}`, name: app.name });
    const pdfName = `Application - ${app.name} - ${app.position}.pdf`.replace(/[^\w.\- ]+/g, "");

    await sendMail({
      to,
      replyTo: app.email,
      subject: `Application: ${app.position}, ${app.name}`,
      attachments: [{ filename: pdfName, content: pdf }, ...files],
      html:
        `<p style="font-family:Arial,sans-serif;font-size:14px">New employment application from beamsmillwork.com. The full application is attached as a PDF${files.length ? `, along with ${files.length} file(s) from the applicant` : ""}. Reply to this email to respond to the applicant.</p>` +
        renderHtml(app.sections),
    });

    if (wantsConfirmation()) {
      try {
        await sendMail({
          to: [app.email],
          subject: "We received your application",
          html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5"><p>Hi ${esc(app.name.split(" ")[0])},</p><p>Thanks for applying for the ${esc(app.position)} position at Beam\u2019s Millwork. We review every application and will be in touch if it\u2019s a fit.</p><p>Beam\u2019s Millwork<br>${site.phone}</p></div>`,
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
