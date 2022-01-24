const urls: URLMeta[] = [];

export const getUrl = (short_url: string): URLMeta | undefined =>
  urls.find((url) => {
    url.short_url === short_url;
  });

export class URLMeta {
  readonly short_url: string;
  constructor(readonly original_url: string) {
    this.short_url = urls.length.toString();
  }
}
