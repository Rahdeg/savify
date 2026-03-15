"use strict";

/**
 * Format a date value as "12 Mar 2026"
 * Accepts a Date object, ISO string, or MySQL timestamp string.
 */
function formatDate(val) {
  if (!val) return "N/A";
  const d = new Date(val);
  if (isNaN(d.getTime())) return String(val);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format a date+time value as "12 Mar 2026, 15:33"
 * Accepts a Date object, ISO string, or MySQL timestamp string.
 */
function formatDateTime(val) {
  if (!val) return "N/A";
  const d = new Date(val);
  if (isNaN(d.getTime())) return String(val);
  return (
    d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    ", " +
    d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  );
}

module.exports = { formatDate, formatDateTime };
