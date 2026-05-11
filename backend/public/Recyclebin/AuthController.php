<?php

namespace App\Controllers;

use CodeIgniter\Controller;

class AuthController extends Controller
{
    public function login()
    {
        try {

            $db = \Config\Database::connect();
            $data = $this->request->getJSON(true);

            if (!$data) {
                return $this->response->setJSON([
                    "status" => false,
                    "message" => "Invalid JSON input"
                ]);
            }

            $email = $data['email'] ?? null;
            $password = $data['password'] ?? null;

            if (!$email || !$password) {
                return $this->response->setJSON([
                    "status" => false,
                    "message" => "Email and password required"
                ]);
            }

            // USER CHECK
            $user = $db->table('login_details')
                ->where('email', $email)
                ->where('password', $password)
                ->get()
                ->getRow();

            if (!$user) {
                return $this->response->setJSON([
                    "status" => false,
                    "message" => "Invalid credentials"
                ]);
            }

            // 🔥 SAFE JWT LOADING
            if (!class_exists('\App\Libraries\JWTService')) {
                return $this->response->setJSON([
                    "status" => false,
                    "message" => "JWTService not found"
                ]);
            }

            $jwt = new \App\Libraries\JWTService();
            $token = $jwt->generateToken($user);

            return $this->response->setJSON([
                "status" => true,
                "access_token" => $token,
                "user" => [
                    "id" => $user->id,
                    "name" => $user->name,
                    "email" => $user->email,
                    "role" => $user->role
                ]
            ]);

        } catch (\Throwable $e) {

    return $this->response->setJSON([
        "status" => false,
        "message" => "REAL ERROR BELOW",
        "error" => $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    ]);
}
    }
}