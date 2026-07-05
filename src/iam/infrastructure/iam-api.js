import axios from 'axios';

const API_BASE_URL = 'http://localhost:5046/api/v1/auth';

export class IamApi {

    async signIn(signInCommand) {
        // Hacemos la petición real por POST enviando el objeto con email y password
        const response = await axios.post(`${API_BASE_URL}/sign-in`, {
            email: signInCommand.email,
            password: signInCommand.password
        });
        
        // Retornamos el formato exacto que tu Store y tus Assemblers esperan recibir
        return {
            status: response.status,
            data: response.data
        };
    }

    // Mantenemos estos simulados temporalmente porque tu Swagger no expone estos endpoints aún
    forgotPassword(forgotPasswordCommand) {
        return Promise.resolve({
            status: 200,
            data: { message: 'Correo enviado correctamente' }
        });
    }

    resetPassword(resetPasswordCommand) {
        return Promise.resolve({
            status: 200,
            data: { message: 'Contraseña actualizada' }
        });
    }
}