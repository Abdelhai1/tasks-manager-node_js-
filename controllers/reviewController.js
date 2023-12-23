const db = require('../models')

// model
const Review = db.reviews

// functions

const { sequelize } = require('../models'); // Import the Sequelize instance
const { QueryTypes } = require('sequelize');
//1. Add Review

const addReview = async (req, res) => {

    try {
        const productId = req.params.id;
        const { rating, description } = req.body;

        const insertReviewQuery = `
            INSERT INTO reviews (product_id, rating, description,createdAt,updatedAt)
            VALUES (?, ?, ?,NOW(),NOW())
        `;

        const [review, _] = await sequelize.query(insertReviewQuery, {
            replacements: [productId, rating, description],
            type: sequelize.QueryTypes.INSERT,
        });

        res.status(200).send({review})
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).send('Internal Server Error');
    }
}

// 2. Get All Reviews

const getAllReviews = async (req, res) => {

    try {
        const query = 'SELECT * FROM reviews';
        const reviews = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

        res.status(200).send(reviews);
        console.log(reviews)
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send('Internal Server Error');
    }

}

module.exports = {
    addReview,
    getAllReviews
}