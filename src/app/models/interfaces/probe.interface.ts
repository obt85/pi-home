import { Chart } from 'angular-highcharts';
import { Subject } from 'rxjs/Subject';

export interface IProbe {
    id: string;
    location?: ILocation;
    name: string;
    description?: string;
    type: IProbeType;
    gpio?: number;
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

export interface IVmc extends IProbe {
    data?: IVmcData;
}

export interface IVmcData {
    history: Array<IVmcDataValue>;
    current: IVmcDataValue;
    average?: IVmcDataValue;
    trend?: IVmcDataValue;
    min?: IVmcDataValue;
    max?: IVmcDataValue;
}

export interface IVmcDataValue {
    filterRemainingTime?: number;
    etaFanActive?: number;
    currentEtaAirflow?: number;
    bypassLevel?: number;
    humiditeInterieur?: number;
    etaConstantFlowSensorValue?: number;
    supFanActive?: number;
    temperatureExterieurSortie?: number;
    supConstantFlowSensorValue?: number;
    temperatureExterieurEntree?: number;
    qualiSensorPollutionAlert?: number;
    supFanSpeed?: number;
    currentProgramLevel?: string;
    etaFanSpeed?: number;
    supFanVoltage?: number;
    date?: Date;
    temperatureInterieurSortie?: number;
    filterUsedTime?: number;
    humiditeExterieur?: number;
    currentVentilationLevel?: string;
    measuredEtaAirflow?: number;
    measuredSupAirflow?: number;
    targetSupAirflow?: number;
    temperatureInterieurEntree?: number;
    qualiSensorErrorCount?: number;
    etaFanVoltage?: number;
    currentSupAirflow?: number;
    targetEtaAirflow?: number;
    iaq?: number;
    co2?: number;
}

export interface IVmcFilterData {
    key: string;
    label: string;
    checked?: boolean;
    color?: string;
    unit?: string;
    yAxis?: number;
    type?: 'line'|'bar'|'point'|'area';
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
    PHOTORESISTOR,
    VMC
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
