import { Router } from "express";
import { deleteDataController } from "../controller/deleteDataController";

const DeleteDatarouter = Router();

DeleteDatarouter.delete("/", deleteDataController);

export default DeleteDatarouter;

