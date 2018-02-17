<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\TestMail;
use Illuminate\Support\Facades\Mail;

class GeneralController extends Controller
{
    //
    public function testMail()
    {
        // Mail::to('devamnarkar96@gmail.com')
        // ->queue(new TestMail());

        return view('workfromhome');
    }
}
