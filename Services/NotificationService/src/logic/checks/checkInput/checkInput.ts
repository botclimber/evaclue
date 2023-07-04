// generic validator / theres some libs available as alternative

export class EmailClassValidator{
    emailEnforcedExpression: RegExp = /^[\w\.-]+@[\w\.-]+\.\w+$/i;

    async checkEmailFormat(email: string): Promise<boolean>{ return this.emailEnforcedExpression.test(email) }
}
