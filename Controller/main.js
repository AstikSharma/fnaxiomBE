const jwt = require('jsonwebtoken');
const User = require('../Model/users');
const Assessment = require('../Model/assessment');

const secretKey = 'your_secret_key';

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Authentication failed!' });
    }

    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful!', token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, secretKey, (err, user) => { // Use the correct secretKey
      if (err) {
        console.error('Token verification error:', err);
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  };
  

const submitAssessment = async (req, res) => {
    try {
      const userId = req.user.id; // Extract user ID from the authenticated token
      const { responses } = req.body;
  
      // Validate the request data
      if (!responses || typeof responses !== 'object') {
        return res.status(400).json({ error: 'Invalid request data' });
      }
  
      // Save the assessment
      const assessment = new Assessment({
        userId,
        responses
      });
      await assessment.save();
  
      res.status(200).json({ message: 'Assessment submitted successfully!' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  

const createAssessment = async (req, res) => {
    const { userId } = req.user;
    const { responses } = req.body;
  
    try {
      const assessment = new Assessment({ userId, responses });
      await assessment.save();
      res.status(201).json({ message: 'Assessment created successfully!', assessment });
    } catch (error) {
      res.status(400).json({ error: 'Failed to create assessment' });
    }
  };
  
  // Retrieve an assessment by ID
const getAssessment = async (req, res) => {
    const { id } = req.params;
  
    try {
      const assessment = await Assessment.findById(id);
      if (!assessment) return res.status(404).json({ error: 'Assessment not found' });
      res.status(200).json(assessment);
    } catch (error) {
      res.status(400).json({ error: 'Failed to retrieve assessment' });
    }
  };
  
  // Update an existing assessment
const updateAssessment = async (req, res) => {
    const { id } = req.params;
    const { responses } = req.body;
  
    try {
      const assessment = await Assessment.findByIdAndUpdate(id, { responses }, { new: true });
      if (!assessment) return res.status(404).json({ error: 'Assessment not found' });
      res.status(200).json({ message: 'Assessment updated successfully!', assessment });
    } catch (error) {
      res.status(400).json({ error: 'Failed to update assessment' });
    }
  };
  
  // Delete an assessment
const deleteAssessment = async (req, res) => {
    const { id } = req.params;
  
    try {
      const assessment = await Assessment.findByIdAndDelete(id);
      if (!assessment) return res.status(404).json({ error: 'Assessment not found' });
      res.status(200).json({ message: 'Assessment deleted successfully!' });
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete assessment' });
    }
  };

module.exports = { registerUser, loginUser, authenticateToken,createAssessment, updateAssessment, getAssessment, deleteAssessment, submitAssessment };
