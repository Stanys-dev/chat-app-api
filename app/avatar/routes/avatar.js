const to = require('await-to-js').default;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: './app/avatar/images/'});
const fs = require('fs');
const jwtauth = require('../../helper').tokenValidation;

const Controller = require('../controllers/avatar');

router.post('/', [jwtauth, upload.single('userAvatar')], async (req, res) => {

    const [err, user] = await to(Controller.add(req.user._id, req.file.path, req.file.mimetype));

    if (err) return typeof err === 'string' ? res.status(400).json(err) : res.status(500).json(err.message);
    else user && user.avatar ? res.status(201).json(user) : res.sendStatus(204);

    fs.unlinkSync(req.file.path);
});

router.get('/', [jwtauth], async (req, res) => {
    const [err, avatar] = await to(Controller.get(req.user._id));

    if (err) return typeof err === 'string' ? res.status(400).json(err) : res.status(500).json(err.message);

    avatar ? res.status(200).json(avatar) : res.sendStatus(404);
});


router.delete('/', [jwtauth], async (req, res) => {

    const [err, user] = await to(Controller.delete(req.user._id));

    if (err) return typeof err === 'string' ? res.status(400).json(err) : res.status(500).json(err.message);

    user ? res.status(200).json(user) : res.sendStatus(404);
});

module.exports = router;
