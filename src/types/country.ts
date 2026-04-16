export type Country = {
  name: {
    common: string;
  };
  flags: {
    png: string;
    svg: string;
  };
  capital?: string[];
  population: number;
  region: string;
};
