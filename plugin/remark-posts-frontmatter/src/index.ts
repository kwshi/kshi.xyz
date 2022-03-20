import * as Z from "zod";
import type * as Unified from "unified";
import * as Chalk from "chalk";

export const schema = Z.object({
  title: Z.string(),
  short: Z.string(),
  tags: Z.array(Z.string()),
});

export interface Frontmatter extends Z.infer<typeof schema> {}

const errorDesc = (issue: Z.ZodIssueOptionalMessage): string => {
  switch (issue.code) {
    case Z.ZodIssueCode.invalid_type:
      return `expected ${issue.expected}, got ${issue.received}`;
    case Z.ZodIssueCode.unrecognized_keys:
      return `unrecognized keys ${JSON.stringify(issue.keys)}`;
    case Z.ZodIssueCode.invalid_union:
    case Z.ZodIssueCode.invalid_enum_value:
    case Z.ZodIssueCode.invalid_arguments:
    case Z.ZodIssueCode.invalid_return_type:
    case Z.ZodIssueCode.invalid_date:
    case Z.ZodIssueCode.invalid_string:
    case Z.ZodIssueCode.too_small:
    case Z.ZodIssueCode.too_big:
    case Z.ZodIssueCode.not_multiple_of:
    case Z.ZodIssueCode.custom:
  }

  return "";
};

const plugin: Unified.Plugin<[]> = () => (_, file) => {
  const result = schema.safeParse(file.data.frontmatter);
  if (!result.success)
    console.error(file.path, Chalk.chalkStderr.redBright(result.error.message));
};

export default plugin;
