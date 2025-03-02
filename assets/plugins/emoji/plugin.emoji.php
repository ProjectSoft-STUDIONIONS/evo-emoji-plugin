<?php
if (!defined('MODX_BASE_PATH')) {
	http_response_code(403);
	die('For'); 
}

$e =& $modx->event;
$params = $e->params;

switch ($e->name) {
	case "OnDocFormRender":
		// Подключить html, js и css
		$content = file_get_contents(__DIR__ . '/plugin.html');
		$modx->event->output($content);
		break;
	case "OnWebPagePrerender":
		// Подключить emoji.css
		// $modx->event->output($content);
		break;
	default:
		break;
}
