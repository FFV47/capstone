import { readFileSync, writeFileSync } from "fs";

const file = JSON.parse(readFileSync("db.json").toString());
const roles = file.roles;
file.profiles = file.profiles.map((profile) => {
  profile.role = roles[Math.floor(Math.random() * 10)];
  return profile;
});

writeFileSync("db.json", JSON.stringify(file, null, 2));
