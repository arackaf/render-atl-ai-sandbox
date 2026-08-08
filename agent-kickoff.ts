import { execFileSync } from "node:child_process";
import { checkbox } from "@inquirer/prompts";

type Issue = {
  number: number;
  title: string;
  body: string;
  blockedBy: {
    nodes: {
      number: number;
      title: string;
      state: string;
    }[];
  };
};

const output = execFileSync("gh", ["issue", "list", "--state", "open", "--limit", "100", "--json", "number,title,body,blockedBy"], {
  encoding: "utf8",
});

const issues: Issue[] = JSON.parse(output);

const availableIssues = issues.filter((issue) => !issue.blockedBy?.nodes?.some((blocker) => blocker.state === "OPEN"));

const selectedIssueIds = await checkbox({
  message: "Select issues to implement:",
  choices: availableIssues.map((issue) => ({
    name: issue.title,
    value: issue.number,
  })),
});

console.log("Selected issue IDs:", selectedIssueIds);
