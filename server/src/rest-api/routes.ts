import { Express, Router } from "express";
import {
    createUser,
    getUsers,
    getMe,
    login,
    logout,
    logoutAll,
    notifyUsers,
    previewMessage
} from "../core";
import { error404handler, errorHandler, requireAuth, wrapResponse } from "./middleware";

const router = Router();

router.post("/notify-users", requireAuth(), wrapResponse(req =>
    req.commands.execute(notifyUsers, req.body)));

router.post("/preview-message", requireAuth(), wrapResponse(req => 
    req.commands.execute(previewMessage, req.body.message).then(message => ({ message }))));

router.post("/users", /* requireAuth(), */ wrapResponse(req => 
    req.commands.execute(createUser, req.body)));

router.get("/users", requireAuth(), wrapResponse(req =>
    req.commands.execute(getUsers, undefined)));

router.get("/me", requireAuth(), wrapResponse(req =>
    req.commands.execute(getMe, undefined)))
    
router.post("/auth/login", wrapResponse(req =>
    req.commands.execute(login, req.body)));

router.post("/auth/logout", requireAuth(), wrapResponse(req =>
    req.commands.execute(logout, req.accessToken)));

router.post("/auth/logout-all", requireAuth(), wrapResponse(req =>
    req.commands.execute(logoutAll, undefined)));

router.get("/users/:id", wrapResponse(req => req.appServices.users.getById(req.params.id)));
router.get("/users/:id/transactions", wrapResponse(req => req.appServices.transactions.getAllByUser(req.params.id)));

router.post("/users/:id/pay", wrapResponse(req => req.appServices.users.initiatePayment(req.params.id, req.body)));

router.post("/transactions", wrapResponse(req => req.appServices.transactions.createManualTransaction(req.body)));
router.get("/transactions", wrapResponse(req => req.appServices.transactions.getAll()));
router.get("/transactions/provider/:provider/:id",
    wrapResponse(req => req.appServices.transactions.getByProviderId(req.params.provider, req.params.id)));
router.get("/transactions/:id", wrapResponse(req => req.appServices.transactions.getById(req.params.id)));

router.use(errorHandler());
router.use(error404handler("Error not found."));

export { router };
