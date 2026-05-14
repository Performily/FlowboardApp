import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const signInEndpointPath = import.meta.env.VITE_SIGN_IN_ENDPOINT;
const forgotPasswordEndpointPath = import.meta.env.VITE_FORGOT_PASSWORD_ENDPOINT;
const resetPasswordEndpointPath = import.meta.env.VITE_RESET_PASSWORD_ENDPOINT;

export class IamApi extends BaseApi {

    #signInEndpoint;
    #forgotPasswordEndpoint;
    #resetPasswordEndpoint;

    constructor() {

        super();

        this.#signInEndpoint = new BaseEndpoint(this, signInEndpointPath);

        this.#forgotPasswordEndpoint = new BaseEndpoint(
            this,
            forgotPasswordEndpointPath
        );

        this.#resetPasswordEndpoint = new BaseEndpoint(
            this,
            resetPasswordEndpointPath
        );
    }

    signIn(signInCommand) {
        return this.#signInEndpoint.create(signInCommand);
    }

    forgotPassword(forgotPasswordCommand) {
        return this.#forgotPasswordEndpoint.create(forgotPasswordCommand);
    }

    resetPassword(resetPasswordCommand) {
        return this.#resetPasswordEndpoint.create(resetPasswordCommand);
    }
}