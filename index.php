<?php 
/**
* jquery.fixheadertable
*
* Copyright (c) 2010 Benjamin Léouzon
* http://www.tablefixedheader.com/
*
* Licensed under MIT
* http://www.opensource.org/licenses/mit-license.php
*
* Launch  : December 2010
* Version : 2.0
*/
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<title>Full page demo | table fixed header</title>			
			
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.4/jquery-ui.min.js"></script>
		
		<link rel="stylesheet" type="text/css" href="jquery-ui/css/redmond/jquery-ui-1.8.4.custom.css"/>
		<link rel="stylesheet" type="text/css" href="jquery-ui/css/ui-lightness/jquery-ui-1.8.4.custom.css"/>
		<link rel="stylesheet" type="text/css" href="jquery-ui/css/smoothness/jquery-ui-1.8.4.custom.css"/>
		<link rel="stylesheet" type="text/css" href="jquery-ui/css/flick/jquery-ui-1.8.4.custom.css" id="link"/>
		<link rel="stylesheet" type="text/css" href="css/base.css" />
		
		<script type="text/javascript" src="highlighter/codehighlighter.js"></script>	
		<script type="text/javascript" src="highlighter/javascript.js"></script>			
		<script type="text/javascript" src="javascript/jquery.fixheadertable.min.js"></script>		
		
		<script type="text/javascript">  
					
			$(document).ready(function() {  	

				$('div.title').each(function(i){
					$(this).prepend('<a name="ex_' + (i+1) + '" />');
					$('#links').append('<a title="' + $('span', this).html() + '" class="ui-state-default ui-corner-all" href="#ex_' + (i+1) + '"><span style="float: left; margin-right: 0.3em; margin-top : -2px;" class="ui-icon ui-icon-triangle-1-e"></span> Example #' + (i+1) + '</a>');
				});

				$('<br/><a style="cursor : pointer">[ Show code ]</a>').insertBefore('pre').click(function(){
					if($(this).html() == "[ Show code ]"){
						$(this).html("[ Hide code ]");
					}else{
						$(this).html("[ Show code ]");
					}						
					$(this).next('pre').toggle();
				});
				
				$.ajax({						
					url: 'data.php',						
					success: function(data) {
					$('#0').html(data).fixheadertable({ 
							caption : 'My employees (200)', 
							colratio : [100, 150, 150, 150, 220, 150], 
							height : 300, 
							width : 800, 
							zebra : true, 
							sortable : true,
							sortedColId : 1, 
							resizeCol : true,
							pager : true,
							rowsPerPage	 : 10,
							sortType : ['integer', 'string', 'string', 'string', 'string', 'date'],
							dateFormat : 'm/d/Y'
						});
					}
				});
				
				function buildtable(id, data) {
					$(id).html(data);					
					if(id == "#1")
						$('#1').fixheadertable({ height : 200, zebra : true });
					if(id == "#2")
						$('#2').fixheadertable({ caption : 'My employees', height : 200, width : 800 });
					if(id == "#3")
						$('#3').fixheadertable({ caption : 'My employees', height : 200, width : 800, minWidth : 1000 });
					if(id == "#4")
						$('#4').fixheadertable({ caption : 'My employees', colratio : [50, 150, 150, 150, 220, 150], height : 200, width : 800, zebra : true, resizeCol : true, minColWidth : 50 });
					if(id == "#5")
						$('#5').fixheadertable({ caption : 'My employees', colratio : [50, 150, 150, 150, 220, 150], height : 200, width : 800, zebra : true, sortable : true, sortedColId : 0, 
							   sortType    : ['integer', 'string', 'string', 'string', 'string', 'date'],
							   dateFormat  : 'm/d/Y' });
					if(id == "#6")
						$('#6').fixheadertable({ 
							caption : 'My employees', 
							colratio : [50, 150, 150, 150, 220, 150], 
							height : 200, 
							width : 800, 
							zebra : true, 
							sortable : true, 
							sortedColId : 2, 
							sortType : ['integer', 'string', 'string', 'string', 'string', 'date'],
							dateFormat : 'm/d/Y',
							pager : true,
							rowsPerPage	 : 10
						});
					if(id == "#7")
						$('#7').fixheadertable({ 
							caption : 'My employees', 
							colratio : [50, 150, 150, 150, 220, 150], 
							height : 200, 
							width : 800, 
							zebra : true, 
							sortable : true, 
							sortedColId : 3, 
							sortType : ['integer', 'string', 'string', 'string', 'string', 'date'],
							dateFormat : 'm/d/Y',
							pager : true,
							rowsPerPage	 : 10,
							resizeCol : true
						});
				};
				
				$("button").button();
				$("button.loadexample").click(function(){
					var button = this;
					if($(button).attr('pass')) return;
					$('span', this).append('<span class="text">loading...</span>');
					$.ajax({						
						url: 'data.php',						
						success: function(data) {
							buildtable($(button).attr('num'), data);
							$('span.text', button).remove();
							$('span.ui-button-text', button).html('Example loaded !');
							$(button).attr('pass', 'pass');
						}
					});
				});
				$("#lightness").click(function() { $('#link').attr('href', 'jquery-ui/css/ui-lightness/jquery-ui-1.8.4.custom.css'); });
				$("#flick").click(function() { $('#link').attr('href', 'jquery-ui/css/flick/jquery-ui-1.8.4.custom.css'); });
				$("#redmond").click(function() { $('#link').attr('href', 'jquery-ui/css/redmond/jquery-ui-1.8.4.custom.css'); });
				$("#smoothness").click(function() { $('#link').attr('href', 'jquery-ui/css/smoothness/jquery-ui-1.8.4.custom.css'); });
			});
		</script>		
		<style type="text/css">		
			body {
				font-family : Verdana,Arial,Geneva,Helvetica,sans-serif;
				font-size	: 10px;
			}
			
			pre {				
				padding		: 5px;	
				font-size	: 12px;
				border		: 2px solid #F0F0F0;
				background	: #F5F5F5;
				width		: 100%;
				display		: none;
				width 		: 800px
			}
			
			.javascript  .comment {
				color : green; 
			}
			
			.javascript  .string {
				color : maroon;
			}
			
			.javascript  .keywords {
				font-weight : bold;
			}
			
			.javascript  .global {
				color : blue;
				font-weight : bolder;
			}
			
			.javascript  .brackets {
				color : Gray;
			}
			
			.javascript  .thing {
				font-size : 10px;
			}			
			
			span.text {
				font-weight : normal;
				font-style	: italic;
				margin-left : 10px;			
			}		
			
			div.title {
				font-size	: 18px;
				padding 	: 15px 0;
				font-weight : bold;
			}
			
			div.title span {
				font-weight : normal;
			}
			
			div.themes {
				overflow	: hidden;
    			width		: 150px;
    			position	: fixed;
    			top			: 180px;
    			left		: 10px;
			}
			
			div.themes button {
				width		: 120px;
				margin-bottom : 5px;
			}
			
			div.themes a {
			    display			: block;
			    font-size		: 1.1em;
			    margin-bottom	: 5px;
			    text-decoration	: none;
			    padding 		: 3px;
			    width			: 120px;
			}
			
			div.themes a:focus {
				outline : none;
			}
			
			div.themes a.top {
				color : black;
			}
			
			div.themes a.top:hover {
				text-decoration : underline;
			}
				
		</style>
	</head>
	<body style="background-color : #FFFFFF; overflow-x : hidden">		
		<div style="background: url(logo.png) no-repeat scroll 98% top transparent;    height: 150px;margin:0 auto;padding:0;position:relative;text-align:left;width:980px;">
			<div style="background:transparent none repeat scroll 0 0;height:8em;margin:7px 0 14px;padding:1em;">
				<div style="width:100%">	
					<h1 style="font-family:'PT+Sans&subset=latin',Helvetica,Verdana,Arial,Sans-Serif;font-size:4em;margin:20px 0 0 8px;">
					<a style="background:transparent none repeat scroll 0 0;color:#444444;outline-color:-moz-use-text-color;outline-style:none;outline-width:medium;text-decoration:none;" title="table fixed header" href="http://www.tablefixedheader.com/">table fixed header</a></h1>
					<div style="color:#444444;font-family:'Lobster',Helvetica,Verdana,Arial,Sans-Serif;font-size:1.3em;margin:0.5em 0 0 8px;">A client-side jQuery plugin to transform your HTML table </div>
				</div>
			</div>
		</div>
		 
		<div class="themes">
			<h2>UI Themes</h2>
			<button id="flick">FLICK</button><br/>
			<button id="lightness">UI-LIGHTNESS</button><br/>	
			<button id="redmond">REDMOND</button><br/>
			<button id="smoothness">SMOOTHNESS</button><br/>
			<br/>
			<h2>Examples</h2>
			<div id="links"><a class="top" href="#">Back to the top</a><br/></div>
		</div>
		<br/>
		
		<!--  EXAMPLES -->
		
		<div style="position : relative; left : 50%; margin-left : -410px; width : 820px;">
		
			<h2 style="font-family:Helvetica,Verdana,Arial,Sans-Serif;color:#444444;font-size:2.7em;font-weight:normal;letter-spacing:-0.05em;margin:0 0 0.5em;">Fullpage demo</h2>
			<div style="border-top:2px solid #F1F2F4;padding:1em 0 0.5em;"></div>
			<!--  THE EXAMPLE -->
			
			<table class="resultset" id="0"></table>
			<pre><code class="javascript">
 $('#0').fixheadertable({
    caption     : 'My employees (200)', 
    colratio    : [100, 150, 150, 150, 220, 150], 
    height      : 300, 
    width       : 800, 
    zebra       : true, 
    sortable    : true,
    sortedColId : 1, 
    resizeCol   : true,
    pager       : true,
    rowsPerPage : 10,
    sortType    : ['integer', 'string', 'string', 'string', 'string', 'date'],
    dateFormat  : 'm/d/Y'
});
		</code></pre>		
		<br/><br/>
		
		<div style="border-top : 3px dashed black">&nbsp;</div>		
		
		<!--  THE EXAMPLE #1 -->
		
		<div class="title">Example #1 : Basic use <span>(just a fixed height and zebra)</span></div>		
		<button class="loadexample" num="#1">Load this example</button><br/><br/>
		<table class="resultset" id="1"></table>
		<pre><code class="javascript">
