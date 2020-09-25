import { Component, OnInit, ViewChild } from '@angular/core';
import { GridsterComponent } from 'angular-gridster2/dist/gridster.component';
import { AppService, ROOM_GARAGE, ROOM_CAVE1, ROOM_CAVE2, ROOM_CAVE3, ROOM_CHAMBRE1, ROOM_HALL, ROOM_SALON, ROOM_SAM, ROOM_CHAMBRE2, ROOM_CHAMBRE3, ROOM_BUANDERIE, ROOM_SDB, ROOM_CUISINE, ROOM_WC, ROOM_GRENIER, ROOM_BUREAU, ROOM_PETIT_SALON } from '../../app.service';
import { IProbe, IFloor, IRelay } from '../../models/interfaces/probe.interface';
import { GridsterConfig } from 'angular-gridster2/dist/gridsterConfig.interface';

@Component({
    selector: 'pih-home-plan',
    templateUrl: 'home-plan.component.html',
    styleUrls: ['home-plan.component.scss']
})

export class HomePlanComponent implements OnInit {
    @ViewChild("gridster") gridster: GridsterComponent;
    public options: GridsterConfig;
    public floors: Array<IFloor>;
    public selectedFloors: Array<IFloor>;
    public probes: Array<IProbe|IRelay>;

    constructor(private appService: AppService) {
        this.options = {
            gridType: 'fit', // 'fit' will fit the items in the container without scroll;
            mobileBreakpoint: 350,
            // fixedColWidth: 50, // fixed col width for gridType: 'fixed'
            // fixedRowHeight: 50, // fixed row height for gridType: 'fixed'
            minCols: 17, // minimum amount of columns in the grid
            maxCols: 20, // maximum amount of columns in the grid
            minRows: 9, // minimum amount of rows in the grid
            maxRows: 10, // maximum amount of rows in the grid
            margin: 5,  // margin between grid items
            outerMargin: true,  // if margins will apply to the sides of the container
            // draggable : { enabled: true },
            // resizable : { enabled: true }
        };

        this.probes = this.appService.getProbes();
        this.selectedFloors = [];
    }

    ngOnInit() { 
        /**
         * PROBES
         */
        let cuisine = this.probes.find(p => p.id == "CUISINE");
        let sam = this.probes.find(p => p.id == "SAM");
        let sdb = this.probes.find(p => p.id == "SDB");
        let chambre1 = this.probes.find(p => p.id == "CHAMBRE1");
        let wc = this.probes.find(p => p.id == "WC");
        let buandrie = this.probes.find(p => p.id == "BUANDRIE");
        let chambre2 = this.probes.find(p => p.id == "CHAMBRE2");
        let chambre3 = this.probes.find(p => p.id == "CHAMBRE3");
        let hall = this.probes.find(p => p.id == "HALL");

        let cave1 = this.probes.find(p => p.id == "CAVE1");
        let cave2 = this.probes.find(p => p.id == "CAVE2");
        let cave3 = this.probes.find(p => p.id == "CAVE3");

        let bureau = this.probes.find(p => p.id == "TEMPERATURE_BUREAU");
        let salon = this.probes.find(p => p.id == "SALON");
        let grenier = this.probes.find(p => p.id == "GRENIER");

        /**
         * PIRS
         */
        let bureauPIR = this.probes.find(p => p.id == "PIR_BUREAU");
		let hallPIR = this.probes.find(p => p.id == "PIR_HALL");

        /**
         * RELAYS
         */
        let relay_1 = this.probes.find(p => p.id == "RELAY_1");

        /**
         * PHOTO RESISTOR
         */
        let photoResistor = this.probes.find(p => p.id == "PHOTO_RESISTOR");
        

        let floor_0 = {
            name: "Caves",
            rooms: [
                { "cols": 12, "rows": 5, "y": 0, "x": 0 , "name": ROOM_GARAGE, "probes": [], "display": "small"}, 
                { "cols": 4, "rows": 4, "y": 5, "x": 0 , "name": ROOM_CAVE1, "probes": [], "display": "small"}, 
                { "cols": 4, "rows": 4, "y": 5, "x": 4 , "name": ROOM_CAVE2, "probes": [cave2], "display": "small"}, 
                { "cols": 4, "rows": 4, "y": 5, "x": 8 , "name": ROOM_CAVE3, "probes": [cave3], "display": "small"}, 
            ]
        }  as IFloor;

        let floor_1 = {
            name: "Rez-de-chaussée",
            rooms: [
                { "cols": 4, "rows": 4, "y": 0, "x": 0 , "name": ROOM_CHAMBRE1, "probes": [chambre1], "display": "small"}, 
                { "cols": 10, "rows": 1, "y": 4, "x": 0 , "name": ROOM_HALL, "probes": [hall, hallPIR], "display": "small inline", "displayInline": true}, 
                { "cols": 3, "rows": 4, "y": 5, "x": 0 , "name": ROOM_SALON, "probes": [relay_1], "display": "small"}, 
                { "cols": 5, "rows": 4, "y": 5, "x": 3 , "name": ROOM_SAM, "probes": [], "display": "small"}, 
                { "cols": 4, "rows": 4, "y": 0, "x": 4 , "name": ROOM_CHAMBRE2, "probes": [], "display": "small"}, 
                { "cols": 4, "rows": 4, "y": 0, "x": 8 , "name": ROOM_CHAMBRE3, "probes": [chambre3], "display": "small"}, 
                { "cols": 4, "rows": 2, "y": 7, "x": 8 , "name": ROOM_BUANDERIE, "probes": [buandrie], "display": "small inline"}, 
                { "cols": 2, "rows": 3, "y": 4, "x": 10 , "name": ROOM_SDB, "probes": [sdb], "display": "small"}, 
                { "cols": 5, "rows": 9, "y": 0, "x": 12, "name": ROOM_CUISINE, "probes": [cuisine], "display": "small" },
                { "cols": 1, "rows": 1, "y": 5, "x": 9 , "name": ROOM_WC, "probes": [], "display": "mini" }
            ]
        } as IFloor;

        let floor_2 = {
            name: "1er étage",
            rooms: [
                { "cols": 9, "rows": 7, "y": 1, "x": 0 , "name": ROOM_GRENIER, "probes": [grenier], "display": "small"}, 
                { "cols": 3, "rows": 7, "y": 1, "x": 9, "name": ROOM_BUREAU, "probes": [bureau, bureauPIR], "display": "small" },
                { "cols": 5, "rows": 7, "y": 1, "x": 12 , "name": ROOM_PETIT_SALON, "probes": [salon, photoResistor], "display": "small" }
            ]
        }  as IFloor;

        this.floors = [floor_2, floor_1, floor_0];

        this.selectFloor(floor_1);
    }

    public selectFloor(floor: IFloor): void {
        this.selectedFloors = [floor];
    }

    public selectAllFloors(): void {
        this.selectedFloors = this.floors;
    }
}