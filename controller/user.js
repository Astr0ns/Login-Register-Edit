var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(12);
var connection = require("../config/pool_conexoes");
const flash = require('connect-flash');

const registrarUsuario = async (nome, sobrenome, email, senha) => {
    const senhaHash = await bcrypt.hash(senha, salt);
    const query = "INSERT INTO usuario (nome, sobrenome, email, senha) VALUES ($1, $2, $3, $4)";
    const values = [nome, sobrenome, email, senhaHash];

    const result = await connection.query(query, values);
    return result;
};

const registrarUsu = async (req, res) => {
    const { nome, sobrenome, email, senha } = req.body;
    try {
        await registrarUsuario(nome, sobrenome, email, senha);
        console.log('Registro bem-sucedido!');
        res.redirect('/login');
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.redirect('/register');
    }
};

const loginUsuario = async (email, senha) => {
    const query = "SELECT * FROM usuario WHERE email = $1";
    const values = [email];
    const result = await connection.query(query, values);

    if (result.rows.length === 0) {
        throw new Error("Usuário não encontrado");
    }

    const usuario = result.rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
        throw new Error("Senha incorreta");
    }

    return usuario;
}

module.exports = {
    registrarUsu,
    loginUsuario
};