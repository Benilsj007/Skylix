<?php

namespace App\Libraries;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JWTService
{
private $key = "my_super_secret_jwt_key_2026_for_ecommerce_project_backend_security";    
public function generateToken($user)
    {
        $payload = [
            "iss" => "localhost",
            "iat" => time(),
            "exp" => time() + 3600, // 1 hour
            "data" => [
                "id" => $user->id,
                "email" => $user->email,
                "role" => $user->role,
                "name" => $user->name
            ]
        ];

        return JWT::encode($payload, $this->key, 'HS256');
    }

    public function validateToken($token)
    {
        return JWT::decode($token, new Key($this->key, 'HS256'));
    }
}