<?php
/**
 * Created by PhpStorm.
 * User: ken
 * Date: 19/11/15
 * Time: 20:38
 */

$connection = mysql_connect('localhost', 'root', 'root');
mysql_select_db('bubbletypinggame', $connection) or die('Cannot select db');

$action = isset($_REQUEST['action']) ? strip_tags($_REQUEST['action']) : null;

switch($action)
{
    case 'register_score':

        if(empty($_REQUEST['username'])) break;

        mysql_query("INSERT INTO `score` SET
          `username` = '".mysql_real_escape_string($_REQUEST['username'])."',
          `characters` = '".mysql_real_escape_string($_REQUEST['characters'])."',
          `seconds` = '".mysql_real_escape_string($_REQUEST['seconds'])."',
          `date` = '".time()."'
        ") or die("Error!!");

        break;

    default:
        break;
}
