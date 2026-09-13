export const INITIAL_QUEUES = [
  { id: 'q-1', name: 'high-priority', depth: 42, rate: 185, pending: 42, failed: 3, maxConcurrency: 50, priorityWeight: 10, status: 'active' },
  { id: 'q-2', name: 'billing-webhooks', depth: 12, rate: 94, pending: 12, failed: 1, maxConcurrency: 35, priorityWeight: 8, status: 'active' },
  { id: 'q-3', name: 'default', depth: 128, rate: 310, pending: 128, failed: 14, maxConcurrency: 100, priorityWeight: 5, status: 'active' },
  { id: 'q-4', name: 'video-encoding', depth: 8, rate: 12, pending: 8, failed: 2, maxConcurrency: 10, priorityWeight: 4, status: 'paused' },
  { id: 'q-5', name: 'email-notifications', depth: 65, rate: 240, pending: 65, failed: 5, maxConcurrency: 60, priorityWeight: 3, status: 'active' }
];

export const INITIAL_WORKERS = [
  { id: 'wn-01', name: 'worker-node-01', status: 'busy', currentJob: 'job-9821', processed: 48291, success: 47910, failed: 381, rate: 42.5, cpu: 74, memory: 62, concurrency: '16/20', ip: '10.0.4.12', uptime: '14d 6h' },
  { id: 'wn-02', name: 'worker-node-02', status: 'active', currentJob: 'job-9824', processed: 51029, success: 50810, failed: 219, rate: 38.9, cpu: 58, memory: 54, concurrency: '12/20', ip: '10.0.4.15', uptime: '14d 6h' },
  { id: 'wn-03', name: 'worker-node-03', status: 'busy', currentJob: 'job-9826', processed: 39210, success: 38940, failed: 270, rate: 45.1, cpu: 88, memory: 79, concurrency: '19/20', ip: '10.0.4.18', uptime: '9d 12h' },
  { id: 'wn-04', name: 'worker-node-04', status: 'idle', currentJob: '-', processed: 42100, success: 41850, failed: 250, rate: 0.0, cpu: 12, memory: 31, concurrency: '0/20', ip: '10.0.4.21', uptime: '21d 2h' },
  { id: 'wn-05', name: 'worker-node-05', status: 'active', currentJob: 'job-9830', processed: 47120, success: 46900, failed: 220, rate: 34.2, cpu: 46, memory: 48, concurrency: '10/20', ip: '10.0.4.24', uptime: '5d 18h' },
  { id: 'wn-06', name: 'worker-node-06', status: 'degraded', currentJob: 'job-9811', processed: 28410, success: 27100, failed: 1310, rate: 14.8, cpu: 96, memory: 92, concurrency: '8/20', ip: '10.0.4.27', uptime: '2d 4h' },
  { id: 'wn-07', name: 'worker-node-07', status: 'active', currentJob: 'job-9833', processed: 36290, success: 36100, failed: 190, rate: 31.0, cpu: 42, memory: 41, concurrency: '9/20', ip: '10.0.4.30', uptime: '11d 8h' },
  { id: 'wn-08', name: 'worker-node-08', status: 'idle', currentJob: '-', processed: 19400, success: 19280, failed: 120, rate: 0.0, cpu: 8, memory: 28, concurrency: '0/20', ip: '10.0.4.33', uptime: '1d 16h' }
];

export const INITIAL_SCHEDULER_JOBS = [
  { id: 'sch-101', name: 'Daily Database Backup', queue: 'default', cron: '0 2 * * *', nextRun: 'in 4 hours 12 mins', lastRun: '2026-09-13 02:00:00', status: 'enabled', type: 'DatabaseBackupJob', payload: { compression: 'gzip', target: 's3://db-backups-prod' } },
  { id: 'sch-102', name: 'Hourly Metric Aggregation', queue: 'high-priority', cron: '0 * * * *', nextRun: 'in 38 mins', lastRun: '2026-09-14 04:00:00', status: 'enabled', type: 'AggregateMetricsJob', payload: { window: '1h', send_alerts: true } },
  { id: 'sch-103', name: 'User Retention Data Sync', queue: 'billing-webhooks', cron: '0 6 * * 1', nextRun: 'in 2 days', lastRun: '2026-09-07 06:00:00', status: 'enabled', type: 'SyncUserMetadata', payload: { batch_size: 5000 } },
  { id: 'sch-104', name: 'Stripe Failed Charge Retry', queue: 'billing-webhooks', cron: '*/15 * * * *', nextRun: 'in 8 mins', lastRun: '2026-09-14 04:15:00', status: 'enabled', type: 'ProcessStripeInvoice', payload: { max_attempts: 3 } },
  { id: 'sch-105', name: 'Cache Eviction Cleanup', queue: 'default', cron: '*/30 * * * *', nextRun: 'in 23 mins', lastRun: '2026-09-14 04:00:00', status: 'disabled', type: 'CleanupExpiredTokens', payload: { ttl_seconds: 86400 } },
  { id: 'sch-106', name: 'Search Index Optimization', queue: 'video-encoding', cron: '0 4 * * 0', nextRun: 'in 6 days', lastRun: '2026-09-13 04:00:00', status: 'enabled', type: 'IndexSearchDocuments', payload: { reindex_all: false } }
];

