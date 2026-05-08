<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

$routes->get('/', 'Home::index');



/* =========================
   CORS (ONLY ONCE - FIXED)
========================= */
$routes->options('(:any)', function () {
    return service('response')
        ->setStatusCode(200)
        ->setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
        ->setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
        ->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->setHeader('Access-Control-Allow-Credentials', 'true');
});



/* =========================
   AUTHENTICATION
========================= */
$routes->post('login', 'Authentication::login');
$routes->post('register', 'Authentication::register');



/* =========================
   PRODUCTS
========================= */
$routes->post('add-product', 'Authentication::addProduct');
$routes->get('products', 'Authentication::getProducts');
$routes->get('getProducts', 'Authentication::getProducts');
$routes->get('get-product/(:num)', 'Authentication::getProductById/$1');

$routes->post('update-product/(:num)', 'Authentication::updateProduct/$1');
$routes->post('delete-product/(:num)', 'Authentication::deleteProduct/$1');



/* =========================
   USERS
========================= */
$routes->get('users', 'Authentication::users');
$routes->post('update-user/(:num)', 'Authentication::updateUser/$1');
$routes->post('delete-user/(:num)', 'Authentication::deleteUser/$1');

$routes->get('user-filter', 'Authentication::userList');



/* =========================
   PRODUCT FILTER
========================= */
$routes->get('product-filter', 'Authentication::productfilter');



/* =========================
   CART
========================= */
$routes->post('add-to-cart', 'Authentication::addToCart');
$routes->get('get-cart/(:num)', 'Authentication::getCart/$1');
$routes->post('update-cart', 'Authentication::updateCart');
$routes->post('remove-cart', 'Authentication::removeCart');



/* =========================
   ORDER SYSTEM
========================= */
$routes->post('place-order', 'Authentication::placeOrder');
$routes->get('getAllOrders', 'Authentication::getAllOrders');
$routes->get('orderList', 'Authentication::orderList');



/* =========================
   ORDER ITEMS (IMPORTANT)
========================= */
$routes->get('order-items/(:num)', 'Authentication::getOrderItems/$1');



/* =========================
   PAYMENT SYSTEM
========================= */
$routes->post('pay-order', 'Authentication::payOrder');
$routes->get('pending-orders/(:num)', 'Authentication::getPendingOrders/$1');
$routes->post('cancel-order', 'Authentication::cancelOrder');