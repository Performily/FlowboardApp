export class SignInResource {

    constructor({id, fullName, email, role, token, temporaryPassword}) {

        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.token = token;
        this.temporaryPassword = temporaryPassword;
    }
}