const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/user');

// 4.15: Blog List Expansion, step3
userRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body;

    // 4.16 *: Blog List Expansion, step4
    if (username.length < 3 || password.length < 3) {
        return res.status(400).json({
            error: 'username or password should be longer than 3 letters'
        });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash
    });

    const savedUser = await user.save();

    res.status(201).json({
        userCredential: savedUser
    });
});

userRouter.get('/', async (req, res) => {
    res
        .status(200)
        .json(await User
            .find({})
            .populate('blogs', {
                url: 0,
                __v: 0
            }));
});

userRouter.delete('/:id', async (req, res) => {
    const idToDelete = req.params.id;
    const result = await User.findByIdAndDelete(idToDelete);
    res.status(204).send(result);
});

module.exports = userRouter;