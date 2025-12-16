<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class ValidateProjectRequirements extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'project:validate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Validate that the project meets Laravel 7 + React.js requirements';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('');
        $this->info('╔══════════════════════════════════════════════════════════════╗');
        $this->info('║       PROJECT REQUIREMENTS VALIDATION                        ║');
        $this->info('║       Laravel 7 (Backend) + React.js (Frontend)              ║');
        $this->info('╚══════════════════════════════════════════════════════════════╝');
        $this->info('');

        $allPassed = true;
        $results = [];

        // 1. Validate Laravel Version
        $this->info('Checking Backend Requirements...');
        $this->line('─────────────────────────────────────────');
        
        $laravelVersion = app()->version();
        $isLaravel7Compatible = version_compare($laravelVersion, '7.0.0', '>=') && version_compare($laravelVersion, '9.0.0', '<');
        
        if ($isLaravel7Compatible) {
            $this->line('  ✓ Laravel Version: ' . $laravelVersion . ' (Laravel 7.x/8.x compatible)');
            $results['Laravel'] = true;
        } else {
            $this->error('  ✗ Laravel Version: ' . $laravelVersion . ' (Requires Laravel 7.x)');
            $results['Laravel'] = false;
            $allPassed = false;
        }

        // 2. Check if API routes exist
        $apiRoutesExist = File::exists(base_path('routes/api.php'));
        if ($apiRoutesExist) {
            $this->line('  ✓ API Routes file exists (routes/api.php)');
            $results['API Routes'] = true;
        } else {
            $this->error('  ✗ API Routes file missing (routes/api.php)');
            $results['API Routes'] = false;
            $allPassed = false;
        }

        // 3. Check for Models
        $modelsExist = File::exists(app_path('Models/Product.php'));
        if ($modelsExist) {
            $this->line('  ✓ Product Model exists (app/Models/Product.php)');
            $results['Product Model'] = true;
        } else {
            $this->error('  ✗ Product Model missing (app/Models/Product.php)');
            $results['Product Model'] = false;
            $allPassed = false;
        }

        // 4. Check for Controllers (check both locations)
        $controllerPath = app_path('Http/Controllers/ProductController.php');
        $apiControllerPath = app_path('Http/Controllers/Api/ProductController.php');
        $controllerExists = File::exists($controllerPath) || File::exists($apiControllerPath);
        
        if ($controllerExists) {
            $location = File::exists($apiControllerPath) ? 'Api/ProductController.php' : 'ProductController.php';
            $this->line('  ✓ ProductController exists (' . $location . ')');
            $results['ProductController'] = true;
        } else {
            $this->error('  ✗ ProductController missing');
            $results['ProductController'] = false;
            $allPassed = false;
        }

        $this->info('');
        $this->info('Checking Frontend Requirements...');
        $this->line('─────────────────────────────────────────');

        // 5. Check package.json for React
        $packageJsonPath = base_path('package.json');
        $hasReact = false;
        $reactVersion = 'Not found';
        
        if (File::exists($packageJsonPath)) {
            $packageJson = json_decode(File::get($packageJsonPath), true);
            $dependencies = array_merge(
                $packageJson['dependencies'] ?? [],
                $packageJson['devDependencies'] ?? []
            );
            
            if (isset($dependencies['react'])) {
                $hasReact = true;
                $reactVersion = $dependencies['react'];
            }
        }

        if ($hasReact) {
            $this->line('  ✓ React.js installed: ' . $reactVersion);
            $results['React.js'] = true;
        } else {
            $this->error('  ✗ React.js not found in package.json');
            $results['React.js'] = false;
            $allPassed = false;
        }

        // 6. Check for React DOM
        $hasReactDom = false;
        $reactDomVersion = 'Not found';
        
        if (File::exists($packageJsonPath)) {
            $packageJson = json_decode(File::get($packageJsonPath), true);
            $dependencies = array_merge(
                $packageJson['dependencies'] ?? [],
                $packageJson['devDependencies'] ?? []
            );
            
            if (isset($dependencies['react-dom'])) {
                $hasReactDom = true;
                $reactDomVersion = $dependencies['react-dom'];
            }
        }

        if ($hasReactDom) {
            $this->line('  ✓ React DOM installed: ' . $reactDomVersion);
            $results['React DOM'] = true;
        } else {
            $this->error('  ✗ React DOM not found in package.json');
            $results['React DOM'] = false;
            $allPassed = false;
        }

        // 7. Check for React components
        $componentsPath = resource_path('js/components');
        $hasComponents = File::isDirectory($componentsPath) && count(File::files($componentsPath)) > 0;
        
        if ($hasComponents) {
            $componentFiles = File::files($componentsPath);
            $this->line('  ✓ React Components found: ' . count($componentFiles) . ' file(s)');
            foreach ($componentFiles as $file) {
                $this->line('    - ' . $file->getFilename());
            }
            $results['React Components'] = true;
        } else {
            $this->error('  ✗ No React components found in resources/js/components');
            $results['React Components'] = false;
            $allPassed = false;
        }

        // 8. Check for Laravel Mix (webpack)
        $hasMix = File::exists(base_path('webpack.mix.js'));
        if ($hasMix) {
            $this->line('  ✓ Laravel Mix configured (webpack.mix.js)');
            $results['Laravel Mix'] = true;
        } else {
            $this->error('  ✗ Laravel Mix not configured');
            $results['Laravel Mix'] = false;
            $allPassed = false;
        }

        // 9. Check for compiled assets
        $this->info('');
        $this->info('Checking Compiled Assets...');
        $this->line('─────────────────────────────────────────');

        $compiledJs = File::exists(public_path('js/app.js'));
        $compiledCss = File::exists(public_path('css/app.css'));

        if ($compiledJs) {
            $this->line('  ✓ Compiled JavaScript exists (public/js/app.js)');
            $results['Compiled JS'] = true;
        } else {
            $this->warn('  ⚠ Compiled JavaScript missing - run: npm run dev');
            $results['Compiled JS'] = false;
        }

        if ($compiledCss) {
            $this->line('  ✓ Compiled CSS exists (public/css/app.css)');
            $results['Compiled CSS'] = true;
        } else {
            $this->warn('  ⚠ Compiled CSS missing - run: npm run dev');
            $results['Compiled CSS'] = false;
        }

        // Summary
        $this->info('');
        $this->info('╔══════════════════════════════════════════════════════════════╗');
        $this->info('║                      VALIDATION SUMMARY                      ║');
        $this->info('╚══════════════════════════════════════════════════════════════╝');
        $this->info('');

        $passed = 0;
        $failed = 0;

        foreach ($results as $check => $status) {
            if ($status) {
                $passed++;
            } else {
                $failed++;
            }
        }

        $this->line("  Total Checks: " . count($results));
        $this->line("  ✓ Passed: {$passed}");
        
        if ($failed > 0) {
            $this->line("  ✗ Failed: {$failed}");
        }

        $this->info('');

        if ($allPassed) {
            $this->info('╔══════════════════════════════════════════════════════════════╗');
            $this->info('║  ✓ SUCCESS: Project meets Laravel 7 + React.js requirements! ║');
            $this->info('╚══════════════════════════════════════════════════════════════╝');
            return 0;
        } else {
            $this->error('╔══════════════════════════════════════════════════════════════╗');
            $this->error('║  ✗ FAILED: Some requirements are not met. See above.         ║');
            $this->error('╚══════════════════════════════════════════════════════════════╝');
            return 1;
        }
    }
}
