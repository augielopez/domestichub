import {Component, Input, Output, EventEmitter, OnInit, ViewChild, ChangeDetectorRef, ElementRef} from '@angular/core';
import {ConfirmationService, MenuItem, MessageService, MegaMenuItem,} from 'primeng/api';
import {ToolbarButtonConfig, ToolbarConfig} from "../models/toolbar-config";
import {FileUpload} from "primeng/fileupload";
import {Table} from "primeng/table";
import {Router, RouterOutlet} from "@angular/router";
import {AccountFormComponent} from "../account-form/account-form.component";

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
  providers: [MessageService]
})
export class DataTableComponent {
  @Input() data: any[] = []; // Input data for the table
  private _selectedData: any[] = []; // Internal property for selected rows

  @Input()
  get selectedData(): any[] {
    return this._selectedData;
  }
  set selectedData(value: any[]) {
    this._selectedData = value;
    this.selectedDataChange.emit(this._selectedData); // Emit changes to the parent
  }
  //@Input() config: ToolbarConfig = { buttons: [] };
  @Input() menuNames: string[] = [];
  @Input() columns: { field: string; header: string; width?: string; filterable?: boolean; filterType?: string }[] = []; // Column configuration
  @Input() globalFilterFields: string[] = []; // Fields for global search
  @Input() title: string = ""; // Show/hide action buttons
  @Input() showPasswordButton: boolean = false; // Toggle for showing password button
  @Input() showActions: boolean = true; // Show/hide action buttons
  @Input() displayField: string = ''; // Field to display in notifications


  @Output() selectedDataChange = new EventEmitter<any[]>(); // For two-way binding
  @Output() rowSelected = new EventEmitter<any>(); // Emits when a row is selected
  @Output() rowUnselected = new EventEmitter<any>(); // Emits when a row is unselected
  @Output() dialogAction = new EventEmitter<{ item: any | null; isEdit: boolean }>(); // Emits when adding/editing an item
  @Output() deleteAction = new EventEmitter<any>(); // Emits when an item is deleted
  @Output() dialogClose = new EventEmitter<void>();
  menuItems: MenuItem[] = [];
  // Password management variables
  isPasswrodDecoded: boolean = false;
  passwordHeader: string = 'Enter PIN';
  password: string = '';
  searchValue: string = '';
  expandedRows: { [key: string]: boolean } = {}; // Tracks expanded rows
  isExpanded: boolean = false;
  routeItems: MenuItem[] = [];
  visible: boolean = false;
  operation: string = '';
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(RouterOutlet) routerOutlet!: RouterOutlet;

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit(){
    this.routeItems = [
      { label: 'Account', routerLink: 'account-form', disabled: false },
      { label: 'Bill', routerLink: 'bill-form', disabled: true },
      { label: 'Credit Card', routerLink: 'credit-card-form', disabled: true },
      { label: 'Warranty', routerLink: 'warranty-form', disabled: true },
    ];

    this.menuItems = [
      {
        label: this.isExpanded ? 'Collapse All' : 'Expand All',
        icon: this.isExpanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right',
        command: () => this.expandAllRows()
      }];

    this.menuNames.forEach((name) => {
      switch (name) {
        case 'New':
          this.menuItems.push({
            label: 'New',
            icon: 'pi pi-fw pi-plus',
            command: () => this.showDialog(null, false)
          });
          break;

        case 'Delete':
          this.menuItems.push({
            label: 'Delete',
            icon: 'pi pi-fw pi-trash',
            disabled: true,
            command: () => this.showDialog(null, false)
          });
          break;

        case 'Import':
          this.menuItems.push({
            label: 'Import',
            icon: 'pi pi-fw pi-file-import',
            command: () => this.triggerFileUpload()
          });
          break;

        case 'Export':
          this.menuItems.push({
            label: 'Export',
            icon: 'pi pi-fw pi-file-export',
            command: () => this.showDialog(null, true)
          });
          break;

        case 'Separator':
          this.menuItems.push({
            separator: true
          });
          break;

        default:
          console.warn(`Unhandled button name: ${name}`);
          break;
      }
    });
  }

