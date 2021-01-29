const to = require('await-to-js').default;
const express = require('express');
const router = express.Router();

const Controller = require('../controllers/user');

router.post('/', async (req, res) => {
    const [err, user] = await to(Controller.create(req.body));

    if (err) return typeof err === 'string' ? res.status(400).json(err) : res.status(500).json(err.message);

    user ? res.status(201).json(user) : res.sendStatus(204);
});

router.get('/', async (req, res) => {
    const [err, users] = await to(Controller.getAll());

    if (err) return res.status(500).json(err.message);

    users.length === 0 ? res.sendStatus(404) : res.status(200).json(users);
});

router.get('/:_id', async (req, res) => {
    const [err, user] = await to(Controller.getOne(req.params._id));

    if (err) return typeof err === 'string' ? res.status(400).json(err) : res.status(500).json(err.message);

    user ? res.status(200).json(user) : res.sendStatus(404);
});

router.put('/:_id', async (req, res) => {
    const [err, user] = await to(Controller.update(req.params._id, req.body));

    if (err) return typeof err === 'string' ? res.status(400).json(err) : res.status(500).json(err.message);

    user ? res.status(200).json(user) : res.sendStatus(204);
});

router.delete('/:_id', async (req, res) => {

    const [err, user] = await to(Controller.delete(req.params._id));

    if (err) return typeof err === 'string' ? res.status(400).json(err) : res.status(500).json(err.message);

    user ? res.status(200).json(user) : res.sendStatus(404);
});

module.exports = router;
