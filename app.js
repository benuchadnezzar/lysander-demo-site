// These are synthetic test events. They do not transmit data to GA4 on their own.
// GTM must be configured to listen for and forward each event.
(() => {
  "use strict";

  const recordedEvents = [];
  const log = document.getElementById("event-log");
  const total = document.getElementById("event-total");
  const count = document.getElementById("console-count");
  const status = document.getElementById("gtm-status");
  const message = document.getElementById("console-message");

  const gtmId = window.LYSANDER_CONFIG?.gtmId ?? "";
  if (/^GTM-[A-Z0-9]+$/.test(gtmId)) {
    status.textContent = `${gtmId} · loader configured`;
    status.classList.add("configured");
  } else {
    status.textContent = "Not configured";
    status.classList.add("unconfigured");
  }

  function render() {
    total.textContent = String(recordedEvents.length);
    count.textContent = `${recordedEvents.length} record${recordedEvents.length === 1 ? "" : "s"}`;
    log.replaceChildren();

    if (recordedEvents.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "›  No events yet. Try an interaction above.";
      log.appendChild(empty);
      return;
    }

    for (const entry of recordedEvents.slice().reverse()) {
      const line = document.createElement("div");
      line.className = "event-entry";

      const header = document.createElement("div");
      header.className = "event-entry-header";
      const time = document.createElement("span");
      time.className = "event-time";
      time.textContent = entry.at;
      const eventName = document.createElement("span");
      eventName.className = "event-name";
      eventName.textContent = entry.payload.event;
      header.append(time, eventName);

      const details = document.createElement("pre");
      details.textContent = JSON.stringify(entry.payload, null, 2);
      line.append(header, details);
      log.appendChild(line);
    }
  }

  function pushEvent(event, parameters = {}) {
    const payload = { event, ...parameters };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    recordedEvents.push({ at: new Date().toLocaleTimeString(), payload });
    render();
  }

  document.querySelectorAll("[data-feature]").forEach((button) => {
    button.addEventListener("click", () => {
      pushEvent("select_content", {
        content_type: "feature",
        item_id: button.dataset.feature,
      });
      message.textContent = `Feature selected: ${button.dataset.feature}. Check GTM Preview to verify the trigger.`;
    });
  });

  document.getElementById("lead-form").addEventListener("submit", (event) => {
    event.preventDefault();
    pushEvent("generate_lead", {
      form_id: "lysander_demo_lead",
      interest_area: document.getElementById("interest").value,
    });
    message.textContent = "Synthetic lead event fired. No personal information was collected or sent by this form.";
  });

  document.getElementById("signup-button").addEventListener("click", () => {
    pushEvent("sign_up", { method: "demo_button" });
    message.textContent = "Synthetic signup event fired. No user account was created.";
  });

  document.getElementById("clear-events").addEventListener("click", () => {
    recordedEvents.length = 0;
    render();
    message.textContent = "Visible event log cleared. Previous pushes remain in window.dataLayer.";
  });

  document.getElementById("copy-events").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(recordedEvents, null, 2));
      message.textContent = "Copied session event log to clipboard.";
    } catch {
      message.textContent = "Clipboard access was blocked by your browser. Open DevTools to inspect window.dataLayer.";
    }
  });

  render();
})();
