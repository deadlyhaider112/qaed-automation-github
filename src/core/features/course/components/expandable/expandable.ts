import { Component, AfterViewInit, Input, ViewChild, ElementRef, Renderer2 } from "@angular/core";
@Component({
    selector: "app-expandable",
    templateUrl: "expandable.html",
    styleUrls: ["expandable.scss"]
})
export class CoreCourseExpandableComponent implements AfterViewInit {
    @ViewChild("expandWrapper", { read: ElementRef })
    expandWrapper!: ElementRef;
    @Input("expanded") expanded: boolean = false;
    @Input("expandHeight") expandHeight: string = "300px";
    constructor(public renderer: Renderer2) { }
    ngAfterViewInit() {
        this.renderer.setStyle(this.expandWrapper.nativeElement, "max-height", this.expandHeight);
    }
}