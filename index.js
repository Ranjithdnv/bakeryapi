const express = require("express");

const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
app.use(express.json());
const cors = require("cors");
const morgan = require("morgan");
const webpush = require("web-push");

var jsonParser = bodyParser.json({
  limit: 1024 * 1024 * 10,
  type: "application/json",
});
var urlencodedParser = bodyParser.urlencoded({
  extended: true,
  limit: 1024 * 1024 * 10,
  type: "application/x-www-form-urlencoded",
});
app.use(jsonParser);
app.use(urlencodedParser);
app.use(bodyParser.json());

const Number = require("./models/number");
const Items = require("./models/items");
app.use(cors("https://perupalembakery.onrender.com"));
const apiKeys = {
  publicKey:
    "BB0IrPkMRgdZYW0Y120IhjA21jYbSTIybVO8xp0dxdCS-Qgc34dGP9571wwI4wyK7UkRMj3TSjEt2H1NjCN0x7E",
  privateKey: "ugMp2KfAs_LOy-fH70bz3rHkLbLSZEu2OaaUOf_My7s",
};
webpush.setVapidDetails(
  "mailto:rith8596@gmail.com",
  apiKeys.publicKey,
  apiKeys.privateKey
);
const subDatabse = [
  // {
  //   endpoint:
  //     "https://fcm.googleapis.com/fcm/send/en_Em5-jHJw:APA91bGhtavH2UoFp1YUgQX6Q99MHT7f491jonjKlgcyeWLdqZnGQCQA35rNJZVOCxgAKX8gMH-96mv1wpi21vYf0VJcHNmrizsUcWoszL7mU8RgXjIVRoDJ2dXE92x_GgZ0QiCd2dJ8",
  //   expirationTime: null,
  //   keys: {
  //     p256dh:
  //       "BB0IrPkMRgdZYW0Y120IhjA21jYbSTIybVO8xp0dxdCS-Qgc34dGP9571wwI4wyK7UkRMj3TSjEt2H1NjCN0x7E",
  //     auth: "ugMp2KfAs_LOy-fH70bz3rHkLbLSZEu2OaaUOf_My7s",
  //   },
  // },
];
let message = "";
//-----------------------------------------------
mongoose
  .connect(
    "mongodb+srv://pavankumarmoka:3ccG3rpxQoWOGEJl@expresscluster.gfleory.mongodb.net/Bakery?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("success"));

//------------------

// const protect = async (req, res, next) => {
//   //  Getting token and check of it's there
//   let token;

//   // console.log(req.headers);
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   }
//   console.log(token);
//   if (!token) {
//     res.status(200).json({ user: "null" });
//     // const err = new AppError("You are noin taccess.", 401);
//     // return next(err);
//   }

//   // 2) Verification token
//   const decoded = await promisify(jwt.verify)(token, "secret");
//   console.log(decoded);
//   // 3) Check .lif user still exists
//   const currentUser = await User.findById(decoded.id);
//   if (!currentUser) {
//     const err = new AppError("The user no longer exist.", 400);
//     return next(err);
//   }
//   if (currentUser.changedPasswordAfter(decoded.iat)) {
//     return next(new AppError("User recently e log in again.", 401));
//   }
//   req.user = currentUser;
//   next();
// };