export const INITIAL_JOBS = [
  {
    id: 'job-9833',
    type: 'SendWelcomeEmail',
    queue: 'email-notifications',
    status: 'running',
    priority: 'normal',
    createdAt: '2026-09-14 04:20:12',
    duration: '310ms',
    worker: 'worker-node-07',
    attempts: 1,
    payload: { user_id: 'usr_88291', template: 'welcome_v2', email: 'user882@example.com' },
    logs: ['[04:20:12] Job initialized by API gateway', '[04:20:12] Enqueued to [email-notifications]', '[04:20:12] Worker worker-node-07 locked payload']
  },
  {
    id: 'job-9832',
    type: 'ProcessStripeInvoice',
    queue: 'billing-webhooks',
    status: 'running',
    priority: 'critical',
    createdAt: '2026-09-14 04:20:08',
    duration: '1.2s',
    worker: 'worker-node-03',
    attempts: 1,
    payload: { invoice_id: 'in_1M0x2y3z', amount_cents: 14900, currency: 'usd' },
    logs: ['[04:20:08] Received Stripe Webhook event charge.succeeded', '[04:20:08] Validated signature', '[04:20:09] Processing payment ledger entry']
  },
  {
    id: 'job-9831',
    type: 'TranscodeVideoTask',
    queue: 'video-encoding',
    status: 'queued',
    priority: 'high',
    createdAt: '2026-09-14 04:20:01',
    duration: '-',
    worker: '-',
    attempts: 0,
    payload: { file_id: 'mov_49102', input_format: 'mov', target_resolution: '4K', codec: 'h265' },
    logs: ['[04:20:01] Job enqueued by Upload Service']
  },
  {
    id: 'job-9830',
    type: 'AggregateMetricsJob',
    queue: 'high-priority',
    status: 'running',
    priority: 'high',
    createdAt: '2026-09-14 04:19:55',
    duration: '4.8s',
    worker: 'worker-node-05',
    attempts: 1,
    payload: { window: '5m', metrics: ['cpu', 'memory', 'network_rx', 'network_tx'] },
    logs: ['[04:19:55] Worker node-05 acquired lock', '[04:19:56] Reading raw metric buffer from RedisTS']
  },
  {
    id: 'job-9829',
    type: 'SyncUserMetadata',
    queue: 'default',
    status: 'completed',
    priority: 'normal',
    createdAt: '2026-09-14 04:19:30',
    duration: '420ms',
    worker: 'worker-node-02',
    attempts: 1,
    payload: { user_ids: ['usr_102', 'usr_103', 'usr_104'], source: 'auth0' },
    logs: ['[04:19:30] Job dequeued by worker-node-02', '[04:19:30] Auth0 API token refreshed', '[04:19:31] Synced 3 users', '[04:19:31] Status set to COMPLETED']
  },
  {
    id: 'job-9828',
    type: 'GenerateMonthlyReport',
    queue: 'default',
    status: 'completed',
    priority: 'low',
    createdAt: '2026-09-14 04:18:50',
    duration: '12.4s',
    worker: 'worker-node-01',
    attempts: 1,
    payload: { org_id: 'org_enterprise_99', period: '2026-08', format: 'pdf' },
    logs: ['[04:18:50] Worker worker-node-01 started report rendering engine', '[04:19:02] PDF written to S3 bucket', '[04:19:02] Completed']
  },
  {
    id: 'job-9827',
    type: 'CleanupExpiredTokens',
    queue: 'default',
    status: 'completed',
    priority: 'low',
    createdAt: '2026-09-14 04:18:10',
    duration: '180ms',
    worker: 'worker-node-04',
    attempts: 1,
    payload: { purge_before: '2026-09-13T00:00:00Z' },
    logs: ['[04:18:10] Purged 1,420 expired session tokens']
  },
  {
    id: 'job-9826',
    type: 'ProcessStripeInvoice',
    queue: 'billing-webhooks',
    status: 'failed',
    priority: 'critical',
    createdAt: '2026-09-14 04:17:42',
    duration: '3.1s',
    worker: 'worker-node-06',
    attempts: 3,
    error: 'HTTP 502 Bad Gateway: Connection timeout communicating with Stripe API endpoint at https://api.stripe.com/v1/invoices/in_88192',
    payload: { invoice_id: 'in_88192', customer: 'cus_99102' },
    logs: [
      '[04:17:42] Attempt 1 failed: HTTP 502 Bad Gateway',
      '[04:17:45] Attempt 2 failed: HTTP 502 Bad Gateway',
      '[04:17:48] Attempt 3 failed: HTTP 502 Bad Gateway',
      '[04:17:48] Max retries (3) reached. Moved job to Dead Letter Queue.'
    ]
  },
  {
    id: 'job-9825',
    type: 'IndexSearchDocuments',
    queue: 'high-priority',
    status: 'completed',
    priority: 'normal',
    createdAt: '2026-09-14 04:16:55',
    duration: '890ms',
    worker: 'worker-node-02',
    attempts: 1,
    payload: { index_name: 'products_v3', doc_count: 150 },
    logs: ['[04:16:55] Elasticsearch bulk index request succeeded']
  },
  {
    id: 'job-9824',
    type: 'SendWelcomeEmail',
    queue: 'email-notifications',
    status: 'failed',
    priority: 'normal',
    createdAt: '2026-09-14 04:15:30',
    duration: '520ms',
    worker: 'worker-node-06',
    attempts: 3,
    error: 'SendGrid API Error: 401 Unauthorized - Invalid API key provided in Authorization header',
    payload: { user_id: 'usr_7721', email: 'invalid_user@domain.test' },
    logs: ['[04:15:30] SendGrid return 401 status', '[04:15:31] Moved to Dead Letter Queue']
  },
  {
    id: 'job-9823',
    type: 'TranscodeVideoTask',
    queue: 'video-encoding',
    status: 'queued',
    priority: 'normal',
    createdAt: '2026-09-14 04:14:10',
    duration: '-',
    worker: '-',
    attempts: 0,
    payload: { file_id: 'mov_88192', target_resolution: '1080p' },
    logs: ['[04:14:10] Job queued']
  },
  {
    id: 'job-9822',
    type: 'DatabaseBackupJob',
    queue: 'default',
    status: 'completed',
    priority: 'high',
    createdAt: '2026-09-14 04:12:00',
    duration: '45.2s',
    worker: 'worker-node-01',
    attempts: 1,
    payload: { database: 'prod_jobqueue', dump_size: '1.4GB' },
    logs: ['[04:12:00] Pg_dump started', '[04:12:45] Backup archive generated and uploaded']
  }
];

