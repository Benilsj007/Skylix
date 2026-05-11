<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Cors extends BaseConfig
{
    /**
     * @var array<int, string>
     */
    public array $allowedOrigins = [
        'http://localhost:3000',
    ];

    /**
     * @var array<int, string>
     */
    public array $allowedOriginsPatterns = [];

    /**
     * @var array<int, string>
     */
    public array $supportedHeaders = [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization'
    ];

    /**
     * @var array<int, string>
     */
    public array $supportedMethods = [
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'OPTIONS'
    ];

    /**
     * @var int
     */
    public int $maxAge = 3600;

    /**
     * @var bool
     */
    public bool $supportsCredentials = true;
}