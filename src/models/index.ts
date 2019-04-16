export class Car {
    id: number = 0;
    mark: string = '';
    color: string = '';
    model: string = '';
    user: User = {id: 0, name: ''};
}

export class User {
    constructor(public id: number, public name?: string){}
}

export interface User {
    id: number;
    name?: string;
    email?: string;
    password?: string;
}
