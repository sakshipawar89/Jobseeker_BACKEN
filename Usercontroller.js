const Application = require('./UserModal');

// POST /applications
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

    if (!applicantType || !coverLetter || !applicantName) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

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

    if (req.file) {
      applicationData.cv = {
        filename: req.file.filename,
        path: req.file.path,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
    } else {
      return res.status(400).json({ message: 'CV file is missing.' });
    }

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

// GET /getapplications
const getApplications = async (req, res) => {
  try {
    const filters = {};
    if (req.query.jobId) filters.jobId = req.query.jobId;

    const applications = await Application.find(filters)
      .sort({ createdAt: -1 })
      .populate({ path: 'jobId', select: 'title company' });

    res.status(200).json(applications);
  } catch (error) {
    console.error('❌ Error fetching applications:', error);
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
};

// PUT /applications/:id/status
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'selected', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updated = await Application.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Application not found' });

    res.status(200).json({ message: 'Status updated', data: updated });
  } catch (error) {
    console.error('❌ Error updating application status:', error);
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};

module.exports = {
  submitApplication,
  getApplications,
  updateApplicationStatus,
};
