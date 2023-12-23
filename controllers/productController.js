const db = require('../models')



// create main Model
const Product = db.products
const Review = db.reviews

const { sequelize } = require('../models'); // Import the Sequelize instance
const { QueryTypes } = require('sequelize');
// main work

// 1. create product



const addProduct = async (req, res) => {
    try {
        const { title, price, description, published } = req.body;

        const query = `
            INSERT INTO products (title, price, description, published, createdAt, updatedAt)
            VALUES (:title, :price, :description, :published, NOW(), NOW())
        `;

        const values = { title, price, description, published: published || false };

        // Execute the raw SQL query
        const [product] = await sequelize.query(query, {
            replacements: values,
            type: QueryTypes.INSERT,
            raw: true,
        });

        console.log('Product:', product);

        res.status(200).json({ product }); // Send the product data as JSON
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).send('Internal Server Error');
    }
};







// 2. get all products

const getAllProducts = async (req, res) => {
    try {
        const query = 'SELECT * FROM products';
        const products = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

        res.status(200).send(products);
        console.log(products)
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
};

// 3. get single product

const getOneProduct = async (req, res) => {

    try {
        const id = req.params.id;
        const query = 'SELECT * FROM products WHERE id = :id';
        const product = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { id: id },
        });

        if (product.length === 0) {
            res.status(404).send('Product not found');
        } else {
            res.status(200).send(product[0]);
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Internal Server Error');
    }

}

// 4. update Product

const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;

        const query = `
            UPDATE products
            SET title = ?, price = ?, description = ?, published = ? , updatedAt = NOW()
            WHERE id = ?
        `;

        const [rowsUpdated, _] = await sequelize.query(query, {
            replacements: [updatedData.title, updatedData.price, updatedData.description, updatedData.published, id],
            type: sequelize.QueryTypes.UPDATE,
            returning: true,
        });

        if (rowsUpdated === 0) {
            res.status(404).send('Product not found');
        } else {
            res.status(200).send('Product updated successfully');
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Internal Server Error');
    }
}

// 5. delete product by id

const deleteProduct = async (req, res) => {

    try {
        const id = req.params.id;

        // Delete reviews associated with the product
        const deleteReviewsQuery = 'DELETE FROM reviews WHERE product_id = ?';
        await sequelize.query(deleteReviewsQuery, {
            replacements: [id],
            type: sequelize.QueryTypes.DELETE,
        });
        //product
        const query = 'DELETE FROM products WHERE id = ?';
        const rowsDeleted = await sequelize.query(query, {
            replacements: [id],
            type: sequelize.QueryTypes.DELETE,
        });

        

        if (rowsDeleted === 0) {
            res.status(404).send('Product not found');
        } else {
            res.status(200).send('Product is deleted!');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Internal Server Error');
    }
}

// 6. get published product

const getPublishedProduct = async (req, res) => {

    try {
        const query = 'SELECT * FROM products where published = True';
        const publishedProducts = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

        res.status(200).send(publishedProducts);
        console.log(publishedProducts)
    } catch (error) {
        console.error('Error fetching published products:', error);
        res.status(500).send('Internal Server Error');
    }

}

// 7. connect one to many relation Product and Reviews

const getProductReviews =  async (req, res) => {

    try {
        const id = req.params.id;

        const query = `
            SELECT products.*, reviews.*
            FROM products
            INNER JOIN reviews ON products.id = reviews.product_id
            WHERE products.id = :id
        `;

        const data = await sequelize.query(query, {
            replacements: { id: id },
            type: sequelize.QueryTypes.SELECT,
            nest: true, //nested structure with reviews
        });

        res.status(200).send(data);
    } catch (error) {
        console.error('Error fetching product reviews:', error);
        res.status(500).send('Internal Server Error');
    }

}







module.exports = {
    addProduct,
    getAllProducts,
    getOneProduct,
    updateProduct,
    deleteProduct,
    getPublishedProduct,
    getProductReviews,
    
}