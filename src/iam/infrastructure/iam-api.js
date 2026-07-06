import axios from 'axios';

const API_BASE_URL = 'https://flowboardwebservice.onrender.com/api/v1/auth';

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
    async forgotPassword(forgotPasswordCommand) {
        const response = await axios.post(`${API_BASE_URL}/forgot-password`, {
            email: forgotPasswordCommand.email // Enviamos el correo ingresado en el input
        });

        return {
            status: response.status,
            data: response.data
        };
    }

    async resetPassword(resetPasswordCommand) {
        const response = await axios.post(`${API_BASE_URL}/reset-password`, {
            email: resetPasswordCommand.email,
            temporaryPassword: resetPasswordCommand.temporaryPassword,
            newPassword: resetPasswordCommand.newPassword
        });

        return {
            status: response.status,
            data: response.data
        };
    }
}