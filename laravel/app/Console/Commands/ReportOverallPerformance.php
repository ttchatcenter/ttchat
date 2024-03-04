<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ReportOverallPerformance extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cron:reportOverallPerformance';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cron generate data for report';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $response = app('App\Http\Controllers\ReportController')->scriptOverallPerformance();
        return Command::SUCCESS;
    }
}
