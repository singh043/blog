import express from "express";
import { deleteUser, signout, test, updateUser, getUsers } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get('/test', test);
router.post('/signout', signout);
router.put('/update/:userId', verifyToken, updateUser);
router.get('/getusers', verifyToken, getUsers);
router.delete('/delete/:userId', verifyToken, deleteUser);

export default router;