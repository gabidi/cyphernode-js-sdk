type CypherNodeCommand = string;
export interface CypherNodeTransport {
  get: <T>(command: CypherNodeCommand, payload?: any) => Promise<T>;
  post: <T>(command: CypherNodeCommand, payload: any) => Promise<T>;
}
export interface CypherNodeHttpTransport extends CypherNodeTransport {
  token: Promise<string>;
}
export interface CypherNodeMatrixTransportParam {
	roomId:string;
  client? : any; // TOOD matrixClient
  emitter? : any;
}
export interface CypherNodeHTTPTransportParam {
  gatewayUrl?: string;
  auth?: Function
}
export interface ClientConfig {
  transport?: CypherNodeTransport;
}
