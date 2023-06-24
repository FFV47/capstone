import axios from "axios";
import { z } from "zod";

export const workerProfilesSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    imgURL: z.string(),
    role: z.string(),
    rating: z.number(),
    reviewCount: z.number(),
    jobsDone: z.number(),
    location: z.string(),
    verifiedID: z.boolean(),
    drivingLicense: z.boolean(),
    about: z.string(),
    lastUpdate: z.string().datetime(),
  })
);

export type WorkerProfiles = z.infer<typeof workerProfilesSchema>;

const workerQuery = {
  queryKey: ["workerQuery"],
  queryFn: async () => {
    const { data } = await axios.get("http://localhost:3000/profiles");
    return workerProfilesSchema.parse(data);
  },
};

export default workerQuery;
