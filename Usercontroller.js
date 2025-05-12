const Application = require('./UserModal'); // adjust path if needed

// @desc    Submit a new job application
// @route   POST /applications
// @access  Public
const submitApplication = async (req, res) => {
  try {
    const {
      applicantType,
      currentPackage,
      expectedPackage,
      coverLetter,
      jobId,
      applicantName,
    } = req.body;

    // ✅ Basic validation
    if (!applicantType || !coverLetter || !applicantName) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // ✅ Optional logging for debugging
    console.log('📨 Incoming Application:', req.body);
    console.log('📎 Uploaded File:', req.file);

    const applicationData = {
      applicantType,
      applicantName,
      jobId,
      currentPackage: parseFloat(currentPackage) || 0,
      expectedPackage: parseFloat(expectedPackage) || 0,
      coverLetter,
      appliedDate: new Date(),
      status: 'pending',
    };

    // ✅ Handle uploaded CV
    if (req.file) {
      applicationData.cv = {
        filename: req.file.filename,
        path: req.file.path,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
    } else {
      // Optional: reject request if CV is mandatory
      return res.status(400).json({ message: 'CV file is missing.' });
    }

    // ✅ Save to database
    const newApplication = new Application(applicationData);
    await newApplication.save();

    res.status(201).json({
      message: 'Application submitted successfully',
      data: newApplication,
    });

  } catch (error) {
    console.error('❌ Error submitting application:', error);
    res.status(500).json({ message: 'Submission failed', error: error.message });
  }
};

module.exports = { submitApplication };
