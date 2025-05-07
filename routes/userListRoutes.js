import express from 'express';
import { auth } from '../middlewares/authMiddleware.js';
import {
  createList,
  addMovieToList,
  removeMovieFromList,
  getUserLists,
  getListDetails,
  updateList,
  deleteList,
  followList,
  unfollowList,
  getPublicLists,
  getFollowedLists,
  getListStats,
  shareList,
  getSharedList
} from '../controllers/userListController.js';

const router = express.Router();

// List management
router.post('/lists', auth, createList);
router.get('/lists', auth, getUserLists);
router.get('/lists/public', getPublicLists);
router.get('/lists/followed', auth, getFollowedLists);

// List operations
router.get('/lists/:listName', auth, getListDetails);
router.put('/lists/:listName', auth, updateList);
router.delete('/lists/:listName', auth, deleteList);
router.get('/lists/:listName/stats', auth, getListStats);

// Movie operations
router.post('/lists/movies', auth, addMovieToList);
router.delete('/lists/:listName/movies/:movieName', auth, removeMovieFromList);

// Following operations
router.post('/lists/:listName/follow', auth, followList);
router.delete('/lists/:listName/follow', auth, unfollowList);

// Sharing operations
router.post('/lists/:listName/share', auth, shareList);
router.get('/shared/:shareId', getSharedList);

export default router; 