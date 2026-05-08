<?php

namespace App\Controllers;
use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;

class User extends ResourceController
{
    public function registerFromSheet()
    {
        // Get JSON data
        $data = $this->request->getJSON(true);

        $model = new UserModel();

        // Save data (insert or update)
        $model->save([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'address' => $data['address'],
            'gender' => $data['gender'],
            'password' => $data['password']
        ]);

        return $this->respond([
            "status" => "success",
            "message" => "User saved from Google Sheet"
        ]);
    }
}