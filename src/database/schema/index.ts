import { appSchema } from "@nozbe/watermelondb/Schema";

import { userSchema } from "./userSchema";

const schemas = appSchema({
  version: 1,
  tables: [
    userSchema
  ]
});

export { schemas }

