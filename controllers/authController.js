const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Bakery = require('../models/Bakery');
const responseHandler = require('../utils/responseHandler');
const { validateEmail, validateRequiredFields } = require('../utils/validation');

const register = async (req, res) => {
  const { email, password, role, name, bakeryName, bakeryAddress } = req.body;

  const validationError = validateRequiredFields(['email', 'password', 'role', 'name'], req.body);
  if (validationError) return responseHandler.error(res, validationError, 400);
  if (!validateEmail(email)) return responseHandler.error(res, 'Invalid email format', 400);
  if (!['customer', 'bakery_manager'].includes(role)) return responseHandler.error(res, 'Invalid role', 400);

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return responseHandler.error(res, 'Email already exists', 400);

    const hashedPassword = await bcrypt.hash(password, 10);
    let bakeryId = null;

    if (role === 'bakery_manager') {
      if (!bakeryName || !bakeryAddress) {
        return responseHandler.error(res, 'Bakery name and address required for bakery manager', 400);
      }
      const bakery = await Bakery.create({ name: bakeryName, address: bakeryAddress });
      bakeryId = bakery.id;
    }

    const user = await User.create({
      email,
      password: hashedPassword,
      role,
      name,
      bakeryId,
    });

    responseHandler.success(res, user, 'Registration successful');
  } catch (error) {
    responseHandler.error(res, error.message, 500);
  }
};