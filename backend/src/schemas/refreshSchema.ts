import { z } from "zod";

const refreshSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
});

export default refreshSchema;

