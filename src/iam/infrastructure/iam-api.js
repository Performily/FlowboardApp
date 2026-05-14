import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export class IamApi {

    signIn(signInCommand) {

        // MOCK TEMPORAL TB1
        return Promise.resolve({
            status: 200,
            data: {
                id: 1,
                fullName: 'Administrador',
                email: signInCommand.email,
                role: 'RRHH',
                token: 'jwt-demo-token',
                temporaryPassword: false
            }
        });
    }

    forgotPassword(forgotPasswordCommand) {

        return Promise.resolve({
            status: 200,
            data: {
                message: 'Correo enviado correctamente'
            }
        });
    }

    resetPassword(resetPasswordCommand) {

        return Promise.resolve({
            status: 200,
            data: {
                message: 'Contraseña actualizada'
            }
        });
    }
}