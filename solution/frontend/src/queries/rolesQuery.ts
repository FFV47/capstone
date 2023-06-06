import axios from "axios";
import { z } from "zod";

const rolesSchema = z.array(z.string());
export type JobRoles = z.infer<typeof rolesSchema>;

const rolesQuery = {
  queryKey: ["roles"],
  queryFn: async () => {
    const { data } = await axios.get("http://localhost:3000/roles");
    return rolesSchema.parse(data);
  },
};

export default rolesQuery;