/**
 * This is a basic use of the plugin. Just set the height option to 
 * have a fixed header table. You can also apply the zebra option which alternate
 * the row style (you can change the applied class with the zebraClass option)
 */
  
$('#1').fixheadertable({ 
    height     : 200, 
    zebra      : true,
    zebraClass : 'ui-state-active' // default
});
		</code></pre>
		<br/><br/>
		
		<div style="border-top : 3px dashed black">&nbsp;</div>		
		
		<!--  THE EXAMPLE #2 -->
		
		<div class="title">Example #2 : Basic use <span>(the same with a caption)</span></div>			
		<button class="loadexample" num="#2">Load this example</button><br/><br/>
		<table class="resultset" id="2"></table>
		<pre><code class="javascript">
/**
 * This is a basic use too with the caption option.
 * Note that natively, there will have a toggle arrow which allow you
 * to show/hide your table. To disable it, set the showhide option to false.
 */

$('#2').fixheadertable({ 
    caption  : 'My employees', 
    showhide : true, // default
    height   : 200, 
    width    : 800
});
		</code></pre>
		<br/><br/>
		
		<div style="border-top : 3px dashed black">&nbsp;</div>
		
		<!--  THE EXAMPLE #3 -->
		
		<div class="title">Example #3 : Medium use <span>(the min-width and horizontal scollbar)</span></div>		
		<button class="loadexample" num="#3">Load this example</button><br/><br/>
		<table class="resultset" id="3"></table>
		<pre><code class="javascript">
