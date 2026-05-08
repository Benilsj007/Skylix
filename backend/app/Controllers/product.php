<?php
namespace App\Controllers;

use App\Models\ProductModel;
use CodeIgniter\RESTful\ResourceController;

class User extends ResourceController
{
    public function registerFromSheet()
    {
        // Get JSON data
        $data = $this->request->getJSON(true);

        $model = new ProductModel();

        // Save data (insert or update)
        $model->save([
            'name' => $data['name'],
            'price' => $data['email'],
            'description' => $data['phone'],
            'image' => $data['address'],
            'category' => $data['gender'],
            'stock' => $data['password']
        ]);

        return $this->respond([
            "status" => "success",
            // "message" => "User saved from Google Sheet"
        ]);
    }
}