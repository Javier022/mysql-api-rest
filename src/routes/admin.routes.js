const router = require("express").Router();
const { contentAdmin, deleteUser } = require("../controllers/admin.controller");

/**
 * @swagger
 *  tags:
 *    name: Admin
 *    description: routes admin
 */

/**
 * @swagger
 *  /admin:
 *  get:
 *    summary: dashboard admin
 *    tags: [Admin]
 */
router.get("/users", contentAdmin);

/**
 * @swagger
 *  /admin/delete-user/id:
 *  delete:
 *    summary: delete a user by id
 *    tags: [Admin]
 */
router.delete("/delete-user/:id", deleteUser);

module.exports = router;
