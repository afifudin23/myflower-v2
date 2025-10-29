import { z, type TypeOf } from "zod";

export const create = z.object({
    id: z.string(),
    rating: z.number(),
    comment: z.string(),
});

export type CreateType = TypeOf<typeof create>;