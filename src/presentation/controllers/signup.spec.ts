import {SignUpController} from "./signup";

describe('SignUp Controller', () => {
    it('Must return 400 if no name is provided', () => {
        const sut = new SignUpController()
        const httpRequest = {
            body: {
                email: 'email@email.com',
                password: '123',
                passwordConfirmation: '123'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new Error('Missing param: name'))
    })

    it('Must return 400 if no email is provided', () => {
        const sut = new SignUpController()
        const httpRequest = {
            body: {
                name: 'name',
                password: '123',
                passwordConfirmation: '123'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new Error('Missing param: email'))
    })
})