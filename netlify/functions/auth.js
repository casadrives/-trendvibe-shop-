const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../server/models/User');

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectDB();

    switch (event.httpMethod) {
      case 'POST':
        if (event.path === '/.netlify/functions/auth/register') {
          const { email, password, name } = JSON.parse(event.body);

          // Check if user exists
          let user = await User.findOne({ email });
          if (user) {
            return {
              statusCode: 400,
              body: JSON.stringify({ message: 'User already exists' })
            };
          }

          // Create new user
          user = new User({
            name,
            email,
            password,
            isAdmin: false
          });

          // Hash password
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);

          await user.save();

          // Create token
          const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          );

          return {
            statusCode: 201,
            body: JSON.stringify({
              token,
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
              }
            })
          };

        } else if (event.path === '/.netlify/functions/auth/login') {
          const { email, password } = JSON.parse(event.body);

          // Check if user exists
          const user = await User.findOne({ email });
          if (!user) {
            return {
              statusCode: 400,
              body: JSON.stringify({ message: 'Invalid credentials' })
            };
          }

          // Validate password
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return {
              statusCode: 400,
              body: JSON.stringify({ message: 'Invalid credentials' })
            };
          }

          // Create token
          const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          );

          return {
            statusCode: 200,
            body: JSON.stringify({
              token,
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
              }
            })
          };
        }
        break;

      case 'GET':
        if (!event.headers.authorization) {
          return {
            statusCode: 401,
            body: JSON.stringify({ message: 'No authentication token' })
          };
        }

        const token = event.headers.authorization.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
          return {
            statusCode: 404,
            body: JSON.stringify({ message: 'User not found' })
          };
        }

        return {
          statusCode: 200,
          body: JSON.stringify(user)
        };

      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ message: 'Method not allowed' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message })
    };
  }
};
