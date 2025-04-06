import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ResumeService} from "../resume.service";
import {Resume} from "../types/resume";
import {Skill} from "../types/skill";
import {Tag} from "../types/tag";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  resume: Resume = {
    id: '',
    title: 'Main',
    user: {
      id: '',
      first_name: '',
      last_name: '',
      username: '',
      password: '',
      email: '',
      date_of_birth: '',
      address_street1: '',
      address_street2: '',
      address_city: '',
      address_state: '',
      address_zip: '',
      is_active: true,
      created_at: '',
      created_by: '',
      updated_at: '',
      updated_by: ''
    },
    personal_info: {
      id: '',
      user_id: '',
      name: '',
      email: '',
      linkedin: '',
      github: '',
      created_at: '',
      created_by: '',
      updated_at: '',
      updated_by: ''
    },
    summary: {
      id: '',
      user_id: '',
      summary_text: '',
      created_at: '',
      created_by: '',
      updated_at: '',
      updated_by: ''
    },
    skills: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    languages: [],
    references: [],
    notes: []
  };
  skillsForm: { name: string; tags: any[] }[] = [
    { name: '', tags: [] }, // first row to start
  ];

  bulletForm: { experienceId: string, description: string; tags: any[] }[] = [
    { experienceId: '', description: '', tags: [] }, // first row to start
  ];
  savedSkills: { name: string; tags: any[] }[] = [];
  savedBullets: { experienceId: string, description: string; tags: any[] }[] = [];
  savedExperianceBullets: { name: string; tags: any[] }[] = [];

  availableTags: any[] = [];
  selectedSkillTags: any[] = [];
  showAddTagDialog = false;
  newTagName: string = '';
  showTable = true;
  menuItems: { icon: string; label: string; command: () => void }[] = [];
  employmentTypes: ({ label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string })[] = [];
  locationTypes: ({ label: string; value: string } | { label: string; value: string } | { label: string; value: string })[] = [];
  showBulletTable = true;

  proficiencyOptions = [
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' },
    { label: 'Fluent', value: 'Fluent' },
    { label: 'Native', value: 'Native' }
  ];


  constructor(private resumeService: ResumeService, private fb: FormBuilder) {}

  ngOnInit() {
    // this.loadTags();

    this.employmentTypes = [
      { label: 'Full-time', value: 'Full-time' },
      { label: 'Part-time', value: 'Part-time' },
      { label: 'Contract', value: 'Contract' },
      { label: 'Freelance', value: 'Freelance' },
      { label: 'Internship', value: 'Internship' }
    ];

    this.locationTypes = [
      { label: 'On-site', value: 'On-site' },
      { label: 'Remote', value: 'Remote' },
      { label: 'Hybrid', value: 'Hybrid' }
    ];

    this.availableTags = [
      { name: 'JavaScript' },
      { name: 'TypeScript' },
      { name: 'Angular' },
      { name: 'React' },
      { name: 'HTML' },
      { name: 'CSS' },
      { name: 'Responsive Design' },
      { name: 'Tailwind CSS' },
      { name: 'PrimeNG' }
    ];

    this.menuItems = [
      {
        label: 'Edit Tags',
        icon: 'pi pi-tags',
        command: () => {
          this.openTagEditor(); // your method to open a dialog or toggle a section
        }
      }
    ];
    // this.loadMainResume();
  }

  /** Fetch available tags from Supabase */
  loadTags() {
/*    this.resumeService.getTags().subscribe(data => {
      this.availableTags = data;
    });*/
  }

  toggleBulletTable() {
    this.showBulletTable = !this.showBulletTable;
  }

  /** Fetch main resume if it exists */
  loadMainResume() {
    this.resumeService.getMainResume().subscribe(resume => {
      if (resume) {
        this.resume = resume;
      }
    });
  }

  /** Add Education */
  addEducation() {
    this.resume.education.push({ school: '', degree: '', start_year: null, end_year: null });
  }

  removeEducation(index: number) {
    this.resume.education.splice(index, 1);
  }

  removeProject(index: number) {
    this.resume.projects.splice(index, 1);
  }

  /** Add Certification */
  addCertification() {
    //this.resume.certifications.push({ certification_name: '', issuing_organization: '', issue_date: '', expiration_date: '', tags: [] });
  }

  removeCertification(index: number) {
    this.resume.certifications.splice(index, 1);
  }

  /** Save the main resume to Supabase */
  saveMainResume() {
    this.resumeService.saveMainResume(this.resume).subscribe(response => {
      console.log('Main Resume Saved:', response);
    });
  }

  async savePersonalInfoOnly() {
    const { data, error } = await this.resumeService.updatePersonalInfo(this.resume.personal_info);

    if (error) {
      console.error('Error saving user:', error);
    } else {
      console.log('User saved:', data);
      if (!this.resume.user.id && data?.[0]?.id) {
        this.resume.user.id = data[0].id;
      }
    }
  }


  async saveSummaryOnly() {
    const { data, error } = await this.resumeService.updateSummary(this.resume.summary);

    if (error) {
      console.error('Error saving summary:', error);
    } else {
      console.log('Summary saved:', data);
      if (!this.resume.summary.id && data?.[0]?.id) {
        this.resume.summary.id= data[0].id;
      }
    }
  }

  onRemoveTag(tag: any) {
    
  }

  saveSkill(skills: Skill[]) {

  }

  toggleShowTable() {
    this.showTable = !this.showTable;
  }

  addExperience() {
    this.resume.experience.push({
      id: '',
      user_id: '',
      job_title: '',
      company: '',
      start_date: null,
      end_date: null,
      employment_type: '',
      location: '',
      location_type: '',
      is_current: false,
      description: '',
      created_at: '',
      created_by: '',
      updated_at: '',
      updated_by: '',
      bullets: []
    });
  }

  addExperienceBullet(expIndex: any): void  {

    const bullet = this.bulletForm[0];

    if (!bullet.description || bullet.tags.length === 0) return;

    // Save the skill
    this.savedBullets.push({ ...bullet });

    // ✅ Clear out the input row instead of adding a new one
    this.bulletForm[0] = { experienceId: '', description: '', tags: [] };
  }

  removeExperienceBullet(expIndex: number, bulletIndex: number) {
    this.resume.experience[expIndex].bullets.splice(bulletIndex, 1);
  }

  removeExperience(index: number) {
    this.resume.experience.splice(index, 1);
  }

  addProject() {

  }

  openTagEditor() {
    // Logic to open tag editor (e.g., toggle a sidebar or dialog)
    console.log('Edit Tags clicked');
  }

  removeLanguage(i: number) {

  }

  addLanguage() {

  }

  removeReference(i: number) {
    
  }

  addReference() {

  }

  removeNote(i: number) {

  }

  addNote() {

  }
}
