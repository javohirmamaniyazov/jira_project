<?php

namespace App\Customs\Services;

use App\Http\Requests\ResendVerificationLinkRequest;
use App\Http\Requests\VerifyEmailRequest;
use App\Models\EmailVerificationToken;
use App\Models\User;
use App\Notifications\EmailVerificationNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;

class EmailVerificationService {

    public function sendVerificationLink($user) {
        Notification::send($user, new EmailVerificationNotification($this->generateVerificationLink($user->email)));
    }

    public function resendLink($email) {
        $user = User::where('email', $email)->first();
        if($user) {
            $this->sendVerificationLink($user);
            return response()->json([
                'status' => 'success',
                'message' => 'Verification Link Resend Successfully'
            ]);
        } else {
            response()->json([
                'status'=> 'failed',
                'message' => 'User Not Found'
            ]);
        }
    }

    public function checkIfEmailIsVerified($user) {
        if($user->email_verified_at) {
            response()->json([
                'status'=> 'failed',
                'message' => 'Email has already been verified'
            ])->send();
            exit;
        }
    }

    


    public function verifyEmail($email, $token) {
        $user = User::where('email', $email)->first();
        if(!$user) {
            response()->json([
                'status'=> 'failed',
                'message' => 'User Not Found'
            ])->send();
            exit;
        }
        $this->checkIfEmailIsVerified(($user));
        $verifiedToken = $this->verifyToken($email, $token);
        if($user->markEmailAsVerified()) {
            $verifiedToken->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Email has been Verified Successfully'
            ]);
        } else {
            return response()->json([
                'status' => 'failed',
                 'message' => 'Email Verification failed, please try again later'
            ]);
        }
    }

    public function verifyToken($email, $token){
        $token = EmailVerificationToken::where('email', $email)->where('token', $token)->first();
        if($token) {
            if($token->expired_at >= now()){
                return $token;
            } else {
                 return response()->json([
                    'status' => 'failed',
                    'message' => 'Token expired'
                 ])->send();
                 exit;
            }
        } else {
            return response()->json([
                'status' => 'failed', 
                'message' => 'Invalid Token'
            ])->send();
            exit;
        }
    }

    public function generateVerificationLink($email) {
        $checkIfTokenExist = EmailVerificationToken::where('email', $email)->first();
        if($checkIfTokenExist) $checkIfTokenExist->delete();
        $token = Str::uuid();
        $url = config('app.url')."?token=".$token."&email=".$email;
        $savedToken = EmailVerificationToken::create([
            "email" => $email,
            "token" => $token,
            "expired_at" => now()->addMinutes(100)
        ]);
        if($savedToken) {
            return $url;
        }
    }
}