<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AppController extends Controller
{
    /**
     * Show the React application
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('app');
    }
}
