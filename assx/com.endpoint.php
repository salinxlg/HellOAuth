<?php

header("Content-Type: application/json");

if(isset($_POST["token"])){

    $token = $_POST["token"];
    $url = "https://api.dexly.space/hellopass/dispatch/";

    $data = [
        "secretClient" => "_SET_SECRET_CLIENT",
        "token"        => $token
    ];

    $ch = curl_init($url);

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => http_build_query($data),
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2
    ]);

    $response = curl_exec($ch);

    if(curl_errno($ch)){
        http_response_code(502); 
        echo json_encode([
            "execute" => false,
            "error"   => "Upstream request failed",
            "detail"  => curl_error($ch)
        ]);
        curl_close($ch);
        exit;
    }

    curl_close($ch);

    echo $response;
}