import { Observable, ApplicationSettings } from '@nativescript/core';

export class AppStateManager extends Observable {
    private static instance: AppStateManager;

    private _isServiceRunning: boolean = false;
    private _timeLeft: string = "00:00";
    public activeTimerId: any = null;


    constructor() {
        super();
        this._isServiceRunning = ApplicationSettings.getBoolean("isServiceRunning", false);
    }

    static getInstance() {
        if (!AppStateManager.instance) {
            AppStateManager.instance = new AppStateManager();
        }
        return AppStateManager.instance;
    }

    get isServiceRunning(): boolean { return this._isServiceRunning; }
    set isServiceRunning(value: boolean) {
        this._isServiceRunning = value;
        ApplicationSettings.setBoolean("isServiceRunning", value);
        this.notifyPropertyChange("isServiceRunning", value);
    }

    get timeLeft(): string { return this._timeLeft; }
    set timeLeft(value: string) {
        this._timeLeft = value;
        this.notifyPropertyChange("timeLeft", value);
    }
}