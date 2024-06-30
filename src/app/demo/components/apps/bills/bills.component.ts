import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from "@angular/forms";
import { BillsService } from "./service/bills.service";
import { SelectionModel } from "@angular/cdk/collections";
import { ConfirmationService, MessageService } from "primeng/api";
import {Bill, uiVwBill} from "./models/bill";
import { Router } from "@angular/router";
import { Table } from "primeng/table";
import { TypeService } from "./service/type.service";
import {Account} from "../accounts/account";

@Component({
    selector: 'app-bills',
    templateUrl: './bills.component.html',
    styleUrls: ['./bills.component.scss']
})
export class BillsComponent implements OnInit {
    displayedColumns: string[] = ['include', 'owner', 'accountname', 'transactiondescription', 'balance', 'chargetype', 'payment', 'duedate', 'billtype', 'paymenttype', 'action'];
    visible: boolean = false;
    display: boolean = false;
    isLoading: boolean = false;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    bills: uiVwBill[] = [];
    filteredBills: uiVwBill[] = []
    clonedProducts: { [s: string]: uiVwBill } = {};
    operation: string = '';
    selectedBill: uiVwBill = this.createNewBill();
    selection = new SelectionModel<uiVwBill>(true, []);
    newBill: Bill = {
        pk: 0,
        updatedby: '',
        updatedon: new Date(),
        createdby: '',
        createdon: new Date(),
        accountfk: 0,
        priorityfk: 0,
        isactive: false,
        transactiondescription: '',
        frequencyfk: 0,
        duedate: '',
        creditlimit: 0,
        balance: 0,
        payment: 0,
        lastpaid: new Date(),
        acceptedpaymentmethodfks: '',
        isfixed: false,
        typefk: 0,
        paymenttypefk: 0,
        sql: '',
        isincludedinmonthlypayment: false,
        notes: ''
    };
    @ViewChild('filter') filter!: ElementRef;

    constructor(public billsService: BillsService, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router, private typeService: TypeService) { }

    async ngOnInit() {
        const imagePath = 'assets/demo/images/avatar/';
        this.bills = await this.billsService.getBills();
        this.bills.sort((a, b) => b.payment - a.payment);
        this.bills.forEach(bill => {
            bill.ownerImagePath = imagePath + bill.owner + '.png';
        });
        this.setSelection(this.bills);

        this.typeService.getAllTypes();
    }

    createNewBill(): uiVwBill {
        return {
            accountpk: 0,
            billspk: 0,
            owner: '',
            ownerImagePath: '',
            accountname: '',
            transactiondescription: '',
            balance: 0,
            chargetype: '',
            payment: 0,
            duedate: '',
            billtype: '',
            paymenttype: '',
            isincludedinmonthlypayment: false
        };
    }

    isAllSelected() {
        return this.selection.hasValue() && this.selection.selected.length === this.bills.length;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.masterClearSelection() :
            this.masterSetSelection()
    }

    setSelection(bills: uiVwBill[]) {
        bills.forEach(row => {
            if (row.isincludedinmonthlypayment) {
                this.selection.select(row)
            } else {
                this.selection.deselect(row)
            }
        });
    }

    masterClearSelection() {
        this.selection.clear();
        this.bills.forEach(bill => {
            bill.isincludedinmonthlypayment = false;
        });
    }

    masterSetSelection() {
        this.bills.forEach(bill => {
            bill.isincludedinmonthlypayment = true;
            this.selection.select(bill)
        });
    }

    getTotalPayment(): number {
        let totalPayment: number = 0;
        if (this.bills) {
            const calcBills = this.bills.filter(bill => bill.isincludedinmonthlypayment);
            calcBills.forEach(bill => {
                switch (bill.chargetype) {
                    case "Yearly": totalPayment += bill.payment / 12;
                        break;
                    case "Quarterly": totalPayment += bill.payment / 4;
                        break;
                    case "Bi-Monthly": totalPayment += bill.payment / 2;
                        break;
                    case "Bi-Weekly": totalPayment += bill.payment * 2;
                        break;
                    case "Bi-Yearly": totalPayment += bill.payment / 6;
                        break;
                    default:
                        totalPayment += bill.payment;
                }
            });
            return Math.round((totalPayment + Number.EPSILON) * 100) / 100;
        }
        return Math.round((totalPayment + Number.EPSILON) * 100) / 100;
    }

    onRowEditInit(bill: uiVwBill) {
        this.clonedProducts[bill.accountname as string] = { ...bill };
    }

    onRowEditSave(bill: uiVwBill) {
        // Implement save logic here
    }

    onRowEditCancel(bill: uiVwBill, index: number) {
        // Implement cancel logic here
    }

    onRowSelect(event: any) {
        this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: event.accountname });
    }

    onRowUnselect(event: any) {
        this.messageService.add({ severity: 'info', summary: 'Product Unselected', detail: event.data.accountname });
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    showDialog(data: any, isEdit: boolean) {
        this.visible = true;
        this.operation = isEdit ? 'Edit' : 'Add';
        this.selectedBill = isEdit ? data : this.createNewBill();
    }

    async updateBill(newBill: Bill) {
        this.newBill = newBill;
    }

    deleteSelectedProducts(event: any) {
        this.confirmationService.confirm({
            key: 'confirm1',
            message: 'Are you sure to perform this action?',
            accept: async () => {
                await this.billsService.deleteBill(event.pk);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: event.accountname + ' Bill Deleted', life: 3000 });
                this.bills = await this.billsService.getBills();
                this.bills.sort((a, b) => b.payment - a.payment);
                this.bills.forEach(bill => {
                    bill.ownerImagePath = 'assets/demo/images/avatar/' + bill.owner + '.png';
                });
                this.setSelection(this.bills);
            },
            reject: () => {
                console.log('User clicked Cancel');
            }
        });
    }

    editBillTypes() {
        this.router.navigate(['/apps/bills/edit-types']);
    }

    saveBill() {
        this.visible = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Bill Saved', life: 3000 });

        if (this.operation === 'Edit') {
            this.billsService.updateBill(this.newBill).then(r => {
                this.billsService.getBills().then(bills => {
                    this.bills = bills;
                    this.bills.sort((a, b) => b.payment - a.payment);
                    this.bills.forEach(bill => {
                        bill.ownerImagePath = 'assets/demo/images/avatar/' + bill.owner + '.png';
                    });
                    this.setSelection(this.bills);
                });
            });
        } else {
            this.billsService.createBill(this.selectedBill).then(r => {
                this.billsService.getBills().then(bills => {
                    this.bills = bills;
                    this.bills.sort((a, b) => b.payment - a.payment);
                    this.bills.forEach(bill => {
                        bill.ownerImagePath = 'assets/demo/images/avatar/' + bill.owner + '.png';
                    });
                    this.setSelection(this.bills);
                });
            });
        }
    }
}
