// import controllers review, products
const productController = require('../controllers/productController.js')
const reviewController = require('../controllers/reviewController')


// router
const router = require('express').Router()


// use routers
//add product
router.post('/addProduct',  productController.addProduct)

//get all products
router.get('/allProducts', productController.getAllProducts)

//get only published products
router.get('/published', productController.getPublishedProduct)



// Review Url and Controller

router.get('/allReviews', reviewController.getAllReviews)
router.post('/addReview/:id', reviewController.addReview)

// get product Reviews
router.get('/getProductReviews/:id', productController.getProductReviews)




// Products router
//get with id
router.get('/:id', productController.getOneProduct)

//update with id 
router.put('/:id', productController.updateProduct)

//delete with id
router.delete('/:id', productController.deleteProduct)

module.exports = router
