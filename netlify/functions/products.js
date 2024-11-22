const mongoose = require('mongoose');
const Product = require('../../server/models/Product');

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
      case 'GET':
        if (event.path === '/.netlify/functions/products') {
          const products = await Product.find();
          return {
            statusCode: 200,
            body: JSON.stringify(products)
          };
        } else if (event.path === '/.netlify/functions/products/featured') {
          const products = await Product.find({ featured: true }).limit(8);
          return {
            statusCode: 200,
            body: JSON.stringify(products)
          };
        } else if (event.path === '/.netlify/functions/products/trending') {
          const products = await Product.find()
            .sort({ viewCount: -1 })
            .limit(8);
          return {
            statusCode: 200,
            body: JSON.stringify(products)
          };
        } else {
          const productId = event.path.split('/').pop();
          const product = await Product.findById(productId);
          if (!product) {
            return {
              statusCode: 404,
              body: JSON.stringify({ message: 'Product not found' })
            };
          }
          return {
            statusCode: 200,
            body: JSON.stringify(product)
          };
        }
        
      case 'POST':
        if (!event.headers.authorization) {
          return {
            statusCode: 401,
            body: JSON.stringify({ message: 'No authentication token' })
          };
        }
        
        if (event.path.includes('/view')) {
          const productId = event.path.split('/')[4];
          const product = await Product.findByIdAndUpdate(
            productId,
            { $inc: { viewCount: 1 } },
            { new: true }
          );
          return {
            statusCode: 200,
            body: JSON.stringify(product)
          };
        } else {
          const data = JSON.parse(event.body);
          const product = new Product(data);
          const newProduct = await product.save();
          return {
            statusCode: 201,
            body: JSON.stringify(newProduct)
          };
        }
        
      case 'PATCH':
        if (!event.headers.authorization) {
          return {
            statusCode: 401,
            body: JSON.stringify({ message: 'No authentication token' })
          };
        }
        
        const productId = event.path.split('/').pop();
        const updates = JSON.parse(event.body);
        const product = await Product.findByIdAndUpdate(
          productId,
          updates,
          { new: true }
        );
        return {
          statusCode: 200,
          body: JSON.stringify(product)
        };
        
      case 'DELETE':
        if (!event.headers.authorization) {
          return {
            statusCode: 401,
            body: JSON.stringify({ message: 'No authentication token' })
          };
        }
        
        const id = event.path.split('/').pop();
        await Product.findByIdAndDelete(id);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Product deleted' })
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
