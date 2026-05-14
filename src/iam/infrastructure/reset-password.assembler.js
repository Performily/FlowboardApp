import {ResetPasswordResource} from "./reset-password.resource.js";

export class ResetPasswordAssembler {

    static toResourceFromResponse(response) {

        if (response.status !== 200) {
            console.error(`${response.status} ${response.statusText}`);
            return null;
        }

        return new ResetPasswordResource(response.data);
    }
}