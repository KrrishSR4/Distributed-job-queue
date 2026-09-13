import { MainLayoutComponent } from './layouts/main-layout/main-layout.component.js';
import { DashboardComponent } from './pages/dashboard/dashboard.component.js';
import { JobsComponent } from './pages/jobs/jobs.component.js';
import { WorkersComponent } from './pages/workers/workers.component.js';
import { QueuesComponent } from './pages/queues/queues.component.js';
import { SchedulerComponent } from './pages/scheduler/scheduler.component.js';
import { DlqComponent } from './pages/dlq/dlq.component.js';
import { AnalyticsComponent } from './pages/analytics/analytics.component.js';
import { SettingsComponent } from './pages/settings/settings.component.js';

export const routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'jobs', component: JobsComponent },
      { path: 'workers', component: WorkersComponent },
      { path: 'queues', component: QueuesComponent },
      { path: 'scheduler', component: SchedulerComponent },
      { path: 'dlq', component: DlqComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
