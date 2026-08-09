import { run, claudeCode } from "@ai-hero/sandcastle";
import { docker } from "@ai-hero/sandcastle/sandboxes/docker";

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

const output = execFileSync(
  "gh",
  ["issue", "list", "--state", "open", "--limit", "100", "--json", "number,title,body,blockedBy"],
  {
    encoding: "utf8",
  },
);

const issues: Issue[] = JSON.parse(output);

const availableIssues = issues.filter((issue) => !issue.blockedBy?.nodes?.some((blocker) => blocker.state === "OPEN"));

const selectedIssueIds = await checkbox({
  message: "Select issues to implement:",
  choices: availableIssues.map((issue) => ({
    name: issue.title,
    value: issue.number,
  })),
});

const sep = "------------------------------------";

Promise.all(
  selectedIssueIds.map(async (issueId) => {
    run({
      agent: claudeCode("claude-opus-4-6"),
      sandbox: docker(),
      prompt: `Implement gh issue ${issueId}. Commit your changes and push to origin. Open a PR.`,
      branchStrategy: {
        type: "branch",
        branch: `agent/gh-issue-${issueId}`,
        baseBranch: "main",
      },
      logging: {
        type: "stdout",
        verbose: false,
      },
    })
      .then((resp) => `${sep}\n\nIssue ${issueId} completed:\n\n${resp}\n\n${sep}\n\n`)
      .catch((error) => `${sep}\n\nIssue ${issueId} failed: ${error}\n\n${sep}\n\n`);
  }),
).then(() => {
  console.log("All issues completed");
});
