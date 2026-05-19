<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;

class JWTFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getHeaderLine('Authorization');

        if (!$authHeader) {
            return service('response')->setJSON([
                "status" => false,
                "message" => "Token Missing"
            ])->setStatusCode(401);
        }

        try {

            $token = explode(" ", $authHeader)[1];

            $jwt = new \App\Libraries\JWTService();
            $jwt->validateToken($token);

        } catch (\Exception $e) {

            return service('response')->setJSON([
                "status" => false,
                "message" => "Invalid Token"
            ])->setStatusCode(401);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
    }
}