import {ForgotPasswordResource} from "./forgot-password.resource.js";

export class ForgotPasswordAssembler {

    static toResourceFromResponse(response) {

        if (response.status !== 200) {
            console.error(`${response.status} ${response.statusText}`);
            return null;
        }

        return new ForgotPasswordResource(response.data);
    }
}