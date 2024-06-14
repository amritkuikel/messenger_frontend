export interface User {
    id: number;
    email: string;
    name: string;
    roles: string;
    iat: number;
    exp: number;
    avatar: string;
  }
  export interface Chat {
    id: number;
    name: string | null;
    isGroup: boolean;
    users: User[];
    messages: any[];
  }

  export interface Message{
    chatId:number;
    message:string;
    senderId:number;
  }