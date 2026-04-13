export type DayPlan = {
  day: number;
  title: string;
  activities: string[];
  places: string[];
};

export type BudgetBreakdown = {
  stay: string;
  food: string;
  transport: string;
};

export type ReelIdea = {
  hook: string;
  caption: string;
  hashtags: string[];
};

export type BlogContent = {
  title: string;
  preview: string;
};

export type TravelPlanResponse = {
  dayWisePlan: DayPlan[];
  budgetBreakdown: BudgetBreakdown;
  reelIdeas: ReelIdea[];
  blogContent: BlogContent;
};
