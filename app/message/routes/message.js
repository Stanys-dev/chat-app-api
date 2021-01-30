const to = require('await-to-js').default;
const express = require('express');
const router = express.Router();

const Controller = require('../controllers/message');

router.post('/', async (req, res) => {
    const [err, message] = await to(Controller.create(req.body.from, req.body.to, req.body.text));

    if (err) return typeof err === 'string' ? res.status(400).json(err) : res.status(500).json(err.message);

    message ? res.status(201).json(message) : res.sendStatus(204);
});

router.get('/', async (req, res) => {
    const [err, messages] = await to(Controller.get(req.query.users, req.query.text));

    if (err) return typeof err === 'string' ? res.status(400).json(err) : res.status(500).json(err.message);

    messages.length === 0 ? res.sendStatus(404) : res.status(200).json(messages);
});

router.put('/:_id', async (req, res) => {
    const [err, message] = await to(Controller.update(req.params._id, req.body.text));

    if (err) return typeof err === 'string' ? res.status(400).json(err) : res.status(500).json(err.message);

    message ? res.status(200).json(message) : res.sendStatus(204);
});

router.delete('/:_id', async (req, res) => {

    const [err, message] = await to(Controller.delete(req.params._id));

    if (err) return typeof err === 'string' ? res.status(400).json(err) : res.status(500).json(err.message);

    message ? res.status(200).json(message) : res.sendStatus(404);
});

module.exports = router;
