<?php

namespace App\Utils;

use DB;

class TransactionUtil
{
    public static function start($callback)
    {
        try {
            DB::beginTransaction();
            $res = $callback();
            DB::commit();
            return [null, $res];
        } catch (\Exception $e) {
            DB::rollBack();
            return [$e, null];
        }
    }
}