import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send("Albums Route");
});

export default router;