<?php

namespace App\UseCase;

class BaseUseCase
{
    final public function success($res = null)
    {
        return [$res, null, null];
    }

    final public function error($err = null, $code = null)
    {
        return [null, $err, $code];
    }
}
