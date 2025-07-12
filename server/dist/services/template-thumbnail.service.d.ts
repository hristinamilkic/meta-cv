export declare function closePuppeteerBrowser(): Promise<void>;
export declare function generateTemplateThumbnail(html: string, css: string, width?: number, height?: number): Promise<string>;
export declare function generateCVThumbnail(cv: any, template: {
    templateData: {
        html: string;
        css: string;
    };
}, width?: number, height?: number): Promise<string>;
//# sourceMappingURL=template-thumbnail.service.d.ts.map