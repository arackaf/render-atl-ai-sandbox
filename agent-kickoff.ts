import { execFileSync } from "node:child_process";

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

console.log(availableIssues);
