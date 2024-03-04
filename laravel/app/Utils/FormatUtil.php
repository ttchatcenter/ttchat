<?php

namespace App\Utils;

class FormatUtil
{
    private $text = '';

    public static function withMessage()
    {
        $self = new self();
        return $self;
    }

    public function add(array $texts)
    {
        foreach ($texts as $key => $text) {
            $this->text .= "$text\n";
        }
        return $this;
    }

    public function addIf($condition, array $texts)
    {
        if ($condition) {
            foreach ($texts as $key => $text) {
                $this->text .= "$text\n";
            }
        }
        return $this;
    }

    public function get()
    {
        return $this->text;
    }

    public static function price($value)
    {
        return number_format($value, 2, '.', ',');
    }

    public static function numberComma($value)
    {
        return number_format($value, 0, '.', ',');
    }
}