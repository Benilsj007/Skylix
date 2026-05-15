<?php

namespace App\Libraries;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

use App\Models\ProductModel;
use App\Models\MobileModel;
use App\Models\LaptopModel;
use App\Models\ElectronicsModel;

class ExcelSyncService
{
    public function sync()
    {
        $productModel = new ProductModel();
        $mobileModel = new MobileModel();
        $laptopModel = new LaptopModel();
        $electronicsModel = new ElectronicsModel();

        $products = $productModel->findAll();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // HEADER
        $headers = [
            "id","name","price","description","image","category","stock","store_id","store_name",
            "processor","ram","storage","camera","battery","charger","brand",
            "l_processor","l_ram","l_storage","graphics","screen","l_charger","l_brand",
            "type","power","warranty","e_brand"
        ];

        $sheet->fromArray($headers, null, "A1");

        $rowIndex = 2;

        foreach ($products as $p) {

            $row = array_fill(0, 27, "");

            // product
            $row[0] = $p['id'];
            $row[1] = $p['name'];
            $row[2] = $p['price'];
            $row[3] = $p['description'];
            $row[4] = $p['image'];
            $row[5] = $p['category'];
            $row[6] = $p['stock'];
            $row[7] = $p['store_id'];
            $row[8] = $p['store_name'];

            // mobile
            if ($p['category'] == "Mobile") {
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

            // laptop
            elseif ($p['category'] == "Laptop") {
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

            // electronics
            else {
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

        $writer = new Xlsx($spreadsheet);
        $filePath = WRITEPATH . "products_master.xlsx";
        $writer->save($filePath);

        return $filePath;
    }
}