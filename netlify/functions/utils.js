// Response helper functions
const successResponse = (data, statusCode = 200) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
    },
    body: JSON.stringify(data)
  }
}

const errorResponse = (error, statusCode = 500) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
    },
    body: JSON.stringify({
      error: error.message || 'Internal Server Error'
    })
  }
}

// Validation helpers
const validateProduct = (product) => {
  const requiredFields = ['name', 'price', 'description', 'category', 'supplier_id', 'image_url']
  const missingFields = requiredFields.filter(field => !product[field])
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
  }

  if (product.price > 50) {
    throw new Error('Product price must be €50 or less')
  }

  return true
}

const validateSupplier = (supplier) => {
  const requiredFields = ['name', 'description', 'url']
  const missingFields = requiredFields.filter(field => !supplier[field])
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
  }

  return true
}

module.exports = {
  successResponse,
  errorResponse,
  validateProduct,
  validateSupplier
}
