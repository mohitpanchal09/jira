import { loginSchema } from "@/validations/login.validations";
import { Hono } from "hono";
import {zValidator} from "@hono/zod-validator"

const app = new Hono()
    .post('/login',zValidator("json",loginSchema),(c)=>{
        return c.json({success:"ok"})
    })

export default app;