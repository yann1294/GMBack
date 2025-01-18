export class Role {
    public name: string;
}

export class Identification {
    public file: string;
    public idType: string;

    constructor(file: string, idType: string) {
        // Initialize properties
        this.file = file;
        this.idType = idType;
      }
}
