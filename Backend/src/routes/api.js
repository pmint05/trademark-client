const express = require("express");
const { getUser, getWallet } = require("../app/controllers/HomeController");
const { getListSell, getListBuy } = require("../utils/getTransaction");
const router = express.Router();
const { formatDate } = require("../utils/getCurrentDate");
const User = require("../app/models/User");
const { genUsername } = require("../utils/genUsername");
const Transaction = require("../app/models/Transaction");
const { getCurrentCoin } = require("../utils/getCurrentCoin");
const jwt = require('jsonwebtoken');

const secretKey = 'danieldev';


const expiresIn = '24h';

function createToken(payload) {
  console.log(jwt.sign(payload, secretKey, { expiresIn }));
  return jwt.sign(payload, secretKey, { expiresIn });
}

// Middleware 
function checkToken(req, res, next) {
  const token = req.headers['authorization'];
  if (token) {
      jwt.verify(token, secretKey, (err, decoded) => {
          if (err) {
              return res.status(401).json({ success: false, message: 'Invalid token.' });
          } else {
              req.decoded = decoded;
              next();
          }
      });
  } else {
      return res.status(401).json({ success: false, message: 'Tokens not provided.' });
  }
}



router.get("/users", checkToken, async (req, res) => {
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

router.post("/sell/:coin", checkToken, async (req, res) => {
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

router.post("/buy/:coin", checkToken, async (req, res) => {
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

router.post("/user/create", checkToken, async (req, res) => {
  try {
    const exists = await User.findOne({ email: req.body.email });

    if (exists) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    } else {
      const newUser = {
        name: req.body.name,
        username: genUsername(req.body.name),
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: req.body.password,
      };

      const status = await User.create(newUser);
      if (status) {
        return res.json({
          success: true,
          message: "User created successfully!",
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

router.get("/home/settings", (req, res) => {
  return res.json({
    websiteName: "BO Web",
  });
});

router.get("/sell/list", checkToken, async (req, res) => {
  const listSell = await getListSell();
  return res.json(listSell);
});

router.get("/buy/list", checkToken, async (req, res) => {
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
