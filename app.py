from flask import Flask, render_template, jsonify, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import requests
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///shop.db'
db = SQLAlchemy(app)

# Product Model
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(200))
    category = db.Column(db.String(50))
    stock = db.Column(db.Integer, default=0)
    supplier_url = db.Column(db.String(200))  # Direct link to supplier
    shipping_cost = db.Column(db.Float, default=0.0)  # Free shipping
    supplier_name = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Routes
@app.route('/')
def home():
    products = Product.query.filter_by(shipping_cost=0.0).all()  # Only show free shipping products
    return render_template('index.html', products=products)

@app.route('/product/<int:product_id>')
def product_detail(product_id):
    product = Product.query.get_or_404(product_id)
    return render_template('product_detail.html', product=product)

@app.route('/category/<category>')
def category(category):
    products = Product.query.filter_by(category=category, shipping_cost=0.0).all()
    return render_template('category.html', products=products, category=category)

@app.route('/suppliers')
def suppliers():
    # Group products by supplier
    suppliers = db.session.query(Product.supplier_name).distinct().all()
    supplier_products = {}
    for supplier in suppliers:
        supplier_products[supplier[0]] = Product.query.filter_by(supplier_name=supplier[0]).all()
    return render_template('suppliers.html', supplier_products=supplier_products)

@app.route('/cart')
def cart():
    return render_template('cart.html')

@app.route('/api/add-to-cart', methods=['POST'])
def add_to_cart():
    return jsonify({'status': 'success'})

# Admin route to add free dropshipping products
@app.route('/admin/add-product', methods=['GET', 'POST'])
def add_product():
    if request.method == 'POST':
        product = Product(
            name=request.form['name'],
            description=request.form['description'],
            price=float(request.form['price']),
            image_url=request.form['image_url'],
            category=request.form['category'],
            stock=int(request.form['stock']),
            supplier_url=request.form['supplier_url'],
            supplier_name=request.form['supplier_name'],
            shipping_cost=0.0  # Always free shipping
        )
        db.session.add(product)
        db.session.commit()
        return redirect(url_for('home'))
    return render_template('add_product.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
