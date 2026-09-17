const fs = require('fs');

const path = 'k:/Distributed Job Queue/1-client/src/app/pages/landing/landing.component.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Replace Workflow 2 (Failure)
const oldFailureWorkflow = `          <!-- Workflow 2: Failure & DLQ Path -->
          <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <span class="text-xs font-bold text-slate-900 font-mono">FAILURE & RECOVERY PIPELINE</span>
              <span class="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded border border-rose-200">DLQ Quarantine</span>
            </div>

            <div class="space-y-4 font-mono text-xs">
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center flex-shrink-0">1</div>
                <div class="p-3 bg-slate-50 rounded-lg flex-1 border border-slate-200/60">
                  <div class="font-bold text-slate-900">Go Worker Execution</div>
                  <div class="text-[11px] text-slate-500">Attempts processing payload</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center flex-shrink-0">2</div>
                <div class="p-3 bg-amber-50 rounded-lg flex-1 border border-amber-200 text-amber-900">
                  <div class="font-bold">Failure Detected</div>
                  <div class="text-[11px] text-amber-700">Network timeout / DB lock / API Error</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0">3</div>
                <div class="p-3 bg-slate-50 rounded-lg flex-1 border border-slate-200/60">
                  <div class="font-bold text-slate-900">Exponential Backoff Retry</div>
                  <div class="text-[11px] text-slate-500">Calculates delay (2s ➔ 4s ➔ 8s)</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0">4</div>
                <div class="p-3 bg-slate-50 rounded-lg flex-1 border border-slate-200/60">
                  <div class="font-bold text-slate-900">Re-queued to Redis</div>
                  <div class="text-[11px] text-slate-500">Increments retry counter (Attempt 2/3)</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center flex-shrink-0">5</div>
                <div class="p-3 bg-rose-50 rounded-lg flex-1 border border-rose-200 text-rose-900">
                  <div class="font-bold">Max Retries Exceeded</div>
                  <div class="text-[11px] text-rose-700">Moved to Dead Letter Queue (DLQ)</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center flex-shrink-0">6</div>
                <div class="p-3 bg-slate-900 text-white rounded-lg flex-1">
                  <div class="font-bold">Admin Replay & Stack Inspection</div>
                  <div class="text-[11px] text-slate-300">Inspect error trace in DLQ Dashboard & Re-run</div>
                </div>
              </div>
            </div>
          </div>`;

const newFailureWorkflow = `          <!-- Workflow 2: Failure & Recovery Path -->
          <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <span class="text-xs font-bold text-slate-900 font-mono">FAILURE & RECOVERY PIPELINE</span>
              <span class="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded border border-amber-200">Retry Mechanism</span>
            </div>

            <div class="space-y-4 font-mono text-xs">
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center flex-shrink-0">1</div>
                <div class="p-3 bg-slate-50 rounded-lg flex-1 border border-slate-200/60">
                  <div class="font-bold text-slate-900">Go Worker Processing</div>
                  <div class="text-[11px] text-slate-500">Attempts processing payload</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center flex-shrink-0">2</div>
                <div class="p-3 bg-amber-50 rounded-lg flex-1 border border-amber-200 text-amber-900">
                  <div class="font-bold">Failure Detected</div>
                  <div class="text-[11px] text-amber-700">Network timeout / DB lock / API Error</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0">3</div>
                <div class="p-3 bg-slate-50 rounded-lg flex-1 border border-slate-200/60">
                  <div class="font-bold text-slate-900">Retry Allowed? (YES)</div>
                  <div class="text-[11px] text-slate-500">Checks current attempts vs max_attempts</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0">4</div>
                <div class="p-3 bg-slate-50 rounded-lg flex-1 border border-slate-200/60">
                  <div class="font-bold text-slate-900">Exponential Backoff Delay</div>
                  <div class="text-[11px] text-slate-500">Calculates delay (2s ➔ 4s ➔ 8s)</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0">5</div>
                <div class="p-3 bg-slate-50 rounded-lg flex-1 border border-slate-200/60">
                  <div class="font-bold text-slate-900">Re-queued to Redis</div>
                  <div class="text-[11px] text-slate-500">Increments retry counter (Attempt 2/3)</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center flex-shrink-0">6</div>
                <div class="p-3 bg-rose-50 rounded-lg flex-1 border border-rose-200 text-rose-900">
                  <div class="font-bold">Max Retries Exceeded</div>
                  <div class="text-[11px] text-rose-700">Final failure (FUTURE: Move to DLQ)</div>
                </div>
              </div>
            </div>
          </div>`;

content = content.replace(oldFailureWorkflow, newFailureWorkflow);
fs.writeFileSync(path, content);
console.log('Fixed workflow 2!');
