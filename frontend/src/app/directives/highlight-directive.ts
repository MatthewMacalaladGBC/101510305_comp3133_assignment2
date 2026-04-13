import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appHighlight]'
})
export class HighlightDirective {
    @Input() appHighlight: string = '#e4e4e4';

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    @HostListener('mouseenter') onMouseEnter() {
        this.setCellBackgrounds(this.appHighlight || '#e4e4e4');
        this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.setCellBackgrounds('');
    }

    private setCellBackgrounds(color: string) {
        const cells = this.el.nativeElement.querySelectorAll('td');
        cells.forEach((cell: HTMLElement) => {
            this.renderer.setStyle(cell, 'background-color', color);
        });
    }
}