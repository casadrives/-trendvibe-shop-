# Trendy Shop - Free Dropshipping E-commerce Platform

A modern e-commerce platform specializing in free dropshipping products under €50, built with Flask and Bootstrap.

## Features

- Modern, responsive design
- Product catalog with categories
- Shopping cart functionality
- Detailed product pages
- Mobile-friendly interface
- Free shipping only products
- Supplier management system
- Direct links to suppliers

## Free Dropshipping Sources

Here are some recommended free dropshipping sources you can use with this platform:

1. **AliExpress**
   - Many sellers offer free shipping
   - Wide variety of products
   - No upfront costs
   - Use AliExpress Dropshipping Center

2. **Amazon FBA**
   - Free shipping for Prime products
   - Fast delivery times
   - Reliable service

3. **eBay**
   - Many sellers offer free international shipping
   - Good for unique products
   - Easy to integrate

4. **Wish**
   - Known for affordable products
   - Free shipping options available
   - Good for trendy items

5. **DHgate**
   - Many sellers offer free ePacket shipping
   - Wholesale prices
   - No membership fees

## Prerequisites

- Python 3.7 or higher
- pip (Python package manager)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd trendy_shop
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- Windows:
```bash
venv\Scripts\activate
```
- Unix or MacOS:
```bash
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

1. Start the Flask development server:
```bash
python app.py
```

2. Open your web browser and navigate to:
```
http://localhost:5000
```

## Adding Products

To add products to the store:

1. Navigate to `/admin/add-product`
2. Fill in the product details:
   - Name
   - Description
   - Price (under €50)
   - Image URL
   - Category
   - Stock quantity
   - Supplier URL (direct link to product)
   - Supplier name

Note: Only add products with free shipping to maintain the zero-cost dropshipping model.

## Dropshipping Tips

1. **Product Selection**
   - Focus on trending items
   - Check shipping times
   - Verify free shipping availability
   - Read supplier reviews

2. **Pricing Strategy**
   - Keep prices under €50
   - Account for marketplace fees
   - Consider competition
   - Maintain profitable margins

3. **Quality Control**
   - Order samples when possible
   - Check supplier ratings
   - Monitor customer feedback
   - Track shipping times

4. **Customer Service**
   - Be transparent about shipping times
   - Provide tracking information
   - Handle returns professionally
   - Maintain clear communication

## Project Structure

```
trendy_shop/
├── app.py              # Main application file
├── requirements.txt    # Python dependencies
├── templates/         # HTML templates
│   ├── index.html    # Home page
│   ├── product_detail.html  # Product detail page
│   ├── suppliers.html      # Suppliers page
│   └── add_product.html    # Admin product form
└── static/           # Static files (CSS, JS, images)
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
