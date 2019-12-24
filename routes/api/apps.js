const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const Category = require('../../models/Category');
const Extra = require('../../models/Extra');
const Item = require('../../models/Item');
const Update = require('../../models/Update');
// const lodash = require('lodash')
const os =  require('os')
const async = require('async')
// const chilkat = require('@chilkat/ck-node10-win64')

router.get('/get_data', async (req, res, next) => {

    let my_json = {
        'categories': [],
        'extras': {}
    }
    // async.waterfall([

    //     ])
   const query1 = Category.find({}, null)
   const categories = await query1.exec()
   if (categories) {
        for(let i=0; i<categories.length; i++) {
            my_json.categories.push({
                '_id': categories[i]._id,
                'name': categories[i].name,
                'url': categories[i].url,
                'content': categories[i].content,
                'items': [],
            })
            const query2 = Item.find({category_id: categories[i]._id})
            const items4 = await query2.exec()
            if (items4) {
                for(let j=0; j<items4.length; j++) {
                    let item_single = {
                        '_id': items4[j]._id,
                        'name': items4[j].name,
                        'content': items4[j].content,
                        'url': items4[j].url,
                        'sound': items4[j].sound,                        
                    }
                    my_json.categories[i].items.push(item_single)
                    }
            }
        }
    }
    const query3 = Extra.find({}, null)
    const extras = await query3.exec()
    if (extras) {
        my_json.extras['_id'] = extras[0]._id
        my_json.extras['name'] = extras[0].name
        my_json.extras['url'] = extras[0].url
        my_json.extras['content'] = extras[0].content
        my_json.extras['items'] = []
        const query4 = Item.find({category_id: extras[0]._id}, null)
        const items4 = await query4.exec()
        if (items4) {
            for(let j=0; j<items4.length; j++) {
                let item_single = {
                    '_id': items4[j]._id,
                    'name': items4[j].name,
                    'content': items4[j].content,
                    'url': items4[j].url,
                    'sound': items4[j].sound,                        
                    }
                my_json.extras.items.push(item_single)
                }
        }
     
    }
    // console.log(my_json)
    return res.status(200).send(my_json)

});

router.get('/get_notification', (req, res, next) => {
    const data = {
        is_success: true,
        errorMessage: null,
        notifications: [],
    }
    Update.find({is_sent: false}, async (err, updates) => {
        if (err) return next(err)
        if (updates.length == 0) {
            data.errorMessage = 'No updated data'
            return res.status(200).send(data)
        }
            for(let i=0; i<updates.length; i++) {
                let single_notification = {
                    _id: updates[i]._id,
                    is_updated: false,
                    message: updates[i].message,
                }
                await data.notifications.push(single_notification)
                await Update.findOne({_id: updates[i]._id}).updateOne({}, {is_sent: true})
            }
        return res.status(200).send(data)
    } )
})

router.post('/update_data', (req, res, next) => {
    console.log(req.body._id)
    Update.findOne({_id: req.body._id}).select(['-message', '-id', '-__v']).then( async (update) => {
        if (update) {
            await update.delete()
            return res.status(200).send(update)
        } else {
            let data = {
                is_success: true,
                errorMessage: 'Not found update data',
                state: -1, 
            }
            return res.status(200).send(data)
        }
    })
})





module.exports = router;
