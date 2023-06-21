// generic validator / theres some libs available as alternative

export class EmailClassValidator{
    emailEnforcedExpression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    async checkEmailFormat(email: string): Promise<boolean>{ return this.emailEnforcedExpression.test(email) }
}
