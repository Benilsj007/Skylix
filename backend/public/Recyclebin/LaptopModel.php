<?php
namespace App\Models;

use CodeIgniter\Model;

class LaptopModel extends Model
{
    protected $table = 'laptop_details';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'product_id','processor','ram','storage','charger','graphics_card','screen_size','brand'
    ];
}
?>