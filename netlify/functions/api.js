const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async (event, context) => {
  try {
    const path = event.path.replace('/.netlify/functions/api/', '');
    const method = event.httpMethod;

    await client.connect();
    const database = client.db('trendy_shop');
    const products = database.collection('products');

    // Handle different API endpoints
    switch (path) {
      case 'products':
        if (method === 'GET') {
          const allProducts = await products.find({ shipping_cost: 0 }).toArray();
          return {
            statusCode: 200,
            body: JSON.stringify(allProducts)
          };
        }
        break;

      case 'product':
        if (method === 'GET') {
          const productId = event.queryStringParameters.id;
          const product = await products.findOne({ _id: productId });
          return {
            statusCode: 200,
            body: JSON.stringify(product)
          };
        }
        break;

      case 'suppliers':
        if (method === 'GET') {
          const suppliers = await products.distinct('supplier_name');
          return {
            statusCode: 200,
            body: JSON.stringify(suppliers)
          };
        }
        break;

      case 'add-product':
        if (method === 'POST') {
          const data = JSON.parse(event.body);
          data.shipping_cost = 0;
          const result = await products.insertOne(data);
          return {
            statusCode: 200,
            body: JSON.stringify(result)
          };
        }
        break;
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Not Found' })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message })
    };
  } finally {
    await client.close();
  }
};
