<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class AutoAssign extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cron:autoAssign';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cron auto assign job';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $response = app('App\Http\Controllers\ChatsController')->cronAutoAssign();
        return Command::SUCCESS;
    }
}
