import { Component, Input, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { allTypes, Bill, childType, parentType, uiVwBill } from "../models/bill";
import { ConfirmationService, MessageService } from "primeng/api";
import { BillsService } from "../service/bills.service";
import { DbTypesService } from "../../../../../db/db.types.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TypeService } from "../service/type.service";
import { Account } from "../../accounts/account";
import { AccountsService } from "../../accounts/accounts.service";
import { DropdownChangeEvent } from "primeng/dropdown";

@Component({
    selector: 'app-new-edit',
    templateUrl: './new-edit.component.html',
    styleUrl: './new-edit.component.scss'
})
export class NewEditComponent implements OnInit {
    @Input() billDto!: uiVwBill;
    @Output() newBillChange = new EventEmitter<Bill>();

    displayedColumns: string[] = ['include', 'owner', 'accountname', 'transactiondescription', 'balance', 'chargetype', 'payment', 'duedate', 'billtype', 'paymenttype', 'action'];
    dropdownData: allTypes = {
        owner: { name: '', children: [] },
        billType: { name: '', children: [] },
        paymentType: { name: '', children: [] },
        chargeType: { name: '', children: [] }
    };
    billsForm: FormGroup;
    viewAddNewEntity: boolean = false;
    bill: Bill = this.createNewBill();
    newBill: Bill = this.createNewBill();
    newItem: any;
    account: Account = this.createNewAccount();
    newAccount: Account = this.createNewAccount();
    types: parentType[] = [];
    ownerTypes: childType[] = [];
    selectedOwnerType: childType | undefined;
    billTypes: childType[] = [];
    selectedBillType: childType | undefined;
    paymentTypes: childType[] = [];
    selectedPaymentType: childType | undefined;
    frequencyTypes: childType[] = [];
    selectedFrequencyType: childType | undefined;
    priorityTypes: childType[] = [];
    selectedPriorityType: childType | undefined;

    constructor(private billService: BillsService,
                private confirmationService: ConfirmationService,
                private messageService: MessageService,
                private accountService: AccountsService,
                private fb: FormBuilder,
                private typeService: TypeService) {
        this.billsForm = this.fb.group({
            owner: ['', Validators.required],
            accountname: ['', Validators.required],
            transactiondescription: ['', [Validators.required, Validators.email]],
            balance: ['', Validators.required],
            chargetype: ['', Validators.required],
            payment: ['', Validators.required],
            duedate: ['', Validators.required],
            billtype: ['', Validators.required],
            paymenttype: ['', Validators.required],
            isincludedinmonthlypayment: ['', Validators.required],
            selectedOwner: [null, Validators.required],
            newOwner: [''],
        });
    }

    ngOnInit() {
        this.typeService.allTypes$.subscribe(data => {
            this.types = data;
            this.populateDropdownData();
        });
    }

    async ngOnChanges(changes: SimpleChanges): Promise<void> {
        if (changes['billDto'] && changes['billDto'].currentValue.accountpk !== '') {
            await this.fetchAccount();
            await this.fetchBill();
        }
    }

    populateDropdownData() {
        const ownerChild  = this.types.find(f => f.name === 'Owner')?.children;
        if(ownerChild) {
            this.ownerTypes = this.removeDuplicates(ownerChild);
        }

        const billChild  = this.types.find(f => f.name === 'Bill')?.children;
        if(billChild) {
            this.billTypes = this.removeDuplicates(billChild);
        }

        const paymentChild  = this.types.find(f => f.name === 'Payment')?.children;
        if(paymentChild) {
            this.paymentTypes = this.removeDuplicates(paymentChild);
        }

        const frequencyChild  = this.types.find(f => f.name === 'Frequency')?.children;
        if(frequencyChild) {
            this.frequencyTypes = this.removeDuplicates(frequencyChild);
        }

        const priorityChild  = this.types.find(f => f.name === 'Priority')?.children;
        if(priorityChild) {
            this.priorityTypes = this.removeDuplicates(priorityChild);
            this.priorityTypes.sort((a, b) => a.pk - b.pk);
        }
    }

    removeDuplicates(items: childType[]): childType[] {
        const uniqueItems = new Set();
        return items.filter(item => {
            const isDuplicate = uniqueItems.has(item.pk);
            uniqueItems.add(item.pk);
            return !isDuplicate;
        });
    }

    async fetchAccount() {
        try {
            const account = await this.accountService.getAccount(this.billDto.accountpk);
            this.account = account;
            this.newAccount = account;
            this.selectedOwnerType = this.ownerTypes.find(f => f.pk === account.ownerpk);
        } catch (error) {
            console.error('Error fetching account:', error);
        }
    }

    async fetchBill() {
        try {
            const bill = await this.billService.getBill(this.billDto.billspk);
            this.bill = bill;
            this.newBill = bill;
            this.selectedBillType = this.billTypes.find(type => type.pk === bill.typefk);
            this.selectedPaymentType = this.paymentTypes.find(type => type.pk === bill.paymenttypefk);
            this.selectedFrequencyType = this.frequencyTypes.find(type => type.pk === bill.frequencyfk);
            this.selectedPriorityType = this.priorityTypes.find(type => type.pk === bill.priorityfk);
        } catch (error) {
            console.error('Error fetching bill:', error);
        }
    }

    createNewBill(): Bill {
        return {
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
    }

    createNewAccount(): Account {
        return {
            pk: 0,
            name: '',
            url: '',
            ownerpk: 0,
            loginpk: 0,
            updatedby: '',
            updatedon: new Date(),
            createdby: '',
            createdon: new Date()
        };
    }

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    onSubmit() {
        console.log(this.billsForm.value);
    }

    addNewOwner() {
        this.dropdownData.owner.children.push(this.billsForm.value.newOwner);
        this.billsForm.patchValue({ selectedOwner: this.billsForm.value.newOwner });
        this.billsForm.patchValue({ newOwner: '' });
    }

    saveNewEntity() {
        this.newBillChange.emit(this.newBill);
    }

    handleDropdownChange($event: DropdownChangeEvent, targetField: string) {
        (this as any)[targetField] = $event.value.pk;
        this.newBillChange.emit(this.newBill);
        console.log('Selected value:', $event.value);
    }
}
