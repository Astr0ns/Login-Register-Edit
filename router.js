var express = require("express");
var user = require("./controller/user");
var router = express.Router();
const bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(12);
var connection = require("./config/pool_conexoes");
const flash = require('connect-flash');

router.get("/", async function (req, res) {
    const email = req.session ? req.session.email : "";
    res.render("pages/index", {
        email: email,
        userId: req.session ? req.session.userId : null,
        valores: { nome: "", sobrenome: "", email: "", senha: "" },
    });
});

router.get("/register", async function (req, res) {
    res.render("pages/register", {
        valores: { nome: "", sobrenome: "", email: "", senha: "" },
    });
});

router.post("/fazerRegistro", user.registrarUsu, async function (req, res) { });

router.get("/login", async function (req, res) {
    res.render("pages/login", {
        valores: { email: "", senha: "" },
    });
});

router.post("/fazerLogin", async function (req, res) {
    const { email, senha } = req.body;
    try {
        const query = "SELECT * FROM usuario WHERE email = $1";
        const values = [email];
        const result = await connection.query(query, values);

        if (result.rows.length === 0) {
            console.log("Usuário não encontrado");
            res.redirect("/login");
            return;
        }

        const usuario = result.rows[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            console.log("Senha incorreta");
            res.redirect("/login");
            return;
        }
        req.session.nome = usuario.nome;
        req.session.sobrenome = usuario.sobrenome;
        req.session.userId = usuario.id;
        req.session.email = usuario.email;

        console.log("Login bem-sucedido!");
        res.redirect("/profile");
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.redirect("/login");
    }
});

module.exports = router;
