<?php
namespace App\Models;

use CodeIgniter\Model;

class ProductModel extends Model
{
    protected $table = 'products';

    protected $primaryKey = 'id';

    protected $returnType = 'array';


    protected $allowedFields = [
        'id',
        'name',
        'price',
        'description',
        'image',
        'category',
        'stock'
];
}
?>