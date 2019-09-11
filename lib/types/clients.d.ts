type CypherNodeCommand = string;
export interface CypherNodeTransport {
  get: <T>(command: CypherNodeCommand, payload?: any) => Promise<T>;
  post: <T>(command: CypherNodeCommand, payload: any) => Promise<T>;
}
export interface CypherNodeClient extends CypherNodeTransport {
  token: Promise<string>;
}

export interface ClientAuth {
  userType?: number;
  apiKey?: string;
  token?: string;
  makeToken: Function;
}
export interface CypherNodeClientParam extends ClientAuth {
  transport?: CypherNodeTransport;
  cypherGateway?: string;
}
export interface ClientConfig extends ClientAuth {
  cypherGateway?: string;
  client?: CypherNodeClient;
}
