const express = require('express');
const ensureLoggedIn = require('../middlewares/ensure_logged_in');
const UserAccount = require('../models/useraccount');
const ToUpCard = require('../models/toupcard');
const Notification = require('../models/notification');
const asyncHandler = require('express-async-handler');
const router = express.Router();

router.use(ensureLoggedIn);

router.use(function(req, res, next){
    res.locals.title = 'Thông Tin Tài Khoản';
    next();
});

router.get('/:id',asyncHandler(async function(req, res) {
    var userId = req.params.id;
    res.render('profile', { userId });
}));

router.post('/photo/:id',asyncHandler(async function(req, res) {
    const datajson = req.body.data;
    const data = await UserAccount.findByCode(req.params.id);
    data.avartar = datajson;
    await data.save();

    let linkimg = `http://localhost:3000/prof/image/${req.params.id}`;
    Notification.update({
        linkimg: linkimg,
    }, {
        where: {
            idUser: req.params.id,
            type: 'wellcome'
        }
    });

    res.redirect('/prof/' + `${req.params.id}`);
}));

//API InfoUser
router.get('/api/:id', asyncHandler(async function(req, res){
    const data = await UserAccount.findByCode(req.params.id);
    res.json(data);
}));

router.get('/image/:id',asyncHandler(async  function(req, res){
    const user = await UserAccount.findByCode(req.params.id);
    var image = user.avartar;
    if(!user || !user.avartar)
    {
        
        res.end('../image/user-bg.png');
    }
    else {
        const im = image.toString().split(",")[1];
        const img = Buffer.from(im, 'base64');
        res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
        });
        res.end(img);
    }
}));

router.post('/api/u/:id', asyncHandler(async function(req, res){
    const data = await UserAccount.findByCode(req.params.id);
    data.fullname = req.body.fullname;
    data.email = req.body.email;
    data.numberphone = req.body.numberphone;
    await data.save();
    res.json(true);
}));

router.post('/to-up-card/:id', asyncHandler(async function(req, res){ 
    const data = await UserAccount.findByCode(req.params.id);

    let totalSurplus = data.surplus;
    data.surplus = (totalSurplus + parseFloat(req.body.denominations));
    await data.save();

    let today = new Date();

    Notification.create({
        idUser:  req.params.id,
        linkimg: `http://localhost:3000/prof/image/${req.params.id}`,
        time: today,
        status: 0,
        type: 'info',
        message: `Bạn vừa hoàn thành thanh toán E-coin! số dư của bạn được cộng thêm <span>+${req.body.denominations}</span> E-coin &#9829;`,
        messbold: '',
    });

    ToUpCard.create({ 
        idUser: req.params.id,
        idCard: req.body.idCard,
        Denominations: req.body.denominations,
        dayTrading: req.body.dayTrading,
        tradingHours: req.body.tradingHours,
    });
    res.json(true);
}));

router.get('/api/to-up-card/:id', asyncHandler(async function(req, res) {
    const data = await ToUpCard.findByIdUser(req.params.id);
    
    res.json(data);
}));

module.exports = router;