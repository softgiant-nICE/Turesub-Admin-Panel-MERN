const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const Category = require('../../models/Category');
const Item = require('../../models/Item');
const Update = require('../../models/Update');
const Extra = require('../../models/Extra');
const multer = require('multer')
const async = require('async')

router.post('/category-add', (req, res) => {
    Category.findOne({ name: req.body.name }).then( async (category) => {
        if (category) {
            return res.status(400).json({ category: 'Category already exists' });
        } else {
            const newCategory = new Category({
                name: req.body.name,
                content: req.body.content,
                url: req.body.url
            });
            await newCategory.save()
                // .save()
                // .then(category => {
                    
                // }).catch(err => console.log(err));
            const newUpdate = new Update({
                state: 0,
                message: 'Category ' + newCategory.name + ' added.',
                category_id: newCategory._id,
                data: {
                    name: newCategory.name,
                    content: newCategory.content,
                    url: newCategory.url,
                }
            })
            await newUpdate.save()
            return res.status(200).json({message: 'Category added successfully. Refreshing data...'})

        }
    });
});

router.post('/category-data', (req, res) => {
    Category.find({}).then(category => {
        if (category) {
            return res.status(200).send(category); 
        }
    });
});

router.post('/extra-data', (req, res) => {
    Extra.findOne({}).then(extra => {
        if (extra) {
            return res.status(200).send(extra); 
        }
    });
});

router.post('/category-delete', async (req, res) => {
    const items = await Item.remove({category_id: req.body._id})
    const category = await Category.deleteOne({ _id: req.body._id})
    const newUpdate = new Update({
        state: 2,
        message: 'Category ' + req.body.name + ' deleted.',
        category_id: req.body._id,
        data: {
            name: ' ',
            content: ' ',
            url: ' ',
            sound: ' ',
            }
    })
    await newUpdate.save()
    return res.status(200).json({message: 'Category deleted successfully. Refreshing data...', success: true})
});

router.post('/category-update', (req, res) => {
    const _id = req.body._id;
    Category.findOne({ _id }).then(category => {
        if (category) {
            let update = {'name': req.body.name, 'content': req.body.content, 'url': req.body.url};
            Category.update({ _id: _id}, {$set: update}, async (err, result) => {
                if (err) {
                    return res.status(400).json({ message: 'Unable to update category.' });
                } else {
                    const newUpdate = new Update({
                        state: 1,
                        message: 'Category ' + req.body.name + ' updated.',
                        category_id: req.body._id,
                        data: {
                            name: req.body.name,
                            content: req.body.content,
                            url: req.body.url,
                            sound: ' ',
                            }
                    })
                    await newUpdate.save()
                    return res.status(200).json({ message: 'Category updated successfully. Refreshing data...', success: true });
                }
            });
        } else {
            return res.status(400).json({ message: 'No Category found to update.' });
        }
    });
});

const storage = multer.diskStorage({
    destination: './client/build/upload/images-category',
    filename(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage })

router.post('/category-image', upload.single('file'), (req, res) => {
    // const file = req.file
    // const meta = req.body
    // console.log(req.file)
    return res.status(200).json({image: 'http://192.168.207.167:5000/upload/images-category/' + req.file.filename})
})



module.exports = router;
