<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use App\Models\ProductModel;
use App\Models\MobileModel;
use App\Models\LaptopModel;
use App\Models\ElectronicsModel;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class ExcelController extends Controller
{
    public function importExcel()
    {
        try {

            $file = $this->request->getFile('file');

            if (!$file || !$file->isValid()) {
                return $this->response->setJSON([
                    "status" => false,
                    "message" => "Invalid file"
                ]);
            }

            if ($file->hasMoved()) {
                return $this->response->setJSON([
                    "status" => false,
                    "message" => "File already moved"
                ]);
            }

            $spreadsheet = IOFactory::load($file->getTempName());
            $rows = $spreadsheet->getActiveSheet()->toArray();

            $productModel = new ProductModel();
            $mobileModel = new MobileModel();
            $laptopModel = new LaptopModel();
            $electronicsModel = new ElectronicsModel();

            foreach ($rows as $i => $row) {

                if ($i == 0) continue;
                if (empty($row[0])) continue;

                $productId = $row[0];
                $categoryRaw = $row[5] ?? '';
                $category = strtolower(trim(preg_replace('/\s+/', ' ', $categoryRaw)));
                $productData = [
                    "name" => $row[1] ?? null,
                    "price" => $row[2] ?? null,
                    "description" => $row[3] ?? null,
                    "image" => $row[4] ?? null,
                    "category" => $row[5] ?? null,
                    "stock" => $row[6] ?? 0,
                    "store_id" => $row[7] ?? null,
                    "store_name" => $row[8] ?? null,
                ];

                $existingProduct = $productModel->find($productId);

                if ($existingProduct) {
                    $productModel->update($productId, $productData);
                } else {
                    $productData["id"] = $productId;
                    $productModel->insert($productData);
                }
                if (stripos($category, "mobile") !== false) {

                    $data = [
                        "product_id" => $productId,
                        "processor" => $row[9] ?? null,
                        "ram" => $row[10] ?? null,
                        "storage" => $row[11] ?? null,
                        "camera" => $row[12] ?? null,
                        "battery" => $row[13] ?? null,
                        "charger" => $row[14] ?? null,
                        "brand" => $row[15] ?? null,
                    ];

                    $existing = $mobileModel->where('product_id', $productId)->first();

                    if ($existing) {
                        $mobileModel->update($existing['id'], $data);
                    } else {
                        $mobileModel->insert($data);
                    }
                }

                elseif (stripos($category, "laptop") !== false) {

                    $data = [
                        "product_id" => $productId,
                        "processor" => $row[16] ?? null,
                        "ram" => $row[17] ?? null,
                        "storage" => $row[18] ?? null,
                        "graphics_card" => $row[19] ?? null,
                        "screen_size" => $row[20] ?? null,
                        "charger" => $row[21] ?? null,
                        "brand" => $row[22] ?? null,
                    ];

                    $existing = $laptopModel->where('product_id', $productId)->first();

                    if ($existing) {
                        $laptopModel->update($existing['id'], $data);
                    } else {
                        $laptopModel->insert($data);
                    }
                }

                elseif (stripos($category, "Accessories") !== false) {

                    $data = [
                        "product_id" => $productId,
                        "type" => $row[23] ?? null,
                        "power" => $row[24] ?? null,
                        "warranty" => $row[25] ?? null,
                        "brand" => $row[26] ?? null,
                    ];

                    $existing = $electronicsModel->where('product_id', $productId)->first();

                    if ($existing) {
                        $electronicsModel->update($existing['id'], $data);
                    } else {
                        $electronicsModel->insert($data);
                    }
                }
            }

            return $this->response->setJSON([
                "status" => true,
                "message" => "Excel imported successfully"
            ]);

        } catch (\Throwable $e) {
            return $this->response->setJSON([
                "status" => false,
                "error" => $e->getMessage(),
                "line" => $e->getLine()
            ]);
        }
    }

    public function exportExcel()
    {
        $productModel = new ProductModel();
        $mobileModel = new MobileModel();
        $laptopModel = new LaptopModel();
        $electronicsModel = new ElectronicsModel();

        $products = $productModel->findAll();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $headers = [
            "id","name","price","description","image","category","stock","store_id","store_name",
            "mobile_processor","mobile_ram","mobile_storage","mobile_camera","mobile_battery","mobile_charger","mobile_brand",
            "laptop_processor","laptop_ram","laptop_storage","laptop_graphics_card","laptop_screen_size","laptop_charger","laptop_brand",
            "electronics_type","electronics_power","electronics_warranty","electronics_brand"
        ];

        $sheet->fromArray($headers, null, "A1");

        $rowIndex = 2;

        foreach ($products as $p) {

            $row = array_fill(0, 27, "");

            $row[0] = $p['id'];
            $row[1] = $p['name'];
            $row[2] = $p['price'];
            $row[3] = $p['description'];
            $row[4] = $p['image'];
            $row[5] = $p['category'];
            $row[6] = $p['stock'];
            $row[7] = $p['store_id'];
            $row[8] = $p['store_name'];

            // FIX #2: CLEAN CATEGORY MATCH
            $category = strtolower(trim(preg_replace('/\s+/', ' ', $p['category'] ?? '')));

            if (stripos($category, "mobile") !== false) {
                $m = $mobileModel->where('product_id', $p['id'])->first();
                if ($m) {
                    $row[9]  = $m['processor'];
                    $row[10] = $m['ram'];
                    $row[11] = $m['storage'];
                    $row[12] = $m['camera'];
                    $row[13] = $m['battery'];
                    $row[14] = $m['charger'];
                    $row[15] = $m['brand'];
                }
            }

            elseif (stripos($category, "laptop") !== false) {
                $l = $laptopModel->where('product_id', $p['id'])->first();
                if ($l) {
                    $row[16] = $l['processor'];
                    $row[17] = $l['ram'];
                    $row[18] = $l['storage'];
                    $row[19] = $l['graphics_card'];
                    $row[20] = $l['screen_size'];
                    $row[21] = $l['charger'];
                    $row[22] = $l['brand'];
                }
            }

            elseif (stripos($category, "Accessories") !== false) {
                $e = $electronicsModel->where('product_id', $p['id'])->first();
                if ($e) {
                    $row[23] = $e['type'];
                    $row[24] = $e['power'];
                    $row[25] = $e['warranty'];
                    $row[26] = $e['brand'];
                }
            }

            $sheet->fromArray($row, null, "A$rowIndex");
            $rowIndex++;
        }

        $fileName = "products_master.xlsx";

        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header("Content-Disposition: attachment;filename=\"$fileName\"");
        header('Cache-Control: max-age=0');

        $writer = new Xlsx($spreadsheet);
        $writer->save("php://output");
        exit;
    }

   public function uploadProductImage($id)
{
    helper(['filesystem']);

    $productModel = new \App\Models\ProductModel();

    $file = $this->request->getFile('image');

    if (!$file || !$file->isValid()) {
        return $this->response->setJSON([
            'status' => false,
            'message' => 'No valid image uploaded'
        ]);
    }

    $allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

    if (!in_array($file->getMimeType(), $allowedTypes)) {
        return $this->response->setJSON([
            'status' => false,
            'message' => 'Only JPG, PNG, WEBP allowed'
        ]);
    }

    $product = $productModel->find($id);

    if (!$product) {
        return $this->response->setJSON([
            'status' => false,
            'message' => 'Product not found'
        ]);
    }

    if (!empty($product['image'])) {

        $oldPath = FCPATH . 'uploads/' . $product['image'];

        if (file_exists($oldPath)) {
            unlink($oldPath);
        }
    }

    $newName = $file->getRandomName();

    $file->move(FCPATH . 'uploads', $newName);

    $productModel->update($id, [
        'image' => $newName
    ]);

    return $this->response->setJSON([
        'status' => true,
        'message' => 'Image uploaded successfully',
        'image' => $newName
    ]);
}
 public function importUsers()
{
    try {

        $file = $this->request->getFile('file');

        if (!$file || !$file->isValid()) {
            return $this->response->setJSON([
                "status" => false,
                "message" => "Invalid file"
            ]);
        }

        $spreadsheet = IOFactory::load($file->getTempName());
        $rows = $spreadsheet->getActiveSheet()->toArray();

        $userModel = new \App\Models\UserModel();

        foreach ($rows as $i => $row) {

            if ($i == 0) continue; 
            if (empty($row[0])) continue;

            $userId = $row[0];

            $role = strtolower(trim($row[7] ?? 'user'));

            if (!in_array($role, ['admin', 'user', 'store owner'])) {
                $role = 'user';
            }

            $data = [
                "name"     => $row[1] ?? null,
                "email"    => $row[2] ?? null,
                "phone"    => $row[3] ?? null,
                "address"  => $row[4] ?? null,
                "gender"   => $row[5] ?? null,

                "password" => $row[6] ?? '',

                "role"     => $role
            ];

            $existing = $userModel->find($userId);

            if ($existing) {
                $userModel->update($userId, $data);
            } else {
                $data["id"] = $userId;
                $userModel->insert($data);
            }
        }

        return $this->response->setJSON([
            "status" => true,
            "message" => "Users imported successfully"
        ]);

    } catch (\Throwable $e) {
        return $this->response->setJSON([
            "status" => false,
            "error" => $e->getMessage(),
            "line" => $e->getLine()
        ]);
    }
}
public function exportUsers()
{
    $userModel = new \App\Models\UserModel();
    $users = $userModel->findAll();

    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();

    $headers = [
        "id",
        "name",
        "email",
        "phone",
        "address",
        "gender",
        "password",
        "role"
    ];

    $sheet->fromArray($headers, null, "A1");

    $rowIndex = 2;

    foreach ($users as $u) {

        $row = [
            $u['id'],
            $u['name'],
            $u['email'],
            $u['phone'],
            $u['address'],
            $u['gender'],

            // 🔴 NO HASHED PASSWORD
            $u['password'],

            in_array($u['role'], ['admin','user','store owner'])
                ? $u['role']
                : 'user'
        ];

        $sheet->fromArray($row, null, "A$rowIndex");
        $rowIndex++;
    }

    $fileName = "users.xlsx";

    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header("Content-Disposition: attachment;filename=\"$fileName\"");
    header('Cache-Control: max-age=0');

    $writer = new Xlsx($spreadsheet);
    $writer->save("php://output");
    exit;
}
}