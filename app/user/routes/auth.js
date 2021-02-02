const to = require('await-to-js').default;
const express = require('express');
const router = express.Router();
const jwtauth = require('../../helper').tokenValidation;

const Controller = require('../controllers/auth');

router.post('/register', async (req, res) => {
    const [err, user] = await to(Controller.register(req.body));

    if (err) return typeof err === 'string' ? res.status(400).json(err) : res.status(500).json(err.message);

    user ? res.status(201).json(user) : res.sendStatus(204);
});

router.post('/login', async (req, res) => {
    const [err, user] = await to(Controller.login(req.body));

    if (err) return typeof err === 'string' ? res.status(400).json(err) : res.status(500).json(err.message);

    user ? res.status(200).json(user) : res.sendStatus(204);
});

router.post('/logout', [jwtauth], async (req, res) => {
    const [err, blacklist] = await to(Controller.logout(req.user));

    if (err) return typeof err === 'string' ? res.status(400).json(err) : res.status(500).json(err.message);

    blacklist ? res.sendStatus(200) : res.sendStatus(204);
});

module.exports = router;
