<?php
if (!defined('MODX_BASE_PATH')) {
	http_response_code(403);
	die('For'); 
}

$e =& $modx->event;
$params = $e->params;

switch ($e->name) {
	case "OnDocFormRender":
		break;
	case "OnWebPagePrerender":
		break;
	default:
		break;
}
