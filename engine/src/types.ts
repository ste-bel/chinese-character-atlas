export interface Entry {
  id: string | null;
  type: string | null;
  hanzi: string | null;
  pinyin: string | null;
  title: string;
  source: string;
  url: string;
  linksTo: string[];
}
