<?php
namespace App\Models;

use CodeIgniter\Model;

class MobileModel extends Model
{
    protected $table = 'mobile_details';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'product_id','processor','ram','storage','camera','battery','charger','brand'
    ];
}
?>