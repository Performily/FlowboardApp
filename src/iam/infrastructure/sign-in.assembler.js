import {SignInResource} from "./sign-in.resource.js";
import {User} from "../domain/user.entity.js";

export class SignInAssembler {

    static toResourceFromResponse(response) {

        if (response.status !== 200) {
            console.error(`${response.status} ${response.statusText}`);
            return null;
        }

        return new SignInResource(response.data);
    }

    static toEntityFromResource(resource) {

        return new User({
            ...resource
        });
    }
}