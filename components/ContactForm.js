"use client";
import { useFormSubmit } from "./useFormSubmit";

export default function ContactForm() {
  const { state, onSubmit } = useFormSubmit("/api/contact");

  if (state.status === "sent") {
    return (
      <div className="notice ok" role="status">
        <h3>Project details sent</h3>
        <p>Thanks. Someone from our team will follow up within one business day. A confirmation is on its way to your inbox.</p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="c-name">Name <span className="req" aria-hidden="true">*</span></label>
        <input id="c-name" name="name" required autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="c-company">Company</label>
        <input id="c-company" name="company" autoComplete="organization" />
      </div>
      <div className="field">
        <label htmlFor="c-email">Email <span className="req" aria-hidden="true">*</span></label>
        <input id="c-email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="c-phone">Phone</label>
        <input id="c-phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div className="field">
        <label htmlFor="c-role">I am a</label>
        <select id="c-role" name="role" defaultValue="">
          <option value="">Choose one</option>
          <option>Homeowner</option>
          <option>Builder or general contractor</option>
          <option>Architect or designer</option>
          <option>Owner or facility manager</option>
          <option>Other</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="c-type">Project type</label>
        <select id="c-type" name="projectType" defaultValue="">
          <option value="">Choose one</option>
          <option>Residential</option>
          <option>Commercial</option>
          <option>Institutional</option>
          <option>Mouldings only</option>
          <option>Other</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="c-loc">Project location</label>
        <input id="c-loc" name="location" placeholder="Town or job site" />
      </div>
      <div className="field">
        <label htmlFor="c-time">Timeline</label>
        <input id="c-time" name="timeline" placeholder="e.g. Bid due Nov 14, install spring" />
      </div>
      <div className="field full">
        <label htmlFor="c-msg">Project details <span className="req" aria-hidden="true">*</span></label>
        <textarea id="c-msg" name="message" required placeholder="Scope, species and finish, quantities, anything we should know." />
      </div>
      <div className="field">
        <label htmlFor="c-files">Drawings or photos</label>
        <input id="c-files" name="files" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.dwg,.dxf,.zip,.doc,.docx,.xls,.xlsx" />
        <span className="hint">Up to 4 MB total.</span>
      </div>
      <div className="field">
        <label htmlFor="c-link">Link to plans</label>
        <input id="c-link" name="link" type="url" placeholder="Dropbox, Box, Google Drive..." />
        <span className="hint">For larger drawing sets.</span>
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="c-web">Leave this empty</label>
        <input id="c-web" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {state.status === "error" && (
        <p className="notice error" role="alert">{state.message}</p>
      )}
      <div className="field full">
        <button className="btn" type="submit" disabled={state.status === "sending"}>
          {state.status === "sending" ? "Sending..." : "Send project details"}
        </button>
      </div>
    </form>
  );
}
