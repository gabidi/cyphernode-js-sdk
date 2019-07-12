type CypherNodeCommand = string;
export interface CypherNodeTransport {
  get: <T>(command: CypherNodeCommand, payload?: any) => Promise<T>;
  post: <T>(command: CypherNodeCommand, payload: any) => Promise<T>;
}
export interface CypherNodeClient extends CypherNodeTransport {
  makeToken(auth: {
    perm: number;
    api_key: string;
    expiryInSeconds: number;
  }): Promise<string>;
  token: Promise<string>;
}

export interface ClientAuth {
  userType?: number;
  apiKey?: string;
  token?: string;
}
export interface CypherNodeClientParam extends ClientAuth {
  transport?: CypherNodeTransport;
  cypherGateway?: string;
}
export interface ClientConfig extends ClientAuth {
  cypherGateway?: string;
  client?: CypherNodeClient;
}
