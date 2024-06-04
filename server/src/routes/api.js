const express = require("express");
const { getUser, getWallet } = require("../app/controllers/HomeController");
const { getListSell, getListBuy } = require("../utils/getTransaction");
const router = express.Router();
const { formatDate } = require("../utils/getCurrentDate");
const User = require("../app/models/User");
const { genUsername } = require("../utils/genUsername");
const Transaction = require("../app/models/Transaction");
const { getCurrentCoin } = require("../utils/getCurrentCoin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const secretKey = "danieldev";

const expiresIn = "24h";

function createToken(payload) {
  console.log(jwt.sign(payload, secretKey, { expiresIn }));
  return jwt.sign(payload, secretKey, { expiresIn });
}

// Middleware
function checkToken(req, res, next) {
  const token = req.headers["authorization"];
  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token." });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Tokens not provided." });
  }
}
// Đăng ký người dùng
router.post("/user/create", async (req, res) => {
  try {
    const exists = await User.findOne({ email: req.body.email });

    if (exists) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    } else {
      // Encrypt password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = {
        name: req.body.name,
        role: "user",
        username: genUsername(req.body.name),
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: hashedPassword,
      };

      const status = await User.create(newUser);
      if (status) {
        // Create token after successful registration
        const token = createToken({
          username: newUser.username,
          role: newUser.role,
        });
        return res.json({
          success: true,
          message: "User created successfully!",
          token, // Return token
        });
      } else {
        return res.json({
          success: false,
          message: "User creation failed!",
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during user creation.",
    });
  }
});

// Đăng nhập người dùng
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; // Thay username bằng email
    const user = await User.findOne({ email }); // Tìm kiếm bằng email

    if (user) {
      // So sánh mật khẩu đã mã hóa
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = createToken({ username: user.username, role: user.role });
        if (user.role === "admin") {
          return res.json({
            success: true,
            message: "Login successfully!",
            role: "admin",
            token,
          });
        } else {
          return res.json({
            success: true,
            message: "Login successfully!",
            role: "user",
            token,
          });
        }
      } else {
        return res.json({
          success: false,
          message: "Invalid credentials!",
        });
      }
    } else {
      return res.json({
        success: false,
        message: "User not found!",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login.",
    });
  }
});

router.post("/user/add-coin/:username", async (req, res) => {
  try {
    const coin = req.body.coin;
    const addCoin = User.findOneAndUpdate(
      { username: req.params.username },
      { wallet: coin },
      { new: true }
    );
    if (addCoin) {
      return res.json({
        success: true,
        message: "Add coin successfully!",
      });
    } else {
      return res.json({
        success: false,
        message: "Add coin failed!",
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "An error occurred during adding coin.",
    });
  }
});
router.get("/users", async (req, res) => {
  try {
    const allUser = await getUser();
    return res.json(allUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving users.",
    });
  }
});
router.post("/user/bank/update/:username", async (req, res) => {
  try {
    const { bankName, bankNumber } = req.body;
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { bankName, bankNumber }
    );
    if (user) {
      return res.json({
        success: true,
        message: "Update bank successfully!",
      });
    } else {
      return res.json({
        success: false,
        message: "Update bank failed!",
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "An error occurred during updating bank.",
    });
  }
});
router.post("/sell/:coin", async (req, res) => {
  try {
    const wallet = await getWallet(req.body.transUsername);
    const total = Number(wallet) + Number(req.body.transAmount);

    const trans = {
      transUsername: req.body.transUsername,
      transNameCoin: req.params.coin,
      transType: "sell",
      transAmount: req.body.transAmount,
      transTime: formatDate(new Date()),
    };

    const status = await Transaction.create(trans);
    const plusMoney = await User.findOneAndUpdate(
      { username: req.body.transUsername },
      { wallet: total.toString() },
      { new: true }
    );

    if (status && plusMoney) {
      return res.json({
        success: true,
        message: "Sold successfully!",
      });
    } else {
      return res.json({
        success: false,
        message: "Sold failed!",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during the sell transaction.",
    });
  }
});

router.post("/buy/:coin", async (req, res) => {
  try {
    const wallet = await getWallet(req.body.transUsername);
    const amount = Number(wallet);

    if (amount >= Number(req.body.transAmount)) {
      const total = amount - Number(req.body.transAmount);
      const trans = await Transaction.create({
        transUsername: req.body.transUsername,
        transNameCoin: req.params.coin,
        transType: "buy",
        transAmount: req.body.transAmount,
        transTime: formatDate(new Date()),
      });

      const degreeWallet = await User.findOneAndUpdate(
        { username: req.body.transUsername },
        { wallet: total.toString() },
        { new: true }
      );

      if (trans && degreeWallet) {
        return res.json({
          success: true,
          message: "Buy coin successfully!",
        });
      } else {
        return res.json({
          success: false,
          message: "Buy coin failed!",
        });
      }
    } else {
      return res.json({
        success: false,
        message: "You do not have enough money!",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during the buy transaction.",
    });
  }
});

router.get("/home/settings", (req, res) => {
  return res.json({
    websiteName: "BO Web",
  });
});

router.get("/sell/list", async (req, res) => {
  const listSell = await getListSell();
  return res.json(listSell);
});

router.get("/buy/list", async (req, res) => {
  const listBuy = await getListBuy();
  return res.json(listBuy);
});

router.get("/coin/list", async (req, res) => {
  getCurrentCoin()
    .then((currentCoin) => {
      if (currentCoin) {
        return res.status(200).json(currentCoin);
      } else {
        return res.json({
          success: false,
          message: "Do not get current coin",
        });
      }
    })
    .catch((err) => {
      return res.json({
        success: false,
        message: "Do not get current coin",
      });
    });
});

module.exports = router;
