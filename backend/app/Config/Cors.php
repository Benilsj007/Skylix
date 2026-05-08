<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Cors extends BaseConfig
{
    public array $default = [

        // React frontend origin
        'allowedOrigins' => ['http://localhost:3000'],

        'allowedOriginsPatterns' => [],

        // 'supportsCredentials' => false,

        // Allow all headers
        'allowedHeaders' => ['*'],

        'exposedHeaders' => [],

        // Allowed HTTP methods
        'allowedMethods' => ['GET','POST','PUT','DELETE','OPTIONS'],
        'supportsCredentials' => true,

        // Cache preflight request
        'maxAge' => 7200,
    ];
}