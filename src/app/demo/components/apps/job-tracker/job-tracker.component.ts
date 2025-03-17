import {Component, OnInit} from '@angular/core';
import {JobTrackerSupabaseService} from "./services/job-tracker-supabase.service";
import {JobApplication} from "./models/job-application";

@Component({
  selector: 'app-job-tracker',
  templateUrl: './job-tracker.component.html',
  styleUrl: './job-tracker.component.scss'
})
export class JobTrackerComponent implements OnInit {
  expandedRows: { [key: number]: boolean } = {};
  jobs: JobApplication[] = [];
  selectedJob: JobApplication = this.initializeJob();
  displayDialog: boolean = false;
  dialogTitle: string = 'Add Job';
  rowIndex = 0;

  statusOptions = [
    { label: 'Interviewing', value: 'Interviewing' },
    { label: 'Accepted', value: 'Accepted' },
    { label: 'Rejected', value: 'Rejected' },
    { label: 'Applied', value: 'Applied'}
  ];

  booleanOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];

  constructor(private jobTrackerService: JobTrackerSupabaseService) {}

  async ngOnInit() {
    await this.loadJobs();
  }

  // Create
  async addJob(newJob: JobApplication) {
    const addedJob = await this.jobTrackerService.addJob(newJob);
    if (addedJob) {
      this.jobs.push(addedJob);
    }
  }

  // Read
  async loadJobs() {
    this.jobs = await this.jobTrackerService.getJobs();
    console.log(this.jobs);
  }

  // Update
  async updateJob(pk: number, updatedJob: Partial<JobApplication>) {
    const updated = await this.jobTrackerService.updateJob(pk, updatedJob);
    if (updated) {
      this.jobs = this.jobs.map(job => (job.pk === pk ? updated : job));
    }
  }

  async saveJob() {
    if (this.selectedJob.pk) {
      await this.jobTrackerService.updateJob(this.selectedJob.pk, this.selectedJob);
    } else {
      await this.jobTrackerService.addJob(this.selectedJob);
    }
    this.displayDialog = false;
    await this.loadJobs(); // Refresh job list
  }

  // Delete
  async deleteJob(pk: number) {
    await this.jobTrackerService.deleteJob(pk);
    this.jobs = this.jobs.filter(job => job.pk !== pk);
  }

  /**
   * Returns the severity level for the status badge in PrimeNG p-tag.
   */
  getStatusSeverity(status: string): string {
    switch (status?.toLowerCase()) {
      case 'accepted': return 'success';  // Green badge
      case 'rejected': return 'danger';   // Red badge
      case 'pending': return 'warning';   // Yellow badge
      case 'applied': return 'secondary'; // Gray badge ⚪
      default: return 'info';             // Blue badge (default)
    }
  }

  /**
   * Generates an array of interview rounds with dates and feedback.
   */
  getInterviewRounds(job: JobApplication): any[] {
    return Array.from({ length: job.interview_rounds || 0 }, (_, i) => ({
      round: i + 1,
      date: job.interview_dates && job.interview_dates[i] ? job.interview_dates[i] : 'N/A',
      feedback: job.interview_feedback || 'Pending'
    }));
  }

  /**
   * GOpens the dialog form.
   */
  openDialog(job?: JobApplication) {
    if (job) {
      this.dialogTitle = 'Edit Job';
      this.selectedJob = { ...job }; // Copy object to avoid reference issues
    } else {
      this.dialogTitle = 'Add Job';
      this.selectedJob = this.initializeJob();
    }
    this.displayDialog = true;
  }

  private initializeJob(): JobApplication {
    return {
      company_name: '',
      job_title: '',
      job_location: '',
      job_posting_link: '',
      job_source: '',
      date_applied: new Date(),
      application_status: 'Pending'
    };
  }
}
