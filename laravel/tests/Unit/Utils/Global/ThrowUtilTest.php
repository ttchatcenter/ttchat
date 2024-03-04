<?php

require_once __DIR__ . '/../../../../app/Utils/Global/ThrowUtil.php';

use App\Exceptions\Error;

it('throws a server error when value is empty', function () {
    $this->expectException(Error::class);
    $this->expectExceptionMessage('Server error message');

    throwServerErrorWhenEmpty('', 'Server error message');
});

it('throws a not found error when value is empty', function () {
    $this->expectException(Error::class);
    $this->expectExceptionMessage('Not found error message');

    throwNotFoundWhenEmpty('', 'Not found error message');
});