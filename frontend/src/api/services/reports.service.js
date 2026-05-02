/**
 * Reports module is NOT implemented on the backend yet.
 * The backend exposes raw analytics under /analytics/* (see analytics.service.js)
 * but has no notion of saved/scheduled reports.
 *
 * These stubs return empty/safe data so the Reports page doesn't crash.
 * Backend dev: implement /reports/* and replace these stubs with real http calls.
 */
const notImpl = (extra = {}) => ({ notImplemented: true, ...extra });

export const reports = {
  list: async () => notImpl({ reports: [] }),
  get: async () => notImpl({ report: null }),
  create: async () => notImpl({ report: null }),
  remove: async () => notImpl({ success: false }),
  export: async () => notImpl({ url: null }),
  schedule: async () => notImpl({ success: false }),
};
