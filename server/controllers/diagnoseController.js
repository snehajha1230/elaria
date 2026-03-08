// backend/controllers/diagnoseController.js
export const evaluateDiagnosis = (req, res) => {
  const { answers } = req.body; // Array of 9 integers (0-3)

  if (!answers || answers.length !== 9) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const score = answers.reduce((sum, val) => sum + val, 0);
  let result = '';
  let suggestion = '';

  if (score <= 4) {
    result = 'Minimal or No Depression';
    suggestion = 'You seem to be doing okay. Maintain healthy habits!';
  } else if (score <= 9) {
    result = 'Mild Depression';
    suggestion = 'Consider talking to a listener or journaling regularly.';
  } else if (score <= 14) {
    result = 'Moderate Depression';
    suggestion = 'Talking to a helper or professional can be beneficial.';
  } else {
    result = 'Severe Depression';
    suggestion = 'Please consider seeking professional help immediately.';
  }

  res.json({ result, score, suggestion });
};