  ngAfterViewInit(): void {
    const childComponent = this.routerOutlet.component;

    // Check if the child component has the billStepToggle event
    if (childComponent instanceof AccountFormComponent) {
      childComponent.billStepToggle.subscribe((isEnabled: boolean) => {
        this.routeItems[1].disabled = !isEnabled; // Enable/Disable Bill Details step
      });
    }
  }
  onGlobalFilter(dt: Table, event: Event): void {
    dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  triggerFileUpload() {
    const fileInput = document.querySelector('p-fileupload input[type="file"]') as HTMLElement;
    if (fileInput) {
      fileInput.click(); // Manually trigger the file input click
    } else {
      console.error('File input not found');
    }
  }

  onFileSelected(event: any) {
    console.log('Selected files:', event.files);
  }

  onRowSelect(event: any): void {
    const displayValue = this.displayField && event.data[this.displayField]
        ? event.data[this.displayField]
        : JSON.stringify(event.data); // Fallback to stringify the row

    this.updateMenuItems();
    this.rowSelected.emit(event.data);
    this.messageService.add({
      severity: 'info',
      summary: 'Row Selected',
      detail: `Selected: ${displayValue}`
    });
  }

  onRowUnselect(event: any): void {
    const displayValue = this.displayField && event.data[this.displayField]
        ? event.data[this.displayField]
        : JSON.stringify(event.data); // Fallback to stringify the row

    this.updateMenuItems();
    this.rowUnselected.emit(event.data);
    this.messageService.add({
      severity: 'warn',
      summary: 'Row Unselected',
      detail: `Unselected: ${displayValue}`
    });
  }

  showDialog(item: any | null, isEdit: boolean): void {
    this.dialogAction.emit({ item, isEdit });

    this.visible = true;
    this.operation = isEdit ? 'Edit' : 'Add';
  }

  deleteSelected(item: any): void {
    this.deleteAction.emit(item);
    this.messageService.add({ severity: 'success', summary: 'Deleted', detail: `Deleted: ${item.accountName}` });
  }

  deleteMultipleSelected() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.data = (this.data || []).filter((val) => !this._selectedData?.includes(val));

        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      }
    });
  }

  toggleOverlayPanel(event: Event, overlayPanel: any): void {
    overlayPanel.toggle(event);
    this.isPasswrodDecoded = false;
    this.passwordHeader = 'Enter PIN';
    this.password = '';
  }

  openUrlInNewTab(url: string): void {
    window.open(url, '_blank');
  }

  copyToClipboard(inputElement: HTMLInputElement): void {
    inputElement.select();
    document.execCommand('copy');
    this.messageService.add({ severity: 'info', summary: 'Copied', detail: 'Copied to clipboard' });
  }

  showPassword(input: HTMLInputElement, password: string): void {
    if (input.value === '1027') { // Example PIN
      this.password = atob(password); // Decode Base64 password
      this.isPasswrodDecoded = true;
      this.passwordHeader = 'Password';
      this.messageService.add({ severity: 'info', summary: 'PIN Verified', detail: 'Password Decoded' });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Invalid PIN', detail: 'PIN is incorrect' });
    }
  }

  // Get buttons for the left and right sides dynamically
/*  get leftButtons(): ToolbarButtonConfig[] {
    return this.config.buttons.filter(button => button.position === 'left' && button.visible);
  }*/

/*  get rightButtons(): ToolbarButtonConfig[] {
    return this.config.buttons.filter(button => button.position === 'right' && button.visible);
  }*/


  executeAction(action?: () => void) {
    if (action) {
      action();
    }
  }

  updateMenuItems() {
    this.menuItems.forEach((item) => {
      if (item.label === 'Delete') {
        item.disabled = this.selectedData.length < 2; // Enable only if more than 1 item is selected
      }
    });
  }

  onRowToggle(event: any) {
    const rowKey = event.data.accountName; // Adjust for your dataKey
    this.expandedRows = {}; // Clear all existing expanded rows
    this.expandedRows[rowKey] = true; // Expand the newly toggled row
  }

  expandAllRows() {
    if (!this.isExpanded) {
      this.data.forEach(item => this.expandedRows[item.accountpk] = true);
    } else {
      this.expandedRows = {};
    }
    this.isExpanded = !this.isExpanded;

    this.updateExpandCollapseMenuItem();
  }

  updateExpandCollapseMenuItem() {
    const index = this.menuItems.findIndex(item => item.label === 'Collapse All' || item.label === 'Expand All');
    if (index !== -1) {
      this.menuItems[index] = {
        label: this.isExpanded ? 'Collapse All' : 'Expand All',
        icon: this.isExpanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right',
        command: () => this.expandAllRows()
      };
    }
  }

  closeDialog() {
    this.dialogClose.emit();
    this.visible = false;
    this.router.navigate(['/apps/accounts']);
  }
}
