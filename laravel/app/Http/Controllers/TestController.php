<?php

namespace App\Http\Controllers;

use App\Exceptions\Error;
use App\Models\Order;
use Illuminate\Http\Request;

class TestController extends Controller
{
    public function index(Request $request)
    {
        $res = is_null('1');

        return $this->ok(['data' => $res]);
    }

    public function testTryCatch()
    {
        [$err, $res] = tryCatch(function () {
            $order = Order::find(1);

            throwNotFoundWhenEmpty($order, 'Order Not Found');

            return $order;
        });

        if ($err) {
            throw Error::server($err->getMessage());
        }

        return $res;
    }

    public function testTime()
    {
        // get minus time 2 hours with carbon type = string <yyyy-mm-ddThh:mm[:ss[.fff]]Z>
        $time = now()->subHours(2)->toIso8601String();
        return $time;

        // get minus time 45 minutes with carbon type = string <yyyy-mm-ddThh:mm[:ss[.fff]]Z>
        $time = now()->subMinutes(45)->toIso8601String();
    }

    public function testError()
    {
        [$err, $res] = tryCatch(function () {
            $number = 1;

            $this->someErrorFunction();

            return $number;
        });

        if ($err) {
            throw Error::server($err->getMessage());
        }

        return $res;
    }

    public function someErrorFunction()
    {
        $undefined_variable = $undefined_variable + 1;
    }
}