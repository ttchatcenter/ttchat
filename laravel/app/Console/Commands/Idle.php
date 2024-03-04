<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class Idle extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cron:idle';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cron idle status';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $response = app('App\Http\Controllers\AuthController')->cronIdleStatus();
        return Command::SUCCESS;
    }
}
