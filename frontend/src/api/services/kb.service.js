/**
 * Knowledge Base is NOT implemented on the backend yet.
 * Backend currently has only /admin/faqs (see faq.service.js).
 *
 * These stubs return empty/safe data so KB pages don't crash.
 * Backend dev: when /kb endpoints are added, replace each function with the
 * real http call (use _http.js).
 */
const notImpl = (extra = {}) => ({ notImplemented: true, ...extra });

export const kb = {
  list: async () => notImpl({ articles: [], total: 0 }),
  get: async () => notImpl({ article: null }),
  create: async () => notImpl({ article: null }),
  update: async () => notImpl({ article: null }),
  remove: async () => notImpl({ success: false }),
  search: async () => notImpl({ results: [] }),
  categories: async () => notImpl({ categories: [] }),
};
