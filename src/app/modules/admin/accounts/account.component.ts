import { AccountService } from './account.service';
import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Account } from 'app/model/account.model';
import { Pagination } from 'app/model/pagination.model';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'app-account',
    templateUrl: 'account.component.html',
    styleUrls: ['account.component.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AccountComponent implements OnInit, AfterViewInit, OnDestroy {
    constructor(
        private _accountSerivce: AccountService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _dialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
    ) { }

    accounts$: Observable<Account[]> = null;

    pagination: Pagination;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    search: string = "";
    selectedAccount: Account | null = null;
    selectedAccountForm: UntypedFormGroup;
    configForm: UntypedFormGroup = null;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    ngOnInit() {
        this.loadAccounts();
        this.builderConfirmForm();
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    activateAccount(id: any) {
        const dialogRef = this._fuseConfirmationService.open(this.configForm.value);
        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                var data = {
                    id: id,
                    isActive: true
                }
                this._accountSerivce.changeAccountStatus(data).subscribe(result => {
                    if (result.status == 200) {
                        this._accountSerivce.getAccounts().subscribe();
                    }
                })
            }
        });
    }

    deactivateAccount(id: any) {
        const dialogRef = this._fuseConfirmationService.open(this.configForm.value);
        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                var data = {
                    id: id,
                    isActive: false
                }
                this._accountSerivce.changeAccountStatus(data).subscribe(result => {
                    if (result.status == 200) {
                        this._accountSerivce.getAccounts().subscribe();
                    }
                })
            }
        });
    }

    // PRIVATE METHOD
    private loadAccounts(): void {
        this._accountSerivce.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: Pagination) => {
                this.pagination = pagination;
                this._changeDetectorRef.markForCheck();
            });
        this.accounts$ = this._accountSerivce.accounts$;
    }

    private builderConfirmForm() {
        // Build the config form
        this.configForm = this._formBuilder.group({
            title: 'Warning',
            message: 'Are you sure you want to change account status for this account?',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:exclamation',
                color: 'warn'
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Change',
                    color: 'warn'
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Cancel'
                })
            }),
            dismissible: true
        });
    }

}