/**
 * By default, the table and the columns will resize according to his parent's width. 
 * So if the container is not large enough, the column's overflow will be clipped.
 * But through the minWidth option, you can set the minimum width before horizontal scrolling.
 * You also have the minWidthAuto option, which let the plugin calculate a min-width automatically.
 */
 
$('#3').fixheadertable({ 
    caption  : 'My employees', 
    height   : 200, 
    width    : 800, 
    minWidth : 1000
});
		</code></pre>
		<br/><br/>
		
		<div style="border-top : 3px dashed black">&nbsp;</div>
		
		<!--  THE EXAMPLE #4 -->
		
		<div class="title">Example #4 : Medium use <span>(set the width and make them resizable)</span></div>		
		<button class="loadexample" num="#4">Load this example</button><br/><br/>
		<table class="resultset" id="4"></table>
		<pre><code class="javascript">
/**
 * The colratio option allow you to set an exact width in pixel for each column. To be available,
 * you need to fill the array with as much values as there are columns, else it won't work.
 * (ex : 6 columns => 6 values) ;-)
 * Note that each value means 'the width in pixel'
 *
 * Thanks to the resizeCol option, you can resize manually the columns. This option works ONLY if
 * the colratio option is set and valid! you can set a min-width with the minColWidth option.
 */
 
