<?php

namespace App\Traits;

trait ErrorHandlerTrait
{
    private function success($res = null)
    {
        return [null, $res];
    }

    private function error($err = null)
    {
        return [$err, null];
    }
}