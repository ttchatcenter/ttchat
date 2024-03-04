<?php

namespace App\Utils;

use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class FileUtil
{
    public function gen_uuid()
    {
        return sprintf( '%04x%04x%04x%04x%04x',
            mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),
            mt_rand( 0, 0xffff ),
            mt_rand( 0, 0x0fff ) | 0x4000,
            mt_rand( 0, 0x3fff ) | 0x8000
        );
    }

    public static function uploadImage($args)
    {

        @[
            'file' => $file,
            'path' => $path,
            'width' => $width,
            'height' => $height
        ] = $args;

        $width = $width ?? 640;
        $height = $height ?? 640;

        $_image = Image::make($file);
        $_image->resize($width, $height, function ($constraint) {
            $constraint->aspectRatio();
        });

        $fileName = "{gen_uuid()}.{$file->getClientOriginalExtension()}";

        Storage::put($path . $fileName, $_image->stream(), 'public');
        $link = url(Storage::url($path . $fileName));

        return [
            'name' => $fileName,
            'path' => $path,
            'link' => $link,
        ];
    }

    public static function uploadFile($args)
    {

        @[
            'file' => $file,
            'path' => $path,
        ] = $args;

        print_r($file);
        $fileName = "{gen_uuid()}.{$file->getClientOriginalExtension()}";

        Storage::put($path . $fileName, file_get_contents($file), 'public');
        $link = url(Storage::url($path . $fileName));

        return [
            'name' => $fileName,
            'path' => $path,
            'link' => $link,
        ];
    }
}