$('#4').fixheadertable({ 
    caption     : 'My employees', 
    colratio    : [50, 150, 150, 150, 220, 150], 
    height      : 200, 
    width       : 800, 
    zebra       : true,
    resizeCol   : true,
    minColWidth : 50 
});
		</code></pre>
		<br/><br/>
		
		<div style="border-top : 3px dashed black">&nbsp;</div>
		
		<!--  THE EXAMPLE #5 -->
		
		<div class="title">Example #5 : Complex use <span>(sort your columns)</span></div>			
		<button class="loadexample" num="#5">Load this example</button><br/><br/>
		<table class="resultset" id="5"></table>
		<pre><code class="javascript">
/**
 * The sortable option allow you to sort your columns. If the option is set, all the columns
 * will be sortable. By default, the sort callback is 'string' but through the sortType option you
 * can specify the type of sort. 
 * To be available, you need to fill the array with as much values as there are columns, else it won't work.
 *
 * Availables sort callbacks :
 * - 'string'  (default) 
 * - 'float'
 * - 'integer'
 * - 'date'    (use with the dateFormat option : default 'd-m-y')
 *
 * The sortedColId option allow you to sort the column by default (specify the id of the column)
 */
 
$('#5').fixheadertable({ 
   caption     : 'My employees', 
   colratio    : [50, 150, 150, 150, 220, 150], 
   height      : 200, 
   width       : 800, 
   zebra       : true, 
   sortable    : true,
   sortedColId : 0, 
   sortType    : ['integer', 'string', 'string', 'string', 'string', 'date'],
   dateFormat  : 'm/d/Y'
});
		</code></pre>
		<br/><br/>
		
		<div style="border-top : 3px dashed black">&nbsp;</div>
		
		<!--  THE EXAMPLE #6 -->
		
		<div class="title">Example #6 : Medium use <span>(pager)</span></div>		
		<button class="loadexample" num="#6">Load this example</button><br/><br/>
		<table class="resultset" id="6"></table>
		<pre><code class="javascript">
/**
 * The pager option allow you the reduce the set of visible rows. More rows and columns
 * you have, more the sort will be long for example. But not with the pager.
 * Yo can also use the linked option rowsPerPage wich allow you to change the range (10, 25, 50 or 100).
 * 
 * Use the navigation arrows to navigate through your table.
 */
 
$('#6').fixheadertable({ 
    caption     : 'My employees', 
    colratio    : [50, 150, 150, 150, 220, 150],
    height      : 200,
    width       : 800,
    zebra       : true,
    sortable    : true,
    sortedColId : 2, 
    sortType    : ['integer', 'string', 'string', 'string', 'string', 'date'],
    dateFormat  : 'm/d/Y',
    pager       : true,
    rowsPerPage : 10
});
		</code></pre>
		<br/><br/>
		
		<div style="border-top : 3px dashed black">&nbsp;</div>
		
		<!--  THE EXAMPLE #7 -->
		
		<div class="title">Example #7 : Complex use <span>(pager + sort + resize = a real data grid)</span></div>			
		<button class="loadexample" num="#7">Load this example</button><br/><br/>
		<table class="resultset" id="7"></table>
		<pre><code class="javascript">
/**
 * This example takes back all the options viewed before.
 */

$('#7').fixheadertable({ 
    caption     : 'My employees', 
    colratio    : [50, 150, 150, 150, 220, 150],
    height      : 200,
    width       : 800,
    zebra       : true,
    sortable    : true,
    sortedColId : 3, 
    sortType    : ['integer', 'string', 'string', 'string', 'string', 'date'],
    dateFormat  : 'm/d/Y',
    pager       : true,
    rowsPerPage : 10,
    resizeCol	: true
});
		</code></pre>
		<br/><br/>
		
		<div style="border-top : 3px dashed black">&nbsp;</div>
		
		<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
		</div>
	</body>
	<script type="text/javascript">
	var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
	document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
	</script>
	<script type="text/javascript">
	try{
	var pageTracker = _gat._getTracker("UA-12814459-5");
	pageTracker._trackPageview();
	} catch(err) {}
	</script>
</html>
