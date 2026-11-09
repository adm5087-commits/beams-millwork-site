import { text, isEmail, esc, UserError } from "./forms";

export const MAX_JOBS = 4;
export const MAX_SCHOOLS = 3;
export const REFERENCES = 3;

// Turns the submitted form into labeled sections used for both the email and the PDF.
export function parseApplication(fd) {
  const missing = [];
  const g = (k, max = 300) => text(fd, k, max);
  const r = (k, label, max) => {
    const v = g(k, max);
    if (!v) missing.push(label);
    return v;
  };
  const list = (k) =>
    fd.getAll(k).filter((v) => typeof v === "string" && v).map((v) => v.slice(0, 80)).join(", ");

  const sections = [];

  // Position
  const position = r("position", "Position", 120);
  const pay = r("pay", "Desired pay", 20).replace(/[$,\s]/g, "");
  if (pay && !/^\d+(\.\d{1,2})?$/.test(pay)) missing.push("Desired pay (numbers only)");
  sections.push({
    title: "Position",
    rows: [
      ["Position", position],
      ["Employment type", r("employmentType", "Employment type", 40)],
      ["Desired pay", pay ? `$${Number(pay).toLocaleString("en-US", { maximumFractionDigits: 2 })}` : ""],
      ["Earliest start date", r("start", "Earliest start date", 60)],
      ["How they heard about us", g("heard", 80)],
      ["Referred by", g("referredBy", 120)],
      ["Previously worked at Beam's", g("priorBeams", 5)],
    ],
  });

  // Applicant
  const first = r("firstName", "First name", 80);
  const middle = g("middleName", 80);
  const last = r("lastName", "Last name", 80);
  const name = [first, middle, last].filter(Boolean).join(" ");
  const email = r("email", "Email", 200);
  if (email && !isEmail(email)) missing.push("A valid email");
  const street = r("street", "Street address", 200);
  const unit = g("unit", 40);
  const city = r("city", "City", 80);
  const state = r("state", "State", 20);
  const zip = r("zip", "ZIP code", 10);
  sections.push({
    title: "Applicant",
    rows: [
      ["Name", name],
      ["Address", `${street}${unit ? `, ${unit}` : ""}\n${city}, ${state} ${zip}`],
      ["Phone", r("phone", "Phone", 40)],
      ["Alternate phone", g("phone2", 40)],
      ["Email", email],
      ["Preferred contact", g("contactPref", 20)],
    ],
  });

  // Eligibility
  sections.push({
    title: "Eligibility",
    rows: [
      ["18 or older", r("over18", "Age 18 or older", 5)],
      ["Authorized to work in the U.S.", r("authorized", "Work authorization", 5)],
      ["Will need visa sponsorship", r("sponsorship", "Visa sponsorship", 5)],
      ["Valid driver's license", r("license", "Driver's license", 5)],
      ["Reliable transportation", r("transportation", "Transportation", 5)],
      ["Can work Mon to Fri, 7 am to 4 pm", r("schedule", "Work schedule", 5)],
      ["Can perform essential job functions, with or without accommodation", r("essential", "Essential functions", 5)],
      ["Schedule notes", g("scheduleNotes", 500)],
    ],
  });

  // Work history
  const work = { title: "Work history", rows: [] };
  if (g("noHistory")) {
    work.rows.push(["Work history", "No previous employment"]);
  } else {
    for (let i = 0; i < MAX_JOBS; i++) {
      const employer = g(`job${i}_employer`, 160);
      if (!employer) {
        if (i === 0) missing.push("Most recent employer");
        continue;
      }
      work.rows.push(
        { sub: `Employer ${i + 1}` },
        ["Company", employer],
        ["Job title", g(`job${i}_title`, 120)],
        ["Location", g(`job${i}_location`, 120)],
        ["Phone", g(`job${i}_phone`, 40)],
        ["Supervisor", g(`job${i}_supervisor`, 120)],
        ["Dates", [g(`job${i}_start`, 20), g(`job${i}_end`, 20)].filter(Boolean).join(" to ")],
        ["Duties", g(`job${i}_duties`, 2000)],
        ["Reason for leaving", g(`job${i}_reason`, 500)],
        ["OK to contact", g(`job${i}_contact`, 5)]
      );
    }
  }
  sections.push(work);

  // Education
  const edu = { title: "Education", rows: [["Highest level completed", r("eduLevel", "Highest education level", 60)]] };
  for (let i = 0; i < MAX_SCHOOLS; i++) {
    const school = g(`school${i}_name`, 160);
    if (!school) continue;
    edu.rows.push(
      { sub: `School ${i + 1}` },
      ["Type", g(`school${i}_type`, 60)],
      ["School", school],
      ["Location", g(`school${i}_location`, 120)],
      ["Area of study", g(`school${i}_study`, 160)],
      ["Completed", g(`school${i}_completed`, 5)]
    );
  }
  sections.push(edu);

  // Skills
  sections.push({
    title: "Skills",
    rows: [
      ["Millwork or cabinet shop experience", g("shopYears", 40)],
      ["Software", list("software")],
      ["Machinery and processes", list("machines")],
      ["Certifications and licenses", g("certs", 1000)],
      ["Other skills", g("skills", 2000)],
      ["Military training", g("military", 1000)],
    ],
  });

  // References
  const refs = { title: "References", rows: [] };
  for (let i = 0; i < REFERENCES; i++) {
    const n = g(`ref${i}_name`, 120);
    if (!n) {
      if (i < 2) missing.push(`Reference ${i + 1}`);
      continue;
    }
    refs.rows.push(
      { sub: `Reference ${i + 1}` },
      ["Name", n],
      ["Relationship", g(`ref${i}_relationship`, 120)],
      ["Company", g(`ref${i}_company`, 120)],
      ["Phone", g(`ref${i}_phone`, 40)],
      ["Email", g(`ref${i}_email`, 200)],
      ["Years known", g(`ref${i}_years`, 20)]
    );
  }
  sections.push(refs);

  sections.push({
    title: "Additional information",
    rows: [
      ["Portfolio link", g("portfolio", 500)],
      ["Comments", g("comments", 4000)],
    ],
  });

  // Certification
  if (!g("ackCertify") || !g("ackContact") || !g("ackAtWill")) missing.push("All three acknowledgments");
  const signature = r("signature", "Signature", 120);
  sections.push({
    title: "Certification and signature",
    rows: [
      ["Certified information is true and complete", "Yes"],
      ["Authorized contact of employers and references", "Yes"],
      ["Acknowledged at-will employment", "Yes"],
      ["Electronic signature", signature],
      ["Signed", new Date().toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "long", timeStyle: "short" })],
    ],
  });

  if (missing.length) throw new UserError(`Please complete: ${missing.join(", ")}.`);
  return { name, email, position, sections };
}

export function renderHtml(sections) {
  const td = "padding:5px 14px 5px 0;vertical-align:top;font-family:Arial,sans-serif;font-size:14px";
  return sections
    .map((s) => {
      const rows = s.rows
        .filter((row) => row.sub || row[1])
        .map((row) =>
          row.sub
            ? `<tr><td colspan="2" style="${td};padding-top:14px;font-weight:bold;color:#4a2f1e">${esc(row.sub)}</td></tr>`
            : `<tr><td style="${td};color:#555;width:220px"><strong>${esc(row[0])}</strong></td><td style="${td}">${esc(row[1]).replace(/\n/g, "<br>")}</td></tr>`
        )
        .join("");
      return `<h3 style="font-family:Arial,sans-serif;font-size:16px;margin:26px 0 6px;padding-bottom:4px;border-bottom:1px solid #ddd">${esc(s.title)}</h3><table style="border-collapse:collapse">${rows}</table>`;
    })
    .join("");
}
