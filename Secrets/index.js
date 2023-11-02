//jshint esversion:6
import 'dotenv/config'
import bcrypt from 'bcrypt'
import bodyParser from "body-parser";
import express from "express";
import session from 'express-session'
import pg from "pg";
import passport from 'passport';
import LocalStrategy from 'passport-local'
import GoogleStrategy from 'passport-google-oauth20'

const app = express();
const port = parseInt(process.env.NORMAL_PORT);
const saltRounds = 10;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto' }
}));
app.use(passport.authenticate('session'));
app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
});

db.connect();

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { id: user.id, username: user.username, password: user.password });
    });
});
  
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
});

passport.use(new LocalStrategy(async function verify(username, password, done) {
        try {
            const text = "SELECT * FROM users WHERE username = $1";
            const values = [username];
            const result = await db.query(text, values);
            const user = result.rows[0];
            const match = await bcrypt.compare(password, user.password);
            if (!user) { return done(null, false); }
            if (!match) { return done(null, false); }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs")
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});


app.get("/submit", (req, res) => {
    res.render("submit.ejs");
});

app.get("/logout", (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.get('/secrets', function(req, res, next) {
    if(req.isAuthenticated()){
        res.render("secrets.ejs")        
    } else {
        res.redirect("/login");
    }
});

app.post("/register", async (req, res, next) => {
    bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
        try {
            let hashPassword = hash;
            const text = `INSERT INTO users(username, password) VALUES($1, $2) RETURNING *`;
            const values = [req.body.username, hashPassword];
            const result = await db.query(text, values);

            req.login(result.rows[0], function(err) {
                if (err) { res.redirect("/login") }
                res.redirect('/secrets');
            });

        }  catch (error) {
            console.log("this is an error", error);
            res.render("register.ejs", {error: error});
        }
    });
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/secrets',
    failureRedirect: '/login'
}));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});