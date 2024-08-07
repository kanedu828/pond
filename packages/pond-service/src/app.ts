import express, { Application } from "express";
import http from "http";
import { Server } from "socket.io";
import passport from "passport";
import cors from "cors";
import knex from "knex";
import session from "express-session";
import KnexSessionStore from "connect-session-knex";
import registerFishingSocket from "./sockets/fishing";
import getAuthenticationRouter from "./routers/authentication";
import { isLoggedIn, setupAuth } from "./util/middleware";
import PondUserController from "./controller/pondUserController";
import FishingController from "./controller/fishingController";
import PondUserDao from "./dao/pondUserDao";
import FishDao from "./dao/fishDao";
import { getUserRouter } from "./routers/user";
import { pondUserLogger } from "./util/logger";
import cookieParser from "cookie-parser";
import FishingService from "./service/fishingService";
import PondUserService from "./service/pondUserService";

// ----------- Env Variables ----------------
const POND_WEB_URL: string = process.env.POND_WEB_URL ?? "";
const POND_SERVICE_PORT: string = process.env.POND_SERVICE_PORT ?? "";
const SESSION_SECRET: string = process.env.SESSION_SECRET ?? "";

const app: Application = express();
app.use(
  cors({
    origin: POND_WEB_URL,
    credentials: true,
  }),
);

// CORS Headers
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", POND_WEB_URL);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// -------DB Initialization-------
const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.PSQL_CONNECTION_STRING,
  },
  pool: { min: 0, max: 7 },
});

// --------- Knex Session Storage Setup --------------
const ExpressSessionKnexSessionStore = KnexSessionStore(session);
const sessionStorage = new ExpressSessionKnexSessionStore({ knex: db });

// -------- Express Session Setup -----------
const sessionConfig = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Secure flag will be set based on environment
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
  store: sessionStorage,
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sessionConfig.cookie.secure = true; // serve secure cookies
  pondUserLogger.info("Pond Service Start Env: Production");
}

const sessionMiddleware = session(sessionConfig);

// -------------- App middleware -----------------------
app.use(cookieParser()); // Ensure cookie parser is used before passport
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// ----------- Dao setup ---------------
const pondUserDao = new PondUserDao(db);
const fishDao = new FishDao(db);

// ----------- Service Setup --------------------------
const fishingService = new FishingService(pondUserDao, fishDao);
const pondUserService = new PondUserService(pondUserDao, fishDao);

// ----------- Controller Setup --------------------------
const pondUserController = new PondUserController(pondUserService);
const fishingController = new FishingController(fishingService);

// ----------- Setup passport auth ----------------------
setupAuth(pondUserController);

// ----------- Init Server -----------------------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: POND_WEB_URL,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Socket io middleware
const wrap = (middleware: any) => (socket: any, next: any) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));
io.use(wrap(isLoggedIn));

// ---------Init fishing socket ---------------
registerFishingSocket(io, fishingController);

// --------- Register Routers -----------------
app.use("/auth", getAuthenticationRouter(pondUserController));
app.use("/user", getUserRouter(pondUserController));

// --------- Start Server --------------------
server.listen(POND_SERVICE_PORT, () => console.log("Server Running"));

// ----------- Logging -----------------------
pondUserLogger.info("Pond Service Start");
