import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./web-alias-hooks.mjs", pathToFileURL(`${import.meta.dirname}/`));
