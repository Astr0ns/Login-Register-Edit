
var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(12);
var connection = require("../../config/pool_conexoes");
const flash = require('connect-flash');
const app = require('../../app');


router.get("/", async function (req, res) {
    var email = req.session.email;
    res.render("/index", {
        email: email,
        userId: req.session.userId,
        valores: { nome_usu: "", nomeusu_usu: "", email_usu: "", senha_usu: "" },
    });
});

router.get("/Register", async function (req, res) {
    res.render("Register", {
        valores: { nome_usu: "", nomeusu_usu: "", email_usu: "", senha_usu: "" },
    });
});

const registrarUsuario = async (nome_usu, nomeusu_usu, email_usu, senha_usu) => {
    const senhaHash = await bcrypt.hash(senha_usu, salt);
    const query = "INSERT INTO usuarios (nome_usu, nomeusu_usu, email_usu, senha_usu) VALUES (?, ?, ?, ?)";
    const values = [nome_usu, nomeusu_usu, email_usu, senhaHash];

    return new Promise((resolve, reject) => {
        connection.query(query, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

router.get("/Login", async function (req, res) {
    res.render("Login", {
        valores: { email_usu: "", senha_usu: "" },
    });
});

module.exports = router;
