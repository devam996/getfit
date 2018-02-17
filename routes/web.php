<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

$workFromHomeRoutes = function (){
    Route::get('/', 'GeneralController@testMail');
};

$getFitRoutes = function (){
    Route::get('/', function(){
        return view('welcome');
    });
};

// Match my own domain

Route::group(['domain' => 'workfromhome.local'], $workFromHomeRoutes);
Route::group(['domain' => 'getfit.local'], $getFitRoutes);
