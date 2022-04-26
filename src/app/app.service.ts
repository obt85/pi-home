import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProbe, IProbeType, ILocationType, IRelay, IPhotoResistor, IVmc } from './models/interfaces/probe.interface';
import { Subject } from 'rxjs/Subject';

export const ROOM_CHAMBRE1 = "Chambre Parents";
export const ROOM_CHAMBRE2 = "Chambre Maho";
export const ROOM_CHAMBRE3 = "Chambre Robin";
export const ROOM_SDB = "SDB";
export const ROOM_CUISINE = "Cuisine";
export const ROOM_BUANDERIE = "Buanderie";
export const ROOM_SAM = "SAM";
export const ROOM_SALON = "Salon";
export const ROOM_HALL = "Hall";
export const ROOM_WC = "WC";
export const ROOM_CAVE1 = "Cave 1 - Chaufferie";
export const ROOM_CAVE2 = "Cave 2";
export const ROOM_CAVE3 = "Cave 3";
export const ROOM_GARAGE = "Garage";
export const ROOM_GRENIER = "Grenier";
export const ROOM_PETIT_SALON = "Petit Salon";
export const ROOM_BUREAU = "Bureau";

@Injectable()
export class AppService {
    private probes: Array<IProbe|IRelay>;

    constructor(private http: HttpClient) { 
        this.probes = [];

        // Sonde 1
        let probe1 = {
            id: "TEMPERATURE_BUREAU",
            name: "sonde1",
            type: IProbeType.DHT22,
            gpio: 12,
            location: {
                name: ROOM_BUREAU,
                type: ILocationType.Room
            },
            description: "Sonde température et humidité.",
            errors: [],
            charts: [],
            data: {},
            $data: new Subject()
        } as IProbe;

        // Sonde 2
        let probe2 = {
            id: "CUISINE",
            name: "sonde2",
            type: IProbeType.DHT22,
            gpio: 18,
            location: {
                name: ROOM_CUISINE,
                type: ILocationType.Room
            },
            description: "Sonde température et humidité.",
            errors: [],
            charts: [],
            data: {},
            $data: new Subject()
        } as IProbe;
        
        // Sonde 3
        let probe3 = {
            id: "SDB",
            name: "sonde3",
            type: IProbeType.DHT22,
            gpio: 21,
            location: {
                name: ROOM_SDB,
                type: ILocationType.Room
            },
            description: "Sonde température et humidité.",
            errors: [],
            charts: [],
            data: {},
            $data: new Subject()
        } as IProbe;
        
        // Sonde 4
        let probe4 = {
            id: "SALON",
            name: "sonde4",
            type: IProbeType.DHT22,
            gpio: 24,
            location: {
                name: ROOM_PETIT_SALON,
                type: ILocationType.Room
            },
            description: "Sonde température et humidité.",
            errors: [],
            charts: [],
            data: {},
            $data: new Subject()
        } as IProbe;
        
        // Sonde 5
        let probe5 = {
            id: "CHAMBRE3",
            name: "sonde5",
            type: IProbeType.DHT22,
            gpio: 25,
            location: {
                name: ROOM_CHAMBRE3,
                type: ILocationType.Room
            },
            description: "Sonde température et humidité.",
            errors: [],
            charts: [],
            data: {},
            $data: new Subject()
        } as IProbe;

        // Sonde 6
        let probe6 = {
            id: "GRENIER",
            name: "sonde6",
            type: IProbeType.DHT22,
            gpio: 6,
            location: {
                name: ROOM_GRENIER,
                type: ILocationType.Room
            },
            description: "Sonde température et humidité.",
            errors: [],
            charts: [],
            data: {},
            $data: new Subject()
        } as IProbe;

        // Sonde 7
        let probe7 = {
            id: "CAVE2",
            name: "sonde7",
            type: IProbeType.DHT22,
            gpio: 19,
            location: {
                name: ROOM_CAVE2,
                type: ILocationType.Room
            },
            description: "Sonde température et humidité.",
            errors: [],
            charts: [],
            data: {},
            $data: new Subject()
        } as IProbe;

        // Sonde 8
        let probe8 = {
            id: "CAVE3",
            name: "sonde8",
            type: IProbeType.DHT22,
            gpio: 26,
            location: {
                name: ROOM_CAVE3,
                type: ILocationType.Room
            },
            description: "Sonde température et humidité.",
            errors: [],
            charts: [],
            data: {},
            $data: new Subject()
        } as IProbe;

        // Sonde 9
        let probe9 = {
            id: "CHAMBRE1",
            name: "sonde9",
            type: IProbeType.DHT22,
            gpio: 13,
            location: {
                name: ROOM_CHAMBRE1,
                type: ILocationType.Room
            },
            description: "Sonde température et humidité.",
            errors: [],
            charts: [],
            data: {},
            $data: new Subject()
        } as IProbe;
        
        // Sonde 10
        let probe10 = {
            id: "BUANDRIE",
            name: "sonde10",
            type: IProbeType.DHT22,
            gpio: 5,
            location: {
                name: ROOM_BUANDERIE,
                type: ILocationType.Room
            },
            description: "Sonde température et humidité.",
            errors: [],
            charts: [],
            data: {},
            $data: new Subject()
        } as IProbe;
		
		// Sonde 11
        let probe11 = {
            id: "HALL",
            name: "sonde11",
            type: IProbeType.DHT22,
            gpio: 9,
            location: {
                name: ROOM_HALL,
                type: ILocationType.Room
            },
            description: "Sonde température et humidité.",
            errors: [],
            charts: [],
            data: {},
            $data: new Subject()
        } as IProbe;

        /**
         * MINI PIR
         */

        // Sonde 1
        let pir1 = {
            id: "PIR_BUREAU",
            httpRequest: '//' + document.location.hostname + ":4201",
            name: "pir1",
            type: IProbeType.MINIPIR,
            gpio: 20,
            location: {
                name: ROOM_BUREAU,
                type: ILocationType.Room
            },
            description: "Détection de mouvement."
        } as IProbe;
		
		// Sonde 2
        let pir2 = {
            id: "PIR_HALL",
            httpRequest: '//' + document.location.hostname + ":4203",
            name: "pir2",
            type: IProbeType.MINIPIR,
            gpio: 11,
            location: {
                name: ROOM_HALL,
                type: ILocationType.Room
            },
            description: "Détection de mouvement."
        } as IProbe;

        /**
         * RELAY
         */
        let relay1 = {
            id: "RELAY_1",
            type: IProbeType.RELAY,
            name: "Relai 1",
            location: {
                name: ROOM_BUREAU,
                type: ILocationType.Room
            },
            gpio: 16,
            httpRequest: '//' + document.location.hostname + ":4202"
        } as IRelay;

         /**
         * PHOTO-RESISTOR
         */
        let photoResistor = {
            id: "PHOTO_RESISTOR",
            type: IProbeType.PHOTORESISTOR,
            name: "photo-resistor",
            location: {
                name: "Photo Resistance",
                type: ILocationType.Room
            },
            gpio: 4,
            description: "Sonde photo résistante.",
            errors: [],
            charts: [],
            data: {}
        } as IPhotoResistor;

        
         /**
         * VMC
         */
          let vmc = {
            id: "VMC",
            type: IProbeType.VMC,
            name: "vmc",
            location: {
                name: "VMC",
                type: ILocationType.Room
            },
            gpio: null,
            description: "VMC",
            errors: [],
            charts: [],
            data: {}
        } as IVmc;
        
        
        this.probes.push(vmc);

        this.probes.push(probe2);
        this.probes.push(probe3);
        this.probes.push(probe1);
        this.probes.push(probe4);
        this.probes.push(probe5);
        this.probes.push(probe10);
		this.probes.push(probe11);
		this.probes.push(probe9);
        this.probes.push(probe6);
        this.probes.push(probe7);
        this.probes.push(probe8);

        this.probes.push(photoResistor);

        this.probes.push(pir1);
		this.probes.push(pir2);

        this.probes.push(relay1);
    }

    public getProbes(): Array<IProbe|IRelay> {
        return this.probes;
    }
}