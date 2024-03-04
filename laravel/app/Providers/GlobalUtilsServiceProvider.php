<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

/**
 * Class GlobalUtilsServiceProvider.
 */
class GlobalUtilsServiceProvider extends ServiceProvider
{
    /**
     * Register bindings in the container.
     */
    public function boot()
    {
        $rdi = new RecursiveDirectoryIterator(app_path('Utils' . DIRECTORY_SEPARATOR . 'Global'));
        $it = new RecursiveIteratorIterator($rdi);

        while ($it->valid()) {
            if (
                !$it->isDot() &&
                $it->isFile() &&
                $it->isReadable() &&
                $it->current()->getExtension() === 'php' &&
                strpos($it->current()->getFilename(), 'Util')
            ) {
                require $it->key();
            }

            $it->next();
        }
    }
}