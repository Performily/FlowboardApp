import axios from 'axios';

const API_BASE_URL = 'https://flowboard-api-zmju.onrender.com';

export class IamApi {

    signIn(signInCommand) {

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