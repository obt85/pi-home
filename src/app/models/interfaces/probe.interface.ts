import { Chart } from 'angular-highcharts';
import { Subject } from 'rxjs/Subject';

export interface IProbe {
    id: string;
    location?: ILocation;
    name: string;
    description?: string;
    type: IProbeType;
    gpio: number;
    data?: IProbeData;
    $data?: Subject<IProbeData>;
    errors?: Array<string>;
    charts?: Array<IProbeChart>;
    correctData(): void;
    httpRequest?: string;
}

export interface IPhotoResistor extends IProbe { 
    data?: IPhotoResistorData;
}


export interface IRelay {
    id: string;
    name: string;
    type: IProbeType;
    gpio: number;
    position: number;
    httpRequest: string;
    location?: ILocation;
}

export interface IProbeChart {
    type: IProbeChartType;
    chart: Chart;
}

export enum IProbeChartType {
    History
}

export interface IProbeData {
    history?: Array<IDHTData>;
    current?: IDHTData;
    average?: IDHTData;
    trend?: IDHTData;
    min?: IDHTData;
    max?: IDHTData;
}


export interface IPhotoResistorData {
    history?: Array<IPhotoResistorDataValue>;
    current?: IPhotoResistorDataValue;
    average?: IPhotoResistorDataValue;
    trend?: IPhotoResistorDataValue;
    min?: IPhotoResistorDataValue;
    max?: IPhotoResistorDataValue;
}

export interface IPhotoResistorDataValue {
    date?: Date;
    resistance: number;
}

export interface IDHTData {
    date?: Date,
    temp?: number,
    humidity?: number
}

export enum IProbeType {
    DHT22,
    MINIPIR,
    RELAY,
    PHOTORESISTOR
}

export interface ILocation {
    type: ILocationType;
    name: string;
}

export enum ILocationType {
    Room
}

export interface IRoom {
    x: number;
    y: number;
    cols: number;
    rows: number;
    name: string;
    probes: Array<IProbe>;
    display: string;
}

export interface IFloor {
    name: string;
    rooms: Array<IRoom>;
}

export enum ZoomPeriod {
    All = 0,
    last24Hours = 1,
    today = 2,
    yesterday = 3,
    last48Hours = 4,
    last7Days = 5,
    last30days = 6,
    year = 7
}
