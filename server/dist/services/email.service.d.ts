declare class EmailService {
    private transporter;
    constructor();
    sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;
}
export declare const emailService: EmailService;
export {};
//# sourceMappingURL=email.service.d.ts.map