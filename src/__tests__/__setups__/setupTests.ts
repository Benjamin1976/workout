declare global {
  var dispatch: (action: any, payload?: any) => void;
  var loadUser: () => void;
  var dbMsg: (...args: any[]) => void;
  var dbMsgLarge: (...args: any[]) => void;
  var configJSON: Record<string, any>;
  var dp: string;
  var DBL: string;
}
