<?php

namespace App\Controllers;

use App\Models\ProductModel;
use CodeIgniter\Controller;
use App\Models\UserModel;
use App\Models\MobileModel;
use App\Models\LaptopModel;
use App\Models\ElectronicsModel;

class Authentication extends Controller{
/* CORS CONSTRUCTOR */

public function __construct()
{
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

    if ($_SERVER['REQUEST_METHOD'] == "OPTIONS") {
        http_response_code(200);
        exit();
    }
}

/* LOGIN */
 
public function login()
{
    $db = \Config\Database::connect();
    $data = $this->request->getJSON(true);

    $email = $data['email'];
    $password = $data['password'];

    $query = $db->table('login_details')
        ->where('email', $email)
        ->get();

    $user = $query->getRow();

    if ($user && $password === $user->password) {

        $jwtService = new \App\Libraries\JWTService();
        $token = $jwtService->generateToken($user);

        return $this->response->setJSON([
            "status" => true,
            "token" => $token,
            "role" => $user->role,
            "user_id" => $user->id,
            "name" => $user->name,
            "message" => "Login Successful"
        ]);
    }

    return $this->response->setJSON([
        "status" => false,
        "message" => "Invalid Email or Password"
    ]);
}
/* REGISTER */

public function register(){

    $db = \Config\Database::connect();

    $data = $this->request->getJSON(true);

    $name = $data['name'];
    $email = $data['email'];
    $phone = $data['phone'];
    $address = $data['address'];
    $gender = $data['gender'];
    $password = $data['password'];

    //  CHECK EMAIL EXISTS
    $check = $db->query("SELECT * FROM login_details WHERE email='$email'");
    $existingUser = $check->getRow();

    if ($existingUser) {
        return $this->response->setJSON([
            "status" => false,
            "message" => "Email already exists"
        ]);
    }

    //  INSERT USER
    $db->query("INSERT INTO login_details(email,password,role,phone,address,gender,name)
    VALUES('$email','$password','user','$phone','$address','$gender','$name')");

    return $this->response->setJSON([
        "status"=>true,
        "message"=>"Registration Successful"
    ]);
}

public function addProduct()
{
    $productModel = new ProductModel();

    $data = [
        "name" => $this->request->getPost('name'),
        "category" => $this->request->getPost('category'),
        "price" => $this->request->getPost('price'),
        "description" => $this->request->getPost('description'),
        "stock" => $this->request->getPost('stock'),
        "store_id" => $this->request->getVar('store_id'),
"store_name" => $this->request->getVar('store_name')
    ];

    // IMAGE
    $image = $this->request->getFile('image');
    if ($image && $image->isValid() && !$image->hasMoved()) {
        $imageName = $image->getRandomName();
        $image->move(ROOTPATH . 'public/uploads', $imageName);
        $data["image"] = $imageName;
    }

    // INSERT PRODUCT
    $productModel->insert($data);
    $product_id = $productModel->insertID();
    $category = $data['category'];

    // CATEGORY TABLE
    if ($category == "Mobile") {
        $mobileModel = new MobileModel();

        $mobileModel->insert([
            "product_id" => $product_id,
            "processor" => $this->request->getPost('processor'),
            "ram" => $this->request->getPost('ram'),
            "storage" => $this->request->getPost('storage'),
            "camera" => $this->request->getPost('camera'),
            "battery" => $this->request->getPost('battery'),
            "charger" => $this->request->getPost('charger'),
            "brand" => $this->request->getPost('brand')
        ]);
    }

    elseif ($category == "Laptop") {
        $laptopModel = new LaptopModel();

        $laptopModel->insert([
            "product_id" => $product_id,
            "processor" => $this->request->getPost('processor'),
            "ram" => $this->request->getPost('ram'),
            "storage" => $this->request->getPost('storage'),
            "charger" => $this->request->getPost('charger'),
            "graphics_card" => $this->request->getPost('graphics_card'),
            "screen_size" => $this->request->getPost('screen_size'),
            "brand" => $this->request->getPost('brand')
            ]);
    }

    else {
        $electronicsModel = new ElectronicsModel();

        $electronicsModel->insert([
            "product_id" => $product_id,
            "type" => $this->request->getPost('type'),
            "power" => $this->request->getPost('power'),
            "warranty" => $this->request->getPost('warranty'),
            "brand" => $this->request->getPost('brand')

        ]);
    }

     $sync = new \App\Libraries\ExcelSyncService();
    $sync->sync(); 
    
    return $this->response->setJSON([
        "status" => true,
        "message" => "Product Added Successfully"
    ]);
}

/* GET PRODUCTS */
public function getProducts()
{
    $productModel = new \App\Models\ProductModel();
    $builder = $productModel->builder();

    $page  = $this->request->getGet('page') ?? 1;
    $limit = 25; 
    $offset = ($page - 1) * $limit;

    $builder->select("products.*,

        mobile_details.processor AS mobile_processor,
        mobile_details.ram AS mobile_ram,
        mobile_details.storage AS mobile_storage,
        mobile_details.camera,
        mobile_details.battery,
        mobile_details.brand AS mobile_brand,

        laptop_details.processor AS laptop_processor,
        laptop_details.ram AS laptop_ram,
        laptop_details.storage AS laptop_storage,
        laptop_details.graphics_card,
        laptop_details.screen_size,
        laptop_details.brand AS laptop_brand,

        electronics_details.type,
        electronics_details.power,
        electronics_details.warranty,
        electronics_details.brand AS electronics_brand");

    // JOIN
    $builder->join('mobile_details', 'mobile_details.product_id = products.id', 'left');
    $builder->join('laptop_details', 'laptop_details.product_id = products.id', 'left');
    $builder->join('electronics_details', 'electronics_details.product_id = products.id', 'left');

    $category = $this->request->getGet('category');
    $brand = $this->request->getGet('brand');
    $price = $this->request->getGet('price');
    $sort = $this->request->getGet('sort');
    $search = $this->request->getGet('search');
    $ram = $this->request->getGet('ram');
    $storage = $this->request->getGet('storage');
    $camera  = $this->request->getGet('camera');
    $battery = $this->request->getGet('battery');
    $charger = $this->request->getGet('charger');
    $processor = $this->request->getGet('processor');
    $screenSize = $this->request->getGet('screen_size');
    $graphicsCard = $this->request->getGet('graphics_card');

// SEARCH ONLY
if (!empty($search)) {
    $builder->groupStart()
        ->like('products.name', $search)
        ->orLike('mobile_details.processor', $search)
        ->orLike('electronics_details.brand', $search)
        ->orLike('laptop_details.processor', $search)
        ->orLike('laptop_details.graphics_card', $search)
        ->orLike('laptop_details.screen_size', $search)
        ->orLike('mobile_details.ram', $search)
        ->orLike('laptop_details.ram', $search)
    ->groupEnd();
}
if (!empty($price)) {
    $builder->where('products.price <=', (int)$price);
}
    if (!empty($category)) {
        $builder->where('products.category', $category);
    }
    if (!empty($brand)) {
        $builder->groupStart()
            ->like('mobile_details.brand', $brand)
            ->orLike('laptop_details.brand', $brand)
            ->orLike('electronics_details.brand', $brand)
            ->groupEnd();
    }
   if (!empty($processor)) {

    if ($processor == "Snapdragon") {
        $builder->groupStart()
            ->like('mobile_details.processor', 'Snapdragon')
            ->orLike('laptop_details.processor', 'Snapdragon')
        ->groupEnd();
    }
    elseif ($processor == "MediaTek") {
        $builder->groupStart()
            ->like('mobile_details.processor', 'Dimensity')
            ->orLike('mobile_details.processor', 'Helio')
            ->orLike('laptop_details.processor', 'Dimensity')
            ->orLike('laptop_details.processor', 'Helio')
        ->groupEnd();
    }
    elseif ($processor == "Apple") {
        $builder->groupStart()
            ->like('mobile_details.processor', 'Bionic')
            ->orLike('laptop_details.processor', 'M1')
            ->orLike('mobile_details.processor', 'Apple')
            ->orLike('laptop_details.processor', 'M2')
        ->groupEnd();
    }
    elseif ($processor == "Exynos") {
        $builder->like('mobile_details.processor', 'Exynos');
    }
    elseif ($processor == "Unisoc") {
        $builder->like('mobile_details.processor', 'Unisoc');
    }
   elseif ($processor == "Intel") {
    $builder->groupStart()
        ->like('laptop_details.processor', 'Intel')
        ->orLike('laptop_details.processor', 'i3')
        ->orLike('laptop_details.processor', 'i5')
        ->orLike('laptop_details.processor', 'i7')
        ->orLike('laptop_details.processor', 'i9')
        ->groupEnd();
}
    elseif ($processor == "AMD") {
      $builder->groupStart()
        ->like('laptop_details.processor', 'AMD')
        ->orLike('laptop_details.processor', 'Ryzen')
        ->orLike('laptop_details.processor', 'Ryzen 3')
        ->orLike('laptop_details.processor', 'Ryzen 5')
        ->orLike('laptop_details.processor', 'Ryzen 7')
        ->orLike('laptop_details.processor', 'Ryzen 9')
     ->groupEnd();
  }
 }
  if (!empty($ram)) {
    $builder->groupStart()
        ->where("mobile_details.ram REGEXP '(^|[^0-9]){$ram}([^0-9]|$)'", null, false)
        ->orWhere("laptop_details.ram REGEXP '(^|[^0-9]){$ram}([^0-9]|$)'", null, false)
    ->groupEnd();
  }
  if (!empty($storage)) {
    $storageField = "CAST(REGEXP_REPLACE(mobile_details.storage, '[^0-9]', '') AS UNSIGNED)";
    if ($storage == "1024+") {
        $builder->where("$storageField >=", 1024, false);
    } else {
        $builder->where("$storageField =", (int)$storage, false);
    }
  }
  if (!empty($camera)) {
    $cameraField = "CAST(REGEXP_REPLACE(mobile_details.camera, '[^0-9]', '') AS UNSIGNED)";
    $builder->where("$cameraField >=", (int)$camera, false);
  }
  if (!empty($battery)) {
    $batteryField = "CAST(REGEXP_REPLACE(mobile_details.battery, '[^0-9]', '') AS UNSIGNED)";
    $builder->where("$batteryField >=", (int)$battery, false);
  }
  if (!empty($charger)) {
    $builder->groupStart()
        ->where("CAST(REGEXP_REPLACE(mobile_details.charger, '[^0-9]', '') AS UNSIGNED) >=", (int)$charger, false)
        ->orWhere("CAST(REGEXP_REPLACE(laptop_details.charger, '[^0-9]', '') AS UNSIGNED) >=", (int)$charger, false)
    ->groupEnd();
  }
  if (!empty($graphicsCard)) {
    $builder->groupStart()
        ->like('laptop_details.graphics_card', $graphicsCard)
    ->groupEnd();
  }
    if (!empty($screenSize)) {
    $builder->where('laptop_details.screen_size', $screenSize);
  }
    if (!empty($price)) {
        $builder->where('products.price <=', $price);
    }
    if ($sort == "low") {
        $builder->orderBy('products.price', 'ASC');
    } elseif ($sort == "high") {
        $builder->orderBy('products.price', 'DESC');
    }
    $builder->orderBy('RAND()');

    if (empty($sort)) {
    $builder->orderBy('RAND()');
}

    $countBuilder = clone $builder;
    $total = $countBuilder->countAllResults(false);

    $products = $builder->get($limit, $offset)->getResult();

    return $this->response->setJSON([
        "data" => $products,
        "total" => $total,
        "page" => (int)$page,
        "totalPages" => ceil($total / $limit)
    ]);}  

// getting product  by id from three table
public function getProductById($id)
{
    $productModel = new ProductModel();
    $mobileModel = new MobileModel();
    $laptopModel = new LaptopModel();
    $electronicsModel = new ElectronicsModel();

    $product = $productModel->find($id);

    if (!$product) {
        return $this->response->setJSON([
            "status" => false,
            "message" => "Product not found"
        ]);}

    $extra = [];
    if ($product['category'] == "Mobile") {
        $extra = $mobileModel->where("product_id", $id)->first();
    } 
    elseif ($product['category'] == "Laptop") {
        $extra = $laptopModel->where("product_id", $id)->first();
    } 
    elseif ($product['category'] == "Accessories") {
        $extra = $electronicsModel->where("product_id", $id)->first();
    }

    // FIX: prevent null crash
    $finalData = array_merge($product, $extra ?? []);

    return $this->response->setJSON($finalData);
}
// updating data to three tables by their id
public function updateProduct($id)
{
    $productModel = new ProductModel();
    $mobileModel = new MobileModel();
    $laptopModel = new LaptopModel();
    $electronicsModel = new ElectronicsModel();

    $data = [
        "name" => $this->request->getPost('name'),
        "category" => $this->request->getPost('category'),
        "price" => $this->request->getPost('price'),
        "description" => $this->request->getPost('description'),
        "stock" => $this->request->getPost('stock'),
    ];
    // IMAGE
    $image = $this->request->getFile('image');
    if ($image && $image->isValid() && !$image->hasMoved()) {
        $imageName = $image->getRandomName();
        $image->move(ROOTPATH . 'public/uploads', $imageName);
        $data["image"] = $imageName;
    }
    // UPDATE PRODUCT
    $productModel->update($id, $data);
    $category = $data['category'];
    // mobile
    if ($category == "Mobile") {

        $mobileData = [
            "product_id" => $id,
            "processor" => $this->request->getPost('processor'),
            "ram" => $this->request->getPost('ram'),
            "storage" => $this->request->getPost('storage'),
            "camera" => $this->request->getPost('camera'),
            "battery" => $this->request->getPost('battery'),
            "charger" => $this->request->getPost('charger'),
            "brand" => $this->request->getPost('brand'),
        ];

        $existing = $mobileModel->where('product_id', $id)->first();
        if ($existing) {
            $mobileModel->update($existing['id'], $mobileData);
        } else {
            $mobileModel->insert($mobileData);
        }
    } 
    // lap
    elseif ($category == "Laptop") {
        $laptopData = [
            "product_id" => $id,
            "processor" => $this->request->getPost('processor'),
            "ram" => $this->request->getPost('ram'),
            "storage" => $this->request->getPost('storage'),
            "charger" => $this->request->getPost('charger'),
            "graphics_card" => $this->request->getPost('graphics_card'),
            "screen_size" => $this->request->getPost('screen_size'),
            "brand" => $this->request->getPost('brand'),
        ];
        $existing = $laptopModel->where('product_id', $id)->first();

        if ($existing) {
            $laptopModel->update($existing['id'], $laptopData);
        } else {
            $laptopModel->insert($laptopData);
        }
    } 
    // accessories
    elseif ($category == "Accessories") {

        $electronicsData = [
            "product_id" => $id,
            "type" => $this->request->getPost('type'),
            "power" => $this->request->getPost('power'),
            "warranty" => $this->request->getPost('warranty'),
            "brand" => $this->request->getPost('brand'),
        ];

        $existing = $electronicsModel->where('product_id', $id)->first();

        if ($existing) {
            $electronicsModel->update($existing['id'], $electronicsData);
        } else {
            $electronicsModel->insert($electronicsData);
        }
    }
    return $this->response->setJSON([
        "status" => true,
        "message" => "Product Updated Successfully"
    ]);
}
// delete product by id
public function deleteProduct($id)
{
    $productModel = new ProductModel();
    $mobileModel = new MobileModel();
    $laptopModel = new LaptopModel();  
    $electronicsModel = new ElectronicsModel();
    
    $product = $productModel->find($id);

    if (!$product) {
        return $this->response->setJSON([
            "status" => false,
            "message" => "Product not found"
        ]);
    }

    $category = $product['category'];
    //  using this we delete in the 3 table by category
    if ($category == "Mobile") {
        $mobileModel->where("product_id", $id)->delete();
    } 
    else if ($category == "Laptop") {
        $laptopModel->where("product_id", $id)->delete();
    } 
    else {
        $electronicsModel->where("product_id", $id)->delete();
    }
    //  delete data in product table
    $productModel->delete($id);

    return $this->response->setJSON([
        "status" => true,
        "message" => "Product Deleted Successfully"
    ]);
}
// getting all users
 public function users(){

            $userModel = new UserModel();
            $user = $userModel->findAll();
            return $this->response->setJSON($user);
            }


 public function updateUser($id){
            $db = \Config\Database::connect();
            $data = $this->request->getJSON(true);

            if(!$data){
                    return $this->response->setJSON([
                    "status"=>false,
                    "message"=>"No data received"]);
            }
            $db->query("UPDATE login_details SET 
                        name='".$data['name']."',
                        email='".$data['email']."',
                        phone='".$data['phone']."',
                        address='".$data['address']."',
                        role='".$data['role']."',
                        gender='".$data['gender']."'
                        WHERE id='".$id."'");

            return $this->response->setJSON([
                   "status"=>true,
                   "message"=>"User Updated Successfully"]);
        }

/* DELETE USER */
    public function deleteUser($id){
                $db = \Config\Database::connect();
                $db->query("DELETE FROM login_details WHERE id='$id'");

                return $this->response->setJSON([
                       "status"=>true,
                       "message"=>"User Deleted"]);
          }
    //    

    public function userList(){

    $model = new UserModel();

    $search = $this->request->getGet('search');
    $place  = $this->request->getGet('place');
    $sort   = $this->request->getGet('sort');
    $page   = $this->request->getGet('page') ?? 1;

    $limit = 10;
    $offset = ($page - 1) * $limit;

    //  Use Query Builder
    $builder = $model->builder();
    //  Search with delay
    if (!empty($search)) {
        sleep(1);

        $builder->groupStart()
            ->like('name', $search)
            ->orLike('email', $search)
            ->orLike('phone', $search)
            ->orLike('address', $search)
            ->groupEnd();
    }
    // Filter by place
    if (!empty($place)) {
        $builder->like('address', $place);
    }
    // Sorting
    switch ($sort) {
        case 'name-asc':
            $builder->orderBy('name', 'ASC');
            break;
        case 'name-desc':
            $builder->orderBy('name', 'DESC');
            break;
        case 'id-asc':
            $builder->orderBy('id', 'ASC');
            break;
        case 'id-desc':
            $builder->orderBy('id', 'DESC');
            break;
        default:
            $builder->orderBy('id', 'DESC');
            break;
    }
    //  Clone builder for count
    $countBuilder = clone $builder;
    $total = $countBuilder->countAllResults();

    //  Pagination query
    $users = $builder->get($limit, $offset)->getResult();

    return $this->response->setJSON([
        "data" => $users,
        "total" => $total,
        "page" => (int)$page,
        "totalPages" => ceil($total / $limit)
    ]);
} 

public function productfilter()
{
    $db = \Config\Database::connect();

    $search = $this->request->getGet('search');
    $category = $this->request->getGet('category');
    $sort   = $this->request->getGet('sort');
    $page   = $this->request->getGet('page') ?? 1;

    $limit = 10;
    $offset = ($page - 1) * $limit;

    $builder = $db->table('products');

    // JOIN ALL TABLES
    $builder->select("
        products.*,

        mobile_details.brand AS mobile_brand,
        laptop_details.brand AS laptop_brand,
        electronics_details.brand AS electronics_brand");

    $builder->join('mobile_details', 'mobile_details.product_id = products.id', 'left');
    $builder->join('laptop_details', 'laptop_details.product_id = products.id', 'left');
    $builder->join('electronics_details', 'electronics_details.product_id = products.id', 'left');

    // SEARCH
    if (!empty($search)) {
        sleep(1);
        $builder->groupStart()
            ->like('products.name', $search)
            ->orLike('products.category', $search)
            ->groupEnd();
    }
    // CATEGORY FILTER
    if (!empty($category)) {
        $builder->like('products.category', $category);
    }
    // SORT
    if ($sort == "name-asc") {
        $builder->orderBy('products.name', 'ASC');
    } elseif ($sort == "name-desc") {
        $builder->orderBy('products.name', 'DESC');
    }
    // COUNT
    $countBuilder = clone $builder;
    $total = $countBuilder->countAllResults(false);

    $products = $builder->get($limit, $offset)->getResult();

    //  MERGE BRAND INTO SINGLE FIELD
    foreach ($products as &$p) {
        $p->brand = $p->mobile_brand ?? $p->laptop_brand ?? $p->electronics_brand ?? null;
    }
    return $this->response->setJSON([
        "data" => $products,
        "total" => $total,
        "page" => (int)$page,
        "totalPages" => ceil($total / $limit)
    ]);
}

public function addToCart(){

    $db = \Config\Database::connect();
    $data = $this->request->getJSON(true);

    $user_id = $data['user_id'];
    $product_id = $data['product_id'];

    $check = $db->query("SELECT * FROM cart WHERE user_id='$user_id' AND product_id='$product_id'");
    $existing = $check->getRow();

    if ($existing) {
        $db->query("UPDATE cart SET quantity = quantity + 1 WHERE id='".$existing->id."'");

        return $this->response->setJSON([
            "status" => true,
            "message" => "Quantity updated in cart 🛒"
        ]);
    } else {
        $db->query("INSERT INTO cart(user_id, product_id, quantity) VALUES('$user_id','$product_id',1)");

        return $this->response->setJSON([
            "status" => true,
            "message" => "Product added to cart 🛒"
        ]);
    }}

public function getCart($user_id)
 { 
    $db = \Config\Database::connect();

    $query = $db->query(" 
        SELECT 
            cart.id as cart_id,
            cart.quantity,
            products.id as product_id,
            products.name,
            products.price,
            products.image
        FROM cart
        JOIN products ON products.id = cart.product_id
        WHERE cart.user_id = ?
    ", [$user_id]);
    return $this->response->setJSON($query->getResult());
}

public function updateCart()
{
    $db = \Config\Database::connect();
    $data = $this->request->getJSON(true);

    $cart_id = $data['cart_id'];
    $quantity = $data['quantity'];

    $db->query("UPDATE cart SET quantity='$quantity' WHERE id='$cart_id'");

    return $this->response->setJSON(["status" => true]);
}

public function removeCart()
{
    $db = \Config\Database::connect();
    $data = $this->request->getJSON(true);

    $cart_id = $data['cart_id'];

    $db->query("DELETE FROM cart WHERE id='$cart_id'");

    return $this->response->setJSON([
        "status" => true
    ]);
}

public function placeOrder()
{
    $db = \Config\Database::connect();
    $data = $this->request->getJSON(true);

    $user_id = $data['user_id'] ?? null;
    $address = $data['address'] ?? '';
    $phone   = $data['phone'] ?? '';
    $payment_method = $data['payment_method'] ?? 'cod';
    $products = $data['products'] ?? [];

    if (!$user_id || !$address || !$phone) {
        return $this->response->setJSON([
            "status" => false,
            "message" => "Missing required fields"
        ]);
    }

    $db->transStart();

    try {

        // BUY NOW OR CART ITEMS
        if (!empty($products)) {

            $cartItems = [];

            foreach ($products as $p) {
                $cartItems[] = (object)[
                    "product_id" => $p['product_id'],
                    "quantity"   => $p['quantity'],
                    "price"      => $p['price']
                ];}
        } else {

            $cartQuery = $db->query("
                SELECT cart.product_id, cart.quantity, products.price
                FROM cart
                JOIN products ON products.id = cart.product_id
                WHERE cart.user_id = ?
            ", [$user_id]);

            $cartItems = $cartQuery->getResult();
        }

        // EMPTY CHECK
        if (empty($cartItems)) {
            return $this->response->setJSON([
                "status" => false,
                "message" => "No products found"
            ]);
        }
        // TOTAL CALCULATION
        $total = 0;
        foreach ($cartItems as $item) {
            $total += $item->price * $item->quantity;
        }
        // INSERT ORDER
        $db->query("
            INSERT INTO orders (user_id, total, address, phone, payment_method)
            VALUES (?, ?, ?, ?, ?)
        ", [$user_id, $total, $address, $phone, $payment_method]);

        $order_id = $db->insertID();

        // INSERT ITEMS
        foreach ($cartItems as $item) {
            $db->query("
                INSERT INTO order_items (order_id, product_id, quantity, price)
                VALUES (?, ?, ?, ?)
            ", [
                $order_id,
                $item->product_id,
                $item->quantity,
                $item->price
            ]);
        }
        //  ALWAYS CLEAR CART AFTER ORDER
$db->query("DELETE FROM cart WHERE user_id = ?", [$user_id]);

        $db->transComplete();

        return $this->response->setJSON([
            "status" => true,
            "message" => "Order placed successfully",
            "order_id" => $order_id
        ]);

    } catch (\Exception $e) {
        $db->transRollback();

        return $this->response->setJSON([
            "status" => false,
            "message" => "Order failed",
            "error" => $e->getMessage()
        ]);
    }
}

public function getOrders($user_id)
{
    $db = \Config\Database::connect();
    $orders = $db->query("SELECT * FROM orders WHERE user_id = '$user_id' ORDER BY id DESC")->getResult();

    return $this->response->setJSON($orders);
}

public function orderList()
{
    $db = \Config\Database::connect();

    $search = $this->request->getGet('search');
    $type   = $this->request->getGet('type');
    $sort   = $this->request->getGet('sort');
    $page   = $this->request->getGet('page') ?? 1;

    // ✅ NEW
    $role      = $this->request->getGet('role');
    $store_id  = $this->request->getGet('store_id');

    $limit = 10;
    $offset = ($page - 1) * $limit;

    // STEP 1: GET ONLY ORDERS
    $builder = $db->table('orders');

    $builder->select("
        orders.id AS order_id,
        orders.user_id,
        orders.total,
        orders.phone,
        orders.payment_method,
        orders.payment_status,
        orders.order_status,
        login_details.name AS user_name");

    $builder->join('login_details', 'login_details.id = orders.user_id', 'left');

    // SEARCH
    if (!empty($search) && !empty($type)) {

        if ($type == "name") {
            $builder->like('login_details.name', $search);
        } elseif ($type == "phone") {
            $builder->like('orders.phone', $search);
        } elseif ($type == "status") {
            $builder->like('orders.payment_status', $search);
        }
    }

    // SORT
    if ($sort == "name-asc") {
        $builder->orderBy('login_details.name', 'ASC');
    } elseif ($sort == "name-desc") {
        $builder->orderBy('login_details.name', 'DESC');
    } else {
        $builder->orderBy('orders.id', 'DESC');
    }

    // COUNT
    $countBuilder = clone $builder;
    $total = $countBuilder->countAllResults();

    // PAGINATION
    $orders = $builder->get($limit, $offset)->getResult();

    // ATTACH PRODUCTS
    foreach ($orders as &$order) {

        // ✅ STORE OWNER FILTER
        if ($role == "storeowner") {

            $items = $db->query("
                SELECT 
                    products.name AS product_name,
                    products.store_id,
                    products.store_name,
                    order_items.quantity,
                    order_items.price
                FROM order_items
                LEFT JOIN products 
                    ON products.id = order_items.product_id
                WHERE order_items.order_id = ?
                AND products.store_id = ?
            ", [$order->order_id, $store_id])->getResult();

        } else {

            // ✅ ADMIN ALL PRODUCTS
            $items = $db->query("
                SELECT 
                    products.name AS product_name,
                    products.store_id,
                    products.store_name,
                    order_items.quantity,
                    order_items.price
                FROM order_items
                LEFT JOIN products 
                    ON products.id = order_items.product_id
                WHERE order_items.order_id = ?
            ", [$order->order_id])->getResult();
        }

        // If no items exist
        $order->items = $items ?: [];

        // OPTIONAL: compute total quantity
        $order->total_qty = array_sum(array_map(fn($i) => $i->quantity, $items));
    }

    // ✅ REMOVE EMPTY ORDERS FOR STORE OWNER
    if ($role == "storeowner") {

        $orders = array_filter($orders, function ($order) {
            return !empty($order->items);
        });

        $orders = array_values($orders);
    }

    return $this->response->setJSON([
        "data" => $orders,
        "total" => $total,
        "page" => (int)$page,
        "totalPages" => ceil($total / $limit)
    ]);
}
public function getPendingOrders($user_id)
{
    $db = \Config\Database::connect();

    $query = $db->query("
        SELECT 
            orders.id AS order_id,
            orders.total,
            orders.payment_status,

            products.name AS product_name,
            products.image,   --  ADD THIS
            order_items.quantity,
            order_items.price

        FROM orders
        JOIN order_items ON order_items.order_id = orders.id
        JOIN products ON products.id = order_items.product_id

        WHERE orders.user_id = ?
        AND orders.payment_status = 'Pending'

        ORDER BY orders.id DESC
    ", [$user_id]);

    return $this->response->setJSON($query->getResult());
}

public function payOrder()
{
    $db = \Config\Database::connect();
    $data = $this->request->getJSON(true);

    $order_id = $data['order_id'];
    $method   = $data['payment_method'];

    $db->transStart();

    try {

        // GET ORDER ITEMS
        $items = $db->query("
            SELECT oi.product_id, oi.quantity, p.stock, p.name
            FROM order_items oi
            JOIN products p ON p.id = oi.product_id
            WHERE oi.order_id = ?
        ", [$order_id])->getResult();

        if (empty($items)) {
            return $this->response->setJSON([
                "status" => false,
                "message" => "No items found"
            ]);
        }

        $order = $db->query("SELECT payment_status FROM orders WHERE id = ?", [$order_id])->getRow();

if ($order->payment_status === "Completed") {
    return $this->response->setJSON([
        "status" => false,
        "message" => "Order already paid"
    ]);
}

        // CHECK STOCK
        foreach ($items as $item) {
            if ($item->stock < $item->quantity) {
                return $this->response->setJSON([
                    "status" => false,
                    "message" => $item->name . " is out of stock 😭"
                ]);
            }}

        // REDUCE STOCK
        foreach ($items as $item) {
            $db->query("
                UPDATE products 
                SET stock = stock - ? 
                WHERE id = ?
            ", [$item->quantity, $item->product_id]);
        }

        // UPDATE PAYMENT STATUS
        $db->query("
            UPDATE orders 
            SET payment_status = 'Completed',
                payment_method = ?
            WHERE id = ?
        ", [$method, $order_id]);
        $db->transComplete();
        return $this->response->setJSON([
            "status" => true,
            "message" => "Payment Successful 🎉"
        ]);

    } catch (\Exception $e) {
        $db->transRollback();
        return $this->response->setJSON([
            "status" => false,
            "message" => "Payment Failed",
            "error" => $e->getMessage()
        ]);
    }}

public function getOrderItems($order_id)
{
    $db = \Config\Database::connect();

    $query = $db->query("
        SELECT 
            order_items.product_id,
            order_items.quantity,
            order_items.price,
            products.name,
            products.image,
            products.stock
        FROM order_items
        JOIN products ON products.id = order_items.product_id
        WHERE order_items.order_id = ?
    ", [$order_id]);

    return $this->response->setJSON($query->getResult());
}
public function cancelOrder()
{
    $db = \Config\Database::connect();
    $data = $this->request->getJSON(true);

    $order_id = $data['order_id'] ?? null;

    if (!$order_id) {
        return $this->response->setJSON([
            "status" => false,
            "message" => "Order ID missing"
        ]);
    }

    $db->transStart();

    try {

        // DELETE ORDER ITEMS FIRST
        $db->query("DELETE FROM order_items WHERE order_id = ?", [$order_id]);
        // DELETE ORDER
        $db->query("DELETE FROM orders WHERE id = ?", [$order_id]);

        $db->transComplete();

        return $this->response->setJSON([
            "status" => true,
            "message" => "Order cancelled successfully"
        ]);

    } catch (\Exception $e) {
        $db->transRollback();

        return $this->response->setJSON([
            "status" => false,
            "message" => "Cancel failed",
            "error" => $e->getMessage()
        ]);
    }
}
public function storeProducts($store_id)
{
    $db = \Config\Database::connect();

    try {

        $page = (int) ($this->request->getGet('page') ?? 1);
        $limit = 12;
        $offset = ($page - 1) * $limit;

        $search = $this->request->getGet('search');

        // BASE QUERY (FILTER BY STORE_ID)
        $builder = $db->table('products')
            ->where('store_id', $store_id);

        if (!empty($search)) {
            $builder->like('name', $search);
        }

        // COUNT QUERY
        $countBuilder = $db->table('products')
            ->where('store_id', $store_id);

        if (!empty($search)) {
            $countBuilder->like('name', $search);
        }

        $total = $countBuilder->countAllResults();

        // DATA QUERY
        $products = $builder
            ->limit($limit, $offset)
            ->get()
            ->getResult();

        return $this->response->setJSON([
            "status" => true,
            "data" => $products,
            "totalPages" => ceil($total / $limit),
            "page" => $page
        ]);

    } catch (\Throwable $e) {
        return $this->response->setJSON([
            "status" => false,
            "error" => $e->getMessage()
        ]);
    }
}
public function storeList()
{
    $db = \Config\Database::connect();
    $search = $this->request->getGet('search');

    $builder = $db->table('products')
        ->select('store_id, store_name')
        ->where('store_id IS NOT NULL')
        ->where('store_name IS NOT NULL')
        ->distinct();

    if (!empty($search)) {
        $builder->like('store_name', $search);
    }

    $query = $builder->get();

    return $this->response->setJSON([
        "status" => true,
        "data" => $query->getResult()
    ]);
}
public function deleteStoreProduct($id)
{
    $productModel = new ProductModel();

    $productModel->delete($id);

    return $this->response->setJSON([
        "status" => true,
        "message" => "Product deleted successfully"
    ]);
}

}