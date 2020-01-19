const mongoose = require("mongoose");
const express = require("express");
const users = require("./routes/api/users");
const bodyParser = require("body-parser");
const passport = require("passport");

const app = express();
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

app.use(passport.initialize());
require("./config/passport")(passport);

app.use("/api/users", users);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
  const user = new User ({
    username: 'SamiSherif',
    password: 'Password'
  })
  user.save();
  res.send('Hello App!')
})

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));