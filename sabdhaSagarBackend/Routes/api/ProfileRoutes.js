const express = require('express');
const router = express.Router();
const getUserProfile = require('../../Controllers/authControllers')
const { profileImage } = require('../../Middleware/uploadMiddleware');
const auth = require('../../Middleware/authMiddleware');
const authorizeRole = require('../../Middleware/authorizationMiddleware');
const updateUserProfile = require('../../Controllers/profileControllers')

/**
 * @description To update user profile
 * @api /api/profile/update
 * @access PRIVATE
 * @type PUT
 * @return response
 */
router.put('/update', auth, updateUserProfile);

/**
 * @description To get the authenticated user's profile
 * @api /api/profile/
 * @access PRIVATE
 * @type GET
 * @return response
 */
router.get('/', auth, authorizeRole, profileController.getUserProfile);

/**
 * @description To get all user profiles
 * @api /api/profile/all
 * @access PRIVATE
 * @type GET
 * @return response
 */
router.get('/all', auth, profileController.getAllUserProfiles);

/**
 * @description To get a user profile by ID
 * @api /api/profile/:id
 * @access PRIVATE
 * @type GET
 * @return response
 */
router.get('/:id', auth, profileController.getUserProfileById);

/**
 * @description To delete the authenticated user's profile
 * @api /api/profile/delete
 * @access PRIVATE
 * @type DELETE
 * @return response
 */
router.delete('/delete', auth, profileController.deleteUserProfile);

module.exports = router;