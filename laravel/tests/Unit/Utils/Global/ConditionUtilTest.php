<?php

require_once __DIR__ . '/../../../../app/Utils/Global/ConditionUtil.php';

test('checks if value is empty', function () {
    expect(isEmpty(null))->toBeTrue();
    expect(isEmpty(''))->toBeTrue();
    expect(isEmpty([]))->toBeTrue();
    expect(isEmpty(false))->toBeTrue();
    expect(isEmpty('0'))->toBeFalse();
    expect(isEmpty(0))->toBeFalse();
    expect(isEmpty('1'))->toBeFalse();
    expect(isEmpty(1))->toBeFalse();
    expect(isEmpty(['']))->toBeFalse();
    expect(isEmpty(true))->toBeFalse();
    expect(isEmpty('not empty'))->toBeFalse();
});

test('checks if value is not empty', function () {
    expect(isNotEmpty(null))->toBeFalse();
    expect(isNotEmpty(''))->toBeFalse();
    expect(isNotEmpty([]))->toBeFalse();
    expect(isNotEmpty(false))->toBeFalse();
    expect(isNotEmpty('0'))->toBeTrue();
    expect(isNotEmpty(0))->toBeTrue();
    expect(isNotEmpty('1'))->toBeTrue();
    expect(isNotEmpty(1))->toBeTrue();
    expect(isNotEmpty(['']))->toBeTrue();
    expect(isNotEmpty(true))->toBeTrue();
    expect(isNotEmpty('not empty'))->toBeTrue();
});