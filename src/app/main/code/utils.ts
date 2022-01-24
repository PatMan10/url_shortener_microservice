// urls
export enum URLPlaceHolder {
  SHORT_URL = ":short_url?",
}

export class URLs {
  static readonly WILD = "*";
  static readonly INDEX = "/";
  static readonly GET_SHORT_URL = `/api/shorturl/${URLPlaceHolder.SHORT_URL}`;
  static readonly POST_SHORT_URL = `/api/shorturl`;
  static readonly getShortUrl = (url?: string) =>
    URLs.GET_SHORT_URL.replace(URLPlaceHolder.SHORT_URL, url || "");
}

export class ErrorMessages {
  static readonly INTERNAL_SERVER_ERROR =
    "Uh oh, some unexpected error ocurred...";
  static readonly INVALID_URL = "invalid url";
}

// logger
class Logger {
  info(...data: unknown[]) {
    console.info(...data);
  }
  warn(...data: unknown[]) {
    console.warn(...data);
  }
  error(...data: unknown[]) {
    console.error(...data);
  }
}
export const logger = new Logger();