// // create----------------------------
// // -----------------------------------
// app.get("/students", async (req, res) => {
//   console.log(req.body);
//   const Students = await Call.find();
//   try {
//     res.status(200).json(Students);
//   } catch (err) {
//     res.status(500).json(err);
//   }
//   // res.send(req.body)
// });
// //retrieve------------------------------------
// //----------------------------------------
app.post("/itemsadd", async (req, res) => {
  console.log(req.body);
  const newPost = new Items({ item: req.body.item, category: req.body.cat });
  try {
    console.log(req.body);
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err.message);
  }
  // res.send(req.body)
});
//number
app.post("/numberadd", async (req, res) => {
  const newPost = new Number(req.body);
  try {
    console.log(req.body);
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err.message);
  }
  // res.send(req.body)
});
//
app.put("/numberupdate/", async (req, res) => {
  const newPost = await Number.findByIdAndUpdate(
    req.body._id,
    { $set: { dayofarrival: req.body.dayofarrival } },
    { new: true }
  );
  try {
    console.log(req.body);

    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json(err.message);
  }
  // res.send(req.body)
});
//
app.get("/", async (req, res) => {
  try {
    // console.log(req)
    const savedPost = await Items.find();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err.message);
  }
  // res.send(req.body)
});
app.get("/howmuchnumber", async (req, res) => {
  try {
    // console.log(req)
    const savedPost = await Number.find();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err.message);
  }
  // res.send(req.body)
});
//

app.post("/subscribe", async (req, res) => {
  try {
    subDatabse.push(req.body.subscription);
    message = req.body.message;
    console.log(req.body);
    await webpush.sendNotification(subDatabse[0], message);
    webpush.sendNotification(subDatabse[0], "Hello world");
    res
      .json({ status: "Success", message: "Subscription saved!" })
      .catch((err) => {
        err.message;
      });
  } catch {
    (err) => {
      console.log(err.message);
    };
  }
});
// .catch((err) => {
//   console.log(err.message);
// });

app.get("/send-notification", (req, res) => {
  webpush.sendNotification(subDatabse[0], "Hello world");
  res.json({ statue: "Success", message: "Message sent to push service" });
});
//
app.delete("/deleteitems", async (req, res) => {
  try {
    // console.log(req)
    await Items.deleteMany();
    res.status(200).json({ delete: "done" });
  } catch (err) {
    res.status(500).json(err);
  }
});
app.delete("/numberdelete", async (req, res) => {
  try {
    // console.log(req)
    await Number.deleteMany();
    res.status(200).json({ delete: "done" });
  } catch (err) {
    res.status(500).json(err);
  }
});
// app.post("/signup", async (req, res) => {
//   try {
//     console.log(req.body);
//     const user1 = await User.create(req.body);
//     token = jwt.sign({ id: user1._id }, "secret", { expiresIn: 90000 });
//     res.status(201).json({ status: "success", token, user1: { user1 } });
//   } catch (err) {
//     res.status(500).json(err.message);
//   }
// });
// app.post("/login", async (req, res) => {
//   try {
//     // try {
//     const { userId } = req.body;
//     const password = req.body.password;
//     // 1) Check if userId and password exist
//     if (!userId || !password) {
//       // return next(new AppError("Please provide userId and password!", 400));
//     }
//     // 2) Check if user exists && password is correct
//     const user = await User.findOne({ userId }).select("+password");
//     // "userId":"jonfff@gh.io",
//     // "password":"1qwvertzy",
//     // const user = await User.findOne({ userId });
//     // console.log(user)
//     if (!user || !(await user.correctPassword(password, user.password))) {
//       return res.status(200).json({ user: "null" });
//       // return next(new AppError("Incorrect userId or password", 401));
//     }
//     //
//     // 3) If everything ok, send token to client
//     token = jwt.sign({ id: user._id }, "secret", { expiresIn: 900000 });
//     req.headers.authorization = token;
//     console.log(req.headers.authorization);
//     res.status(201).json({ status: "success", token, user1: { user } });
//   } catch (err) {
//     res.status(500).json(err.message);
//   }
// });
//
app.put("/itemsupdate/:_id", async (req, res) => {
  try {
    console.log(req.body);
    const post = await Items.findByIdAndUpdate(
      req.params._id,
      { $push: { classes: req.body.classes } },
      { new: true }
    );
    res.status(200).json(post.classes);
  } catch (err) {
    res.status(500).json(err);
  }
});

//
app.listen(3003, () => {
  console.log("Server is running");
});
