export type NumerologyResponse = {
  name: string;
  number: string;
  meaning: {
    personality: NumerologyItem;
    destiny: NumerologyItem;
    lifePath: NumerologyItem;
    soul: NumerologyItem;
    body: NumerologyItem;
    description: string;
  };
};

type NumerologyItem = {
  title: string;
  content: string;
}[];
