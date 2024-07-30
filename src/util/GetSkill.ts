import { skill } from "../models/skills";

export default async (name: string) => {
  return await skill.findFirstOrThrow({
    where: {
      name: name.toLowerCase(),
    },
  });
};
