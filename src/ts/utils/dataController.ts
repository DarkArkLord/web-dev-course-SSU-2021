export class DataController<T> {
    private data: T;
    private getDefaultData: () => T;
    private saveName: string;

    constructor(saveName: string, getDefaultData: () => T) {
        this.saveName = saveName;
        this.getDefaultData = getDefaultData;
    }

    getData(): T {
        return this.data;
    }

    resetGameData(): void {
        this.data = this.getDefaultData();
    }
    saveGameData(): void {
        const dataJson = JSON.stringify(this.data);
        window.localStorage.setItem(this.saveName, dataJson);
    }
    loadGameData(): boolean {
        const savedData = window.localStorage.getItem(this.saveName);
        if (savedData) {
            const parsedData = JSON.parse(savedData) as T;
            this.data = parsedData;
            return true;
        }
        return false;
    }
}