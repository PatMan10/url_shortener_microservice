import { URLs } from "./utils.ts";

export class URLMeta {
  private static id = 0;
  readonly short_url: number;

  constructor(readonly original_url: string) {
    this.short_url = URLMeta.id++;
  }
}

export const exampleUrlMeta = new URLMeta(URLs.GitHubRepo);
const urls: Map<number, URLMeta> = new Map();
urls.set(exampleUrlMeta.short_url, exampleUrlMeta);

export const getUrl = (short_url: number): URLMeta | undefined =>
  urls.get(short_url);

export const addUrl = (urlMeta: URLMeta): void => {
  urls.set(urlMeta.short_url, urlMeta);
};
