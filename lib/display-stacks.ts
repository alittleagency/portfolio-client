export interface StackWidget {
  title: string;
  tagline: string;
}

export interface Stack {
  id: string;
  label: string;
  color: string;
  widgets: StackWidget[];
}

export const STACKS: Stack[] = [
  {
    id: "just-me",
    label: "just me",
    color: "#8B6FE8",
    widgets: [
      { title: "Name What's Happening", tagline: "you feel like garbage. start here." },
      { title: "Regulate First, Decide Later", tagline: "you might be right. but not right now." },
      { title: "The Shame Eraser", tagline: "what you did wasn't a moral failure. it was a moment." },
      { title: "Stop the Spiral", tagline: "it's late. the spiral ends here." },
      { title: "Things That Work", tagline: "what has actually helped. saved." },
      { title: "Permission to Be Done", tagline: "you socialized. you're depleted. you can stop now." },
      { title: "What Went Well Today", tagline: "not journaling. just honest inventory." },
      { title: "Symptom Check", tagline: "how am i actually doing." },
      { title: "Before-You-Reply Pause", tagline: "you're about to reply activated. 30 seconds first." },
    ],
  },
  {
    id: "my-day",
    label: "my day",
    color: "#DAAF2E",
    widgets: [
      { title: "The Launching Pad", tagline: "one physical thing to start." },
      { title: "Day Plan", tagline: "dump your whole day. get it back sorted." },
      { title: "One Hard Thing", tagline: "the task that's been sitting there. script the first move." },
      { title: "Partner Briefing", tagline: "what they need to know — today or this week." },
      { title: "Brain Inbox", tagline: "jot it now. organize never." },
      { title: "Dinner Decider", tagline: "answer the 5pm question at 8am." },
      { title: "Tomorrow Preview", tagline: "just enough so 6am-you isn't blindsided." },
    ],
  },
  {
    id: "this-week",
    label: "this week",
    color: "#1D9E75",
    widgets: [
      { title: "Week at a Glance", tagline: "dump everything you know about this week. get the map back." },
      { title: "Meal Plan + Grocery", tagline: "five nights planned, one list generated." },
      { title: "Kid Schedule Sync", tagline: "every kid, every activity, every pickup. sorted." },
      { title: "Save This Week", tagline: "one good thing before you reset." },
    ],
  },
  {
    id: "right-now",
    label: "right now",
    color: "#D85A30",
    widgets: [
      { title: "Today's Triage", tagline: "your day collapsed. survival version." },
      { title: "Low-Effort Dinner", tagline: "dinner when there is nothing left." },
      { title: "What Do I Need Right Now", tagline: "too tired to decide how to rest. this decides for you." },
      { title: "Shutdown Script", tagline: "force quit the day." },
      { title: "Symptom Check", tagline: "how am i actually doing." },
    ],
  },
  {
    id: "people",
    label: "people",
    color: "#E8399A",
    widgets: [
      { title: "Sort This Text Thread", tagline: "you opened it 9 times. find out what they actually want." },
      { title: "Draft the Reply — 3 Options", tagline: "you know what to say. here's how to say it." },
      { title: "Am I Reading This Right?", tagline: "something feels off. let's look at the actual evidence." },
      { title: "Apology for Late Reply", tagline: "it's been 11 days. the shame makes it harder, not easier." },
      { title: "I Can't Right Now Script", tagline: "this deserves a real reply. you have nothing left today." },
      { title: "The Regretted Text", tagline: "you already sent it. now what?" },
      { title: "Send It or Don't — Gut Check", tagline: "your thumb is hovering. one more read." },
      { title: "The Post-Social Debrief", tagline: "something felt off. let's look at what actually happened." },
      { title: "Who Haven't I Talked To", tagline: "the people you keep meaning to reach." },
      { title: "Just Thinking of You Text", tagline: "low effort. means everything." },
      { title: "We Should Hang — Actually Plan It", tagline: "you've both said it 4 times. this makes it a plan." },
    ],
  },
  {
    id: "my-kids",
    label: "my kids",
    color: "#0B8FA6",
    widgets: [
      { title: "School Scramble", tagline: "everyone out the door. nothing forgotten." },
      { title: "Kid Schedule Sync", tagline: "every kid, every activity, every pickup. sorted." },
      { title: "Teacher Email Draft", tagline: "advocate without that mom energy." },
      { title: "IEP Prep + Questions", tagline: "the meeting is thursday. your brain has not started thinking about it." },
      { title: "Permission Slip Decoder", tagline: "what it actually says and what you actually need to do." },
      { title: "Kid Behavior Translator", tagline: "what just happened and what it probably means." },
      { title: "Delegate to Partner", tagline: "it is their job too. here is how to ask." },
    ],
  },
  {
    id: "dont-lose-this",
    label: "don't lose this",
    color: "#2A7A8C",
    widgets: [
      { title: "The Out-of-Sight Tracker", tagline: "log it when you put it down. find it when your brain has moved on." },
      { title: "What Was I Doing", tagline: "you walked into a room and went blank. this remembers." },
      { title: "Safe Foods by Person", tagline: "what each person will actually eat. including the hard nos." },
      { title: "Things That Work", tagline: "what has actually helped. per person. saved." },
      { title: "Know Each Person", tagline: "everything you know about your people. in one place." },
      { title: "Medical Notes", tagline: "what the doctor said. what's pending. what you can't afford to forget." },
      { title: "Ask the Vault", tagline: "your family's memory. queryable." },
    ],
  },
];
