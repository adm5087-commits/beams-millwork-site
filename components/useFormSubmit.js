"use client";
import { useRef, useState } from "react";

const MAX_BYTES = 4 * 1024 * 1024;

export function useFormSubmit(endpoint) {
  const [state, setState] = useState({ status: "idle", message: "" });
  const started = useRef(Date.now());

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("t", String(started.current));

    let total = 0;
    for (const [, v] of fd.entries()) if (typeof v === "object" && v && "size" in v) total += v.size;
    if (total > MAX_BYTES) {
      setState({
        status: "error",
        message: `Your files total ${(total / 1048576).toFixed(1)} MB. Keep attachments under 4 MB, or share a link to larger files.`,
      });
      return;
    }

    setState({ status: "sending", message: "" });
    try {
      const res = await fetch(endpoint, { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "The form could not be sent.");
      form.reset();
      setState({ status: "sent", message: "" });
      window.scrollTo({ top: form.closest("section")?.offsetTop ?? 0, behavior: "smooth" });
    } catch (err) {
      setState({ status: "error", message: `${err.message} Try again, or call us at 610-286-9040.` });
    }
  }

  return { state, onSubmit };
}
