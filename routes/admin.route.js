const { Router } = require('express');
const router = Router();

const controller = require('../controller/admin.controller');

router.route('').get(controller.list);
router.route('/:admin_seq').get(controller.read);
router.route('/create').post(controller.create);
router.route('/update').post(controller.update);
router.route('/delete').post(controller.delete);
router.route('/get/token').post(controller.getToken);
module.exports = router;