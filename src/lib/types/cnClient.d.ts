interface CyphernodeConfigProp {
  id: number; // '7',
  property: string; // 'wasabi_batchprivatetospender_minanonset',
  value: number; //'21',
  inserted_ts: string; //'2020-05-30 11:58:55'
}
export interface cnClient {
  getConfigProps(): Promise<[CyphernodeConfigProp]>;
  setConfigProp(property: string, value: string): Promise<any>;
}
