import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "clear trash files",
  { minutes: 1 }, // every minute
  internal.file.deleteTrashFiles
);

export default crons;
