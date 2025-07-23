export interface PopulationData {
    prefCode: number;
    prefName: string;
    data: { 
        year: number; 
        total: number;
        young: number;
        working: number;
        elderly: number;
    }[];
}

export interface Prefecture {
    prefCode: number;
    prefName: string;
}