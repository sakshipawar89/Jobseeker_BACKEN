const express = require('express');
const router = express.Router();

// Controllers
const controller = require('./control');
const jobcontroller = require('./jobcontroller');


// Multer upload middleware
const upload = require('./fileupload');

// -----------------------
// 🔐 Authentication Routes
// -----------------------
router.post('/register', controller.newuser);
router.post('/login', controller.checkLogin);
router.get('/validuser', controller.verifyToken, controller.validUser);

// -----------------------
// 📄 Application Routes
// -----------------------

const {
    submitApplication,
    getApplications,
    updateApplicationStatus,
  } = require('./Usercontroller');

  
  router.post('/applications', upload.single('cv'), submitApplication);
  router.get('/getapplications', getApplications);
  router.put('/applications/:id/status', updateApplicationStatus);
// -----------------------
// 💼 Job Management Routes
// -----------------------
router.get('/getdatajobs', jobcontroller.getJobs);
router.get('/getdatajobs/:id', jobcontroller.getJobById);
router.post('/postdatajobs', jobcontroller.createJob);
router.put('/updatejobs/:id', jobcontroller.updateJob);
router.delete('/deletejobs/:id', jobcontroller.deleteJob);

module.exports = router;