export const INITIAL_DLQ_JOBS = [
  {
    id: 'dlq-101',
    jobId: 'job-9826',
    type: 'ProcessStripeInvoice',
    queue: 'billing-webhooks',
    failedAt: '2026-09-14 04:17:48',
    retryCount: 3,
    maxRetries: 3,
    reason: 'HTTP 502 Bad Gateway: Connection timeout communicating with Stripe API',
    stackTrace: `Error: HTTP 502 Bad Gateway\n    at StripeClient.request (k:/services/stripe.js:142:15)\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async ProcessStripeInvoiceHandler.execute (k:/workers/invoice_processor.js:38:12)`,
    payload: { invoice_id: 'in_88192', customer: 'cus_99102', retry_strategy: 'exponential' }
  },
  {
    id: 'dlq-102',
    jobId: 'job-9824',
    type: 'SendWelcomeEmail',
    queue: 'email-notifications',
    failedAt: '2026-09-14 04:15:31',
    retryCount: 3,
    maxRetries: 3,
    reason: 'SendGrid API Error: 401 Unauthorized - Invalid API key',
    stackTrace: `SendGridError: 401 Unauthorized\n    at SendGridTransport.send (k:/services/email/sendgrid.js:88:11)\n    at async SendWelcomeEmailHandler.execute (k:/workers/email_worker.js:19:5)`,
    payload: { user_id: 'usr_7721', email: 'invalid_user@domain.test' }
  },
  {
    id: 'dlq-103',
    jobId: 'job-9780',
    type: 'TranscodeVideoTask',
    queue: 'video-encoding',
    failedAt: '2026-09-14 03:45:12',
    retryCount: 5,
    maxRetries: 5,
    reason: 'FFmpegProcessError: Invalid input codec header in source video container',
    stackTrace: `FFmpegError: Command failed with exit code 1: ffmpeg -i input.mov output.mp4\n    at FFmpegWrapper.convert (k:/services/media/ffmpeg.js:204:18)\n    at async TranscodeVideoHandler.execute (k:/workers/video_worker.js:64:9)`,
    payload: { file_id: 'corrupt_vid_991', size_bytes: 48920194 }
  },
  {
    id: 'dlq-104',
    jobId: 'job-9742',
    type: 'SyncUserMetadata',
    queue: 'default',
    failedAt: '2026-09-14 02:10:04',
    retryCount: 3,
    maxRetries: 3,
    reason: 'PostgresDeadlockError: Transaction 90123 deadlock detected on user_table lock',
    stackTrace: `DatabaseError: Deadlock detected\n    at Pool.query (k:/db/postgres.js:52:10)\n    at async SyncUserMetadataHandler.execute (k:/workers/sync_worker.js:41:7)`,
    payload: { user_ids: ['usr_401', 'usr_402'], region: 'us-east-1' }
  }
];
