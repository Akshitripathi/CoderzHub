const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

router.post('/compile', (req, res) => {
  const { language, code } = req.body;

  let command;
  switch (language) {
    case 'JavaScript':
      command = `node -e "${code.replace(/"/g, '\\"')}"`;
      break;
    case 'Python':
      command = `python -c "${code.replace(/"/g, '\\"')}"`;
      break;
    case 'C':
    case 'Java':
      
      break;
    case 'XML':
      
      break;
    default:
      return res.status(400).send({ output: 'Unsupported language' });
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send({ output: stderr });
    }
    res.send({ output: stdout });
  });
});

module.exports = router;
