import {SignUpController} from "./signup";
import {MissingParamError} from "../errors/missing-param-error";
import {InvalidParamError} from "../errors/invalid-param-error";
import {EmailValidator} from "../protocols/email-validator";

interface SutTypes {
    sut: SignUpController
    emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }

    const emailValidatorStub = new EmailValidatorStub();
    const sut = new SignUpController(emailValidatorStub);
    return {
        sut,
        emailValidatorStub
    }
}

describe('SignUp Controller', () => {
    it('Must return 400 if no name is provided', () => {
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                email: 'email@email.com',
                password: '123',
                passwordConfirmation: '123'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    it('Must return 400 if no email is provided', () => {
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                name: 'name',
                password: '123',
                passwordConfirmation: '123'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    it('Must return 400 if no password is provided', () => {
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                name: 'name',
                email: 'email@email.com',
                passwordConfirmation: '123'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    it('Must return 400 if no password confirmation is provided', () => {
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                name: 'name',
                email: 'email@email.com',
                password: '123',
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })
    it('Must return 400 if an invalid email is provided', () => {
        const {sut, emailValidatorStub} = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
        const httpRequest = {
            body: {
                name: 'name',
                email: 'invalid_email@email.com',
                password: '123',
                passwordConfirmation: '123'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })
})