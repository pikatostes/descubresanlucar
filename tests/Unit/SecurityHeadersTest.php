<?php

namespace Tests\Unit;

use App\Http\Middleware\SecurityHeaders;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Tests\TestCase;

class SecurityHeadersTest extends TestCase
{
    use RefreshDatabase;

    public function test_security_headers_are_set(): void
    {
        $request = Request::create('/');

        $middleware = new SecurityHeaders();

        $response = $middleware->handle($request, function () {
            return new Response();
        });

        $this->assertEquals('nosniff', $response->headers->get('X-Content-Type-Options'));
        $this->assertEquals('SAMEORIGIN', $response->headers->get('X-Frame-Options'));
        $this->assertEquals('1; mode=block', $response->headers->get('X-XSS-Protection'));
        $this->assertEquals('strict-origin-when-cross-origin', $response->headers->get('Referrer-Policy'));
        $this->assertEquals('camera=(), microphone=(), geolocation=()', $response->headers->get('Permissions-Policy'));
    }

    public function test_hsts_header_only_in_production(): void
    {
        $this->app->bind('env', function () {
            return 'production';
        });

        $request = Request::create('/');

        $middleware = new SecurityHeaders();

        $response = $middleware->handle($request, function () {
            return new Response();
        });

        $this->assertEquals('max-age=31536000; includeSubDomains', $response->headers->get('Strict-Transport-Security'));

        $this->app->bind('env', function () {
            return 'local';
        });

        $response = $middleware->handle($request, function () {
            return new Response();
        });

        $this->assertNull($response->headers->get('Strict-Transport-Security'));
    }
}