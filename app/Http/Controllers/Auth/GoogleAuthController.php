<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback(): RedirectResponse
    {
        $googleUser = Socialite::driver('google')->user();

        $user = User::where('google_id', $googleUser->id)->first();

        if (! $user) {
            $user = User::where('email', $googleUser->email)->first();

            if ($user) {
                $user->google_id = $googleUser->id;
                $user->avatar = $googleUser->avatar;
                $user->save();
            } else {
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'avatar' => $googleUser->avatar,
                    'password' => bcrypt('google_'.uniqid()),
                ]);
            }
        }

        Auth::login($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
