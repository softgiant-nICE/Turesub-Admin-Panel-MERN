const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const Item = require('../../models/Item');
const Category = require('../../models/Category')
const Extra = require('../../models/Extra')
const multer = require('multer')
const async = require('async')

router.post('/item-add', (req, res) => {
    Item.findOne({ name: req.body.name }).then( async (item) => {
        if (item) {
            return res.status(400).json({ item: 'Item already exists' });
        } else {
            const newItem = new Item({
                category_id: req.body.category_id,
                name: req.body.name,
                content: req.body.content,
                url: req.body.url,
                sound: req.body.sound,
            });
            await newItem.save()
            const query1 = Extra.findOne({_id: req.body.category_id})
            const result1 = await query1.exec()
            if (result1) {
                const newUpdate = new Update({
                    state: 3,
                    message: 'Extra item ' + newItem.name + ' added.',
                    extra_id: req.body.category_id,
                    item_id: newItem._id,
                    data: {
                        name: newItem.name,
                        content: newItem.content,
                        url: newItem.url,
                        sound: newItem.sound,
                        }
                })
                await newUpdate.save()
            } else {
                const newUpdate = new Update({
                    state: 6,
                    message: 'Category item ' + newItem.name + ' added.',
                    category_id: req.body.category_id,
                    item_id: newItem._id,
                    data: {
                        name: newItem.name,
                        content: newItem.content,
                        url: newItem.url,
                        sound: newItem.sound,
                        }
                })
                await newUpdate.save()
            }
            return res.status(200).json({message: 'Item added successfully. Refreshing data...'})
        }
    });
});

router.post('/item-data', (req, res, next) => {
    Item.find({category_id: req.body.category_id})
    // .populate('category_id')
    .exec( (err, items) => {
        if (err) return next(err)
        if (items) {
            return res.status(200).send(items);
        }
    });
});

router.post('/item-delete', (req, res) => {
    Item.deleteOne({ _id: req.body._id}).then( async (item) => {
        if (item) {
            const query1 = Extra.findOne({_id: req.body.category_id})
            const result1 = await query1.exec()
            if (result1) {
                const newUpdate = new Update({
                    state: 5,
                    message: 'Extra item ' + req.body.name + ' deleted.',
                    extra_id: req.body.category_id,
                    item_id: req.body._id,
                    data: {
                        name: ' ',
                        content: ' ',
                        url: ' ',
                        sound: ' ',
                        }
                })
                await newUpdate.save()
            } else {
                const newUpdate = new Update({
                    state: 8,
                    message: 'Category item ' + req.body.name + ' deleted.',
                    category_id: req.body.category_id,
                    item_id: req.body._id,
                    data: {
                        name: ' ',
                        content: ' ',
                        url: ' ',
                        sound: ' ',
                        }
                })
                await newUpdate.save()
            }
            return res.status(200).json({message: 'Item deleted successfully. Refreshing data...', success: true})
        }
    });
});

router.post('/item-update', (req, res) => {
    const _id = req.body._id;
    Item.findOne({ _id }).then(item => {
        if (item) {
            let update = {'name': req.body.name, 'content': req.body.content, 'url': req.body.url, 'sound': req.body.sound };
            Item.update({ _id: _id}, {$set: update}, async (err, result) => {
                if (err) {
                    return res.status(400).json({ message: 'Unable to update item.' });
                } else {
                    const query1 = Extra.findOne({_id: req.body.category_id})
                    const result1 = await query1.exec()
                    if (result1) {
                    const newUpdate = new Update({
                        state: 4,
                        message: 'Extra item ' + req.body.name + ' updated.',
                        extra_id: req.body.category_id,
                        item_id: req.body._id,
                        data: {
                            name: req.body.name,
                            content: req.body.content,
                            url: req.body.url,
                            sound: req.body.sound,
                            }
                    })
                        await newUpdate.save()
                    } else {
                        const newUpdate = new Update({
                        state: 7,
                        message: 'Category item ' + req.body.name + ' updated.',
                        category_id: req.body.category_id,
                        item_id: req.body._id,
                        data: {
                            name: req.body.name,
                            content: req.body.content,
                            url: req.body.url,
                            sound: req.body.sound,
                            }
                    })
                        await newUpdate.save()
                    }
                    return res.status(200).json({ message: 'Item updated successfully. Refreshing data...', success: true });
                }
            });
        } else {
            return res.status(400).json({ message: 'No Item found to update.' });
        }
    });
});
//image upload
let sound_date = Date.now()
const storage = multer.diskStorage({
    destination: './client/build/upload/items',
    filename(req, file, cb) {
        cb(null, file.fieldname + '-' + sound_date + '-' + file.originalname)
    }
})

const upload = multer({ storage })

router.post('/item-image', upload.single('file'), (req, res) => {
    // const file = req.file
    // const meta = req.body
    return res.status(200).json({image: 'http://192.168.207.167:5000/upload/items/' + req.file.filename})
})

//sound upload
router.post('/item-sound', upload.single('file'), (req, res) => {
    // const file = req.file
    // const meta = req.body
    // console.log(req.file)
    return res.status(200).json({sound: 'http://192.168.207.167:5000/upload/items/' + req.file.fieldname + '-' + sound_date + '-' + req.file.originalname})
})


module.exports = router;
