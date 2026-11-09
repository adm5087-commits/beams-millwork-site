"use client";
import { useEffect, useRef, useState } from "react";
import { useFormSubmit } from "./useFormSubmit";

const STEPS = ["Position", "Contact info", "Eligibility", "Work history", "Education and skills", "References", "Resume and signature"];
const SOFTWARE = ["Microvellum", "AutoCAD", "Cabinet Vision", "2020", "ShopPak", "ProjectPak", "SolidWorks", "SketchUp", "Excel", "Estimating software"];
const MACHINES = ["Table saw", "Panel saw", "Edgebander", "CNC router", "Moulder", "Shaper", "Wide belt sander", "Spray finishing", "Field installation"];
const EDU_LEVELS = ["Some high school", "High school diploma or GED", "Trade or vocational certificate", "Some college", "Associate degree", "Bachelor\u2019s degree", "Graduate degree"];

function Label({ htmlFor, label, required }) {
  return (
    <label htmlFor={htmlFor}>
      {label}
      {required && <span className="req" aria-hidden="true"> *</span>}
    </label>
  );
}

function Field({ label, name, required, full, hint, as = "input", options, ...props }) {
  const id = `f-${name}`;
  let control;
  if (as === "select") {
    control = (
      <select id={id} name={name} required={required} defaultValue="" {...props}>
        <option value="" disabled={required}>Choose one</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    );
  } else if (as === "textarea") {
    control = <textarea id={id} name={name} required={required} {...props} />;
  } else {
    control = <input id={id} name={name} required={required} {...props} />;
  }
  return (
    <div className={`field${full ? " full" : ""}`}>
      <Label htmlFor={id} label={label} required={required} />
      {control}
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

function YesNo({ label, name, required, full = true, hint }) {
  return (
    <fieldset className={`choice${full ? " full" : ""}`}>
      <legend>
        {label}
        {required && <span className="req" aria-hidden="true"> *</span>}
      </legend>
      {hint && <p className="hint">{hint}</p>}
      <div className="choice-row">
        <label><input type="radio" name={name} value="Yes" required={required} /> Yes</label>
        <label><input type="radio" name={name} value="No" /> No</label>
      </div>
    </fieldset>
  );
}

function Checks({ label, name, options }) {
  return (
    <fieldset className="choice full">
      <legend>{label}</legend>
      <div className="check-grid">
        {options.map((o) => (
          <label key={o}><input type="checkbox" name={name} value={o} /> {o}</label>
        ))}
      </div>
    </fieldset>
  );
}

function RepeatHead({ title, onRemove }) {
  return (
    <div className="repeat-head">
      <h4>{title}</h4>
      {onRemove && <button type="button" className="link-btn" onClick={onRemove}>Remove</button>}
    </div>
  );
}

export default function ApplicationForm({ positions }) {
  const { state, onSubmit } = useFormSubmit("/api/apply");
  const [step, setStep] = useState(0);
  const [position, setPosition] = useState("");
  const [jobs, setJobs] = useState(1);
  const [noHistory, setNoHistory] = useState(false);
  const [schools, setSchools] = useState(1);
  const panels = useRef([]);
  const top = useRef(null);
  const today = new Date().toLocaleDateString("en-US", { dateStyle: "long" });

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("position");
    if (p) setPosition(p);
  }, []);

  function validate(i) {
    const panel = panels.current[i];
    if (!panel) return true;
    for (const el of panel.querySelectorAll("input, select, textarea")) {
      if (el.disabled) continue;
      if (!el.checkValidity()) {
        el.reportValidity();
        return false;
      }
    }
    return true;
  }

  function go(next) {
    if (next > step && !validate(step)) return;
    setStep(next);
    requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function handleSubmit(e) {
    if (!validate(step)) {
      e.preventDefault();
      return;
    }
    onSubmit(e);
  }

  if (state.status === "sent") {
    return (
      <div className="notice ok" role="status">
        <h3>Application sent</h3>
        <p>Thanks for applying. We review every application and will reach out if it&rsquo;s a fit. A confirmation is on its way to your inbox.</p>
      </div>
    );
  }

  const panel = (i) => ({
    ref: (el) => (panels.current[i] = el),
    hidden: step !== i,
    className: "step-panel",
  });

  return (
    <form className="app-form" onSubmit={handleSubmit} noValidate>
      <div className="stepper" ref={top}>
        <p className="step-count">
          Step {step + 1} of {STEPS.length}: <strong>{STEPS[step]}</strong>
        </p>
        <ol className="step-bar" aria-hidden="true">
          {STEPS.map((s, i) => (
            <li key={s} className={i < step ? "done" : i === step ? "current" : ""} />
          ))}
        </ol>
      </div>

      {/* 1. Position */}
      <fieldset {...panel(0)}>
        <legend>Position</legend>
        <div className="form-grid">
          <div className="field">
            <Label htmlFor="f-position" label="Position applying for" required />
            <select id="f-position" name="position" required value={position} onChange={(e) => setPosition(e.target.value)}>
              <option value="" disabled>Choose one</option>
              {positions.map((p) => (
                <option key={p.title}>{p.title}</option>
              ))}
              <option>General application</option>
            </select>
          </div>
          <Field label="Employment type" name="employmentType" as="select" required options={["Full time", "Part time", "Either"]} />
          <div className="field">
            <Label htmlFor="f-pay" label="Desired pay" required />
            <div className="money">
              <span aria-hidden="true">$</span>
              <input
                id="f-pay"
                name="pay"
                required
                inputMode="decimal"
                autoComplete="off"
                pattern="[0-9][0-9,]*(\.[0-9]{1,2})?"
                title="Numbers only, like 28 or 65,000"
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.,]/g, "").replace(/(\..*)\./g, "$1");
                }}
              />
            </div>
            <span className="hint">Numbers only, like 28 or 65,000. An hourly rate or an annual salary.</span>
          </div>
          <Field label="Earliest start date" name="start" required placeholder="e.g. Nov 15 or two weeks notice" />
          <Field label="How did you hear about us?" name="heard" as="select" options={["Indeed", "Facebook", "Referred by an employee", "Our website", "School or job fair", "Other"]} />
          <Field label="Referred by" name="referredBy" hint="If someone referred you." />
          <YesNo label="Have you worked for Beam&rsquo;s Millwork before?" name="priorBeams" full={false} />
        </div>
      </fieldset>

      {/* 2. Contact info */}
      <fieldset {...panel(1)}>
        <legend>Contact info</legend>
        <div className="form-grid three">
          <Field label="First name" name="firstName" required autoComplete="given-name" />
          <Field label="Middle name" name="middleName" autoComplete="additional-name" />
          <Field label="Last name" name="lastName" required autoComplete="family-name" />
        </div>
        <div className="form-grid">
          <Field label="Street address" name="street" required autoComplete="address-line1" />
          <Field label="Apt or unit" name="unit" autoComplete="address-line2" />
          <Field label="City" name="city" required autoComplete="address-level2" />
          <div className="form-grid pair">
            <Field label="State" name="state" required autoComplete="address-level1" defaultValue="PA" maxLength={2} />
            <Field label="ZIP code" name="zip" required autoComplete="postal-code" inputMode="numeric" maxLength={10} />
          </div>
          <Field label="Phone" name="phone" type="tel" required autoComplete="tel" />
          <Field label="Alternate phone" name="phone2" type="tel" />
          <Field label="Email" name="email" type="email" required autoComplete="email" />
          <Field label="Best way to reach you" name="contactPref" as="select" options={["Phone call", "Text", "Email"]} />
        </div>
      </fieldset>

      {/* 3. Eligibility */}
      <fieldset {...panel(2)}>
        <legend>Eligibility</legend>
        <div className="form-grid">
          <YesNo label="Are you 18 or older?" name="over18" required />
          <YesNo label="Are you legally authorized to work in the United States?" name="authorized" required />
          <YesNo label="Will you now or in the future require visa sponsorship to work in the U.S.?" name="sponsorship" required />
          <YesNo label="Do you have a valid driver&rsquo;s license?" name="license" required hint="Required for some positions, such as installation." />
          <YesNo label="Do you have reliable transportation to Morgantown, PA?" name="transportation" required />
          <YesNo label="Can you work our regular schedule, Monday to Friday, 7:00 am to 4:00 pm?" name="schedule" required />
          <YesNo
            label="Can you perform the essential functions of this position, with or without reasonable accommodation?"
            name="essential"
            required
            hint="Shop and field roles involve standing for long periods, operating machinery and lifting up to 50 lbs."
          />
          <Field label="Anything we should know about your availability?" name="scheduleNotes" as="textarea" full rows={3} />
        </div>
      </fieldset>

      {/* 4. Work history */}
      <fieldset {...panel(3)}>
        <legend>Work history</legend>
        <p className="step-intro">Start with your current or most recent job.</p>
        <label className="inline-check">
          <input type="checkbox" name="noHistory" checked={noHistory} onChange={(e) => setNoHistory(e.target.checked)} /> I don&rsquo;t have previous work history
        </label>
        {!noHistory &&
          Array.from({ length: jobs }, (_, i) => (
            <div className="repeat" key={i}>
              <RepeatHead
                title={i === 0 ? "Current or most recent employer" : `Employer ${i + 1}`}
                onRemove={i > 0 && i === jobs - 1 ? () => setJobs(jobs - 1) : null}
              />
              <div className="form-grid">
                <Field label="Company" name={`job${i}_employer`} required />
                <Field label="Job title" name={`job${i}_title`} required />
                <Field label="City and state" name={`job${i}_location`} />
                <Field label="Company phone" name={`job${i}_phone`} type="tel" />
                <Field label="Supervisor" name={`job${i}_supervisor`} />
                <YesNo label="May we contact this employer?" name={`job${i}_contact`} required full={false} />
                <Field label="Start date" name={`job${i}_start`} required placeholder="MM/YYYY" />
                <Field label="End date" name={`job${i}_end`} required placeholder="MM/YYYY or Present" />
                <Field label="Duties" name={`job${i}_duties`} as="textarea" full rows={3} />
                <Field label="Reason for leaving" name={`job${i}_reason`} full />
              </div>
            </div>
          ))}
        {!noHistory && jobs < 4 && (
          <button type="button" className="btn ghost small" onClick={() => setJobs(jobs + 1)}><span>Add another employer</span></button>
        )}
      </fieldset>

      {/* 5. Education and skills */}
      <fieldset {...panel(4)}>
        <legend>Education and skills</legend>
        <div className="form-grid">
          <Field label="Highest level of education completed" name="eduLevel" as="select" required options={EDU_LEVELS} />
        </div>
        {Array.from({ length: schools }, (_, i) => (
          <div className="repeat" key={i}>
            <RepeatHead title={`School ${i + 1}`} onRemove={i > 0 && i === schools - 1 ? () => setSchools(schools - 1) : null} />
            <div className="form-grid">
              <Field label="Type" name={`school${i}_type`} as="select" options={["High school", "Trade or vocational", "College or university", "Other"]} />
              <Field label="School name" name={`school${i}_name`} />
              <Field label="City and state" name={`school${i}_location`} />
              <Field label="Area of study" name={`school${i}_study`} />
              <YesNo label="Completed?" name={`school${i}_completed`} full={false} />
            </div>
          </div>
        ))}
        {schools < 3 && (
          <button type="button" className="btn ghost small" onClick={() => setSchools(schools + 1)}><span>Add another school</span></button>
        )}

        <div className="repeat">
          <RepeatHead title="Skills" />
          <div className="form-grid">
            <Field
              label="Years of millwork or cabinet shop experience"
              name="shopYears"
              as="select"
              options={["None", "Less than 1 year", "1 to 3 years", "3 to 5 years", "5 to 10 years", "10+ years"]}
            />
            <Checks label="Software you&rsquo;ve used" name="software" options={SOFTWARE} />
            <Field label="Other software" name="softwareOther" full placeholder="List any other programs you&rsquo;ve used" />
            <Checks label="Machinery and processes you&rsquo;ve run" name="machines" options={MACHINES} />
            <Field label="Other machinery or processes" name="machinesOther" full placeholder="List any other equipment you&rsquo;ve run" />
            <Field label="Certifications and licenses" name="certs" full placeholder="e.g. Forklift, OSHA 10, AWI training" />
            <Field label="Other skills" name="skills" as="textarea" full rows={3} />
            <Field label="Military training relevant to this job" name="military" as="textarea" full rows={2} hint="Optional." />
          </div>
        </div>
      </fieldset>

      {/* 6. References */}
      <fieldset {...panel(5)}>
        <legend>References</legend>
        <p className="step-intro">Optional. Professional references only, not relatives.</p>
        {[0, 1, 2].map((i) => (
          <div className="repeat" key={i}>
            <RepeatHead title={`Reference ${i + 1}`} />
            <div className="form-grid">
              <Field label="Name" name={`ref${i}_name`} autoComplete="off" />
              <Field label="Relationship" name={`ref${i}_relationship`} placeholder="e.g. Former supervisor" />
              <Field label="Company" name={`ref${i}_company`} />
              <Field label="Phone" name={`ref${i}_phone`} type="tel" autoComplete="off" />
              <Field label="Email" name={`ref${i}_email`} type="email" autoComplete="off" />
              <Field label="Years known" name={`ref${i}_years`} inputMode="numeric" />
            </div>
          </div>
        ))}
      </fieldset>

      {/* 7. Resume and signature */}
      <fieldset {...panel(6)}>
        <legend>Resume and signature</legend>
        <div className="form-grid">
          <Field
            label="Resume and other files"
            name="files"
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.rtf,.txt,.jpg,.jpeg,.png"
            hint="Resume, cover letter or work samples. PDF, Word or images, 4 MB total. Optional."
          />
          <Field label="Portfolio link" name="portfolio" type="url" placeholder="https://" hint="For larger work samples." />
          <Field label="Anything else we should know?" name="comments" as="textarea" full rows={4} />

          <div className="ack">
            <label>
              <input type="checkbox" name="ackCertify" required />
              <span>I certify that the information in this application is true and complete. I understand that false or misleading information, or significant omissions, may disqualify me from consideration or lead to dismissal if discovered later.</span>
            </label>
            <label>
              <input type="checkbox" name="ackContact" required />
              <span>I authorize Beam&rsquo;s Millwork to contact my previous employers (except those I marked not to contact) and any references I listed to verify the information I provided.</span>
            </label>
            <label>
              <input type="checkbox" name="ackAtWill" required />
              <span>I understand that if hired, my employment is at will, meaning either Beam&rsquo;s Millwork or I may end it at any time, with or without cause or notice.</span>
            </label>
          </div>

          <Field label="Signature" name="signature" required hint={`Type your full legal name. Dated ${today}.`} autoComplete="name" />

          <p className="legal-note">
            Beam&rsquo;s Millwork is an equal opportunity employer. We consider all applicants without regard to race, color,
            religion, sex, sexual orientation, gender identity, national origin, age, disability, veteran status or any other
            characteristic protected by law.
          </p>
        </div>
        {state.status === "error" && <p className="notice error" role="alert">{state.message}</p>}
      </fieldset>

      <div className="hp" aria-hidden="true">
        <label htmlFor="a-web">Leave this empty</label>
        <input id="a-web" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="step-nav">
        {step > 0 ? (
          <button type="button" className="btn ghost" onClick={() => go(step - 1)}><span>Back</span></button>
        ) : (
          <span />
        )}
        {step < STEPS.length - 1 ? (
          <button type="button" className="btn" onClick={() => go(step + 1)}><span>Next<span className="next-name">: {STEPS[step + 1]}</span></span></button>
        ) : (
          <button type="submit" className="btn" disabled={state.status === "sending"}><span>{state.status === "sending" ? "Submitting application..." : "Submit application"}</span></button>
        )}
      </div>
    </form>
  );
}
