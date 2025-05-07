import express from 'express';
import { auth, isAdmin } from '../middlewares/authMiddleware.js';
import {
  createThread,
  getThreads,
  getThread,
  addComment,
  getComments,
  toggleLike,
  reportContent,
  moderateContent,
  searchThreads
} from '../controllers/communityController.js';

const router = express.Router();

// Thread routes
router.post('/threads', auth, createThread);
router.get('/threads', getThreads);
router.get('/threads/search', searchThreads);
router.get('/threads/:threadId', getThread);

// Comment routes
router.post('/threads/:threadId/comments', auth, addComment);
router.get('/threads/:threadId/comments', getComments);

// Engagement routes
router.post('/threads/:threadId/like', auth, toggleLike);
router.post('/threads/:threadId/report', auth, reportContent);

// Moderation routes
router.post('/moderate/:contentType/:contentId', [auth, isAdmin], moderateContent);

export default router; 