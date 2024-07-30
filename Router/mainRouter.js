const express = require('express');
const { registerUser, loginUser, authenticateToken, submitAssessment, getAssessmentsByUser, updateAssessment, deleteAssessment } = require('../Controller/main');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/assessment', authenticateToken, submitAssessment);
router.get('/assessments', authenticateToken, getAssessmentsByUser);
router.put('/assessment/:id', authenticateToken, updateAssessment);
router.delete('/assessment/:id', authenticateToken, deleteAssessment);

module.exports = router;
