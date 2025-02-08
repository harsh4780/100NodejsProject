// express setup
const express = require("express");
const app = express();

const connect = require("./db/db");
const path = require("path");

const { User, Note } = require("./models");
const isLoggedIn = require("./middleware/user-middleware");

const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");

connect();
app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser());

app.get("/", function (req, res) {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).send("Please fill all the fields");
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.redirect("/");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const createdUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      let token = jwt.sign({ email: createdUser.emaiil }, "SHA256");
      res.cookie("token", token);
      res.send("User created successfully");
    }
  } catch (error) {
    console.error(error);
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).send("Please fill all the fields");
    }
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(401).send("Invalid credentials");
    }

    let isMatch = bcrypt.compareSync(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }

    let token = jwt.sign({ email: existingUser.email }, "SHA256");
    res.cookie("token", token);
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
  }
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

app.get("/profile", isLoggedIn, async (req, res) => {

  const user = await User.findOne({email:req.user.email}).populate("notes");
  console.log(user);
  res.render("index", {user});
});

app.post("/create_notes", isLoggedIn, async (req, res) => {
  const { title, content } = req.body;
  console.log(req.user);
  
  try {
    if (!title || !content) {
      return res.status(400).send("Please fill all the fields");
    }

    const user = await User.findOne({ email: req.user.email });
    
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    const createdNote = await Note.create({
      title,
      content,
      userId: user._id,
    });

    user.notes.push(createdNote._id);

    await user.save();
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
  }
});

app.get("/delete_note/:id", isLoggedIn, async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
    
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }
  const note = await Note.findById(req.params.id);
  if (!note) {
    return res.status(404).send("Note not found");
  }
  await Note.findByIdAndDelete(req.params.id);
  user.notes.pull(req.params.id);
  await user.save();
  res.redirect("/profile");

});

app.get("/edit_note/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  res.render("edit", { note });
})


app.post("/save_note/:id", isLoggedIn, async (req, res) => {
  const { title, content } = req.body;
  const formattedContent = content ? content.toString() : "";

  try {
    if (!title || !content) {
      return res.status(400).send("Please fill all the fields");
    }


    const update = await Note.findByIdAndUpdate(req.params.id, {
      title,
      content:formattedContent,

    }, {new:true});

    res.redirect("/profile");
  } catch (error) {
    console.error(error);
  }
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
