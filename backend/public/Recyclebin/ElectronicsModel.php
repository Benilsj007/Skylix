<?php
namespace App\Models;

use CodeIgniter\Model;
class ElectronicsModel extends Model
{
    protected $table = 'electronics_details';
    protected $primaryKey = 'id';
    
    protected $allowedFields = [
        'product_id','type','power','warranty','brand'
    ];
}
?>