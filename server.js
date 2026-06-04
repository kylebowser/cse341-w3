const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const mongodb = require("./dataBase/connect");
//const professionalRoutes = require('./routes/professional');
const base = require("./routes/index");
const swaggerFile = require("./swagger_output.json");
const swaggerUi = require("swagger-ui-express");
const passport = require("passport");
const session = require("express-session");
const GithubStrategy = require("passport-github2").Strategy;
const cors = require("cors");

const port = process.env.PORT || 3000;
const app = express();

app
  .use(bodyParser.json())
  .use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: true,
    }),
  )
  .use(passport.initialize())
  .use(passport.session())

  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Z-Key Authorization",
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    );
    next();
  })
  .use(cors({ methods: ["GET", "POST", "PUT", "UPDATE", "PATCH", "DELETE"] }))
  .use(cors({ origin: "*" }));
//.use("/", require("./routes/index.js"));

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      // User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return done(null, profile);
      // });
    },
  ),
);

process.on("uncaughtException", (err, origin) => {
  console.log(
    process.stderr.fd,
    `Caught exception: ${err}\n` + `Exception origin: ${origin}`,
  );
});

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/", (req, res) => {
  res.send(
    req.session.user !== undefined
      ? `Logged in as ${req.session.user.displayName}`
      : "Logged out",
  );
});

app.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api-docs",
    session: false,
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  },
);

mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.use("/", base);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});

//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// const express = require("express");
// const bodyParser = require("body-parser");
// const session = require("express-session");
// const passport = require("passport");
// const GithubStrategy = require("passport-github2").Strategy;
// const cors = require("cors");
// const swaggerUi = require("swagger-ui-express");
// const swaggerFile = require("./swagger_output.json");
// const mongodb = require("./dataBase/connect");
// const routes = require("./routes/index");

// const port = process.env.PORT || 3000;
// const app = express();

// /* -------------------------------------------
//    1. PASSPORT STRATEGY MUST LOAD FIRST
// -------------------------------------------- */
// passport.use(
//   new GithubStrategy(
//     {
//       clientID: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//       callbackURL: process.env.GITHUB_CALLBACK_URL, // e.g. https://cse341-w3-9c8y.onrender.com/github/callback
//     },
//     function (accessToken, refreshToken, profile, done) {
//       return done(null, profile);
//     },
//   ),
// );

// passport.serializeUser((user, done) => done(null, user));
// passport.deserializeUser((user, done) => done(null, user));

// /* -------------------------------------------
//    2. EXPRESS + SESSION + PASSPORT MIDDLEWARE
// -------------------------------------------- */
// app.use(bodyParser.json());

// app.use(
//   session({
//     secret: "secret",
//     resave: false,
//     saveUninitialized: true,
//   }),
// );

// app.use(passport.initialize());
// app.use(passport.session());

// app.use(
//   cors({ origin: "*", methods: ["GET", "POST", "PUT", "PATCH", "DELETE"] }),
// );

// /* -------------------------------------------
//    3. BASIC ROUTES
// -------------------------------------------- */
// app.get("/", (req, res) => {
//   res.send(
//     req.session.user
//       ? `Logged in as ${req.session.user.displayName}`
//       : "Logged out",
//   );
// });

// /* -------------------------------------------
//    4. GITHUB OAUTH CALLBACK
// -------------------------------------------- */
// app.get(
//   "/github/callback",
//   passport.authenticate("github", {
//     failureRedirect: "/api-docs",
//   }),
//   (req, res) => {
//     req.session.user = req.user;
//     res.redirect("/");
//   },
// );

// /* -------------------------------------------
//    5. CONNECT DB → THEN LOAD ROUTES
// -------------------------------------------- */
// mongodb.initDb((err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     app.use("/", routes);
//     app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

//     app.listen(port, () => {
//       console.log(`Connected to DB and listening on ${port}`);
//     });
//   }
// });
