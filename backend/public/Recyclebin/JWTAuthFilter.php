<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use App\Libraries\JWTService;

class JWTAuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getHeaderLine("Authorization");

        if (!$authHeader) {
            return service('response')->setJSON([
                "status" => false,
                "message" => "Token required"
            ])->setStatusCode(401);
        }

        $token = str_replace("Bearer ", "", $authHeader);

        $jwt = new JWTService();
        $decoded = $jwt->validateToken($token);

        if (!$decoded) {
            return service('response')->setJSON([
                "status" => false,
                "message" => "Invalid or expired token"
            ])->setStatusCode(401);
        }

        // attach user data globally
        $request->user = $decoded->data;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // nothing
    }
}