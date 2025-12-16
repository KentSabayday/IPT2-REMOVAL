<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>{{ config('app.name', 'Product Inventory Manager') }}</title>
    
    <!-- Styles -->
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">
    <link href="{{ mix('css/product-inventory.css') }}" rel="stylesheet">
</head>
<body>
    <div id="inventory-root"></div>
    
    <!-- Scripts -->
    <script src="{{ mix('js/app.js') }}"></script>
</body>
</html>
