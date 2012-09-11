/*
* jquery.fixheadertable
*
* Copyright (c) 2010 Benjamin Léouzon
* http://www.tablefixedheader.com/
*
* Licensed under MIT
* http://www.opensource.org/licenses/mit-license.php
* 
* http://docs.jquery.com/Plugins/Authoring
* jQuery authoring guidelines
*
* Launch  : December 2010
* Version : 2.0
*/

(function($) { 

	$.fn.fixheadertable = function(options) {

		var defaults = {  
				
			caption		 : '',
			
			showhide	 : true,
			
			theme		 : 'ui',
			
			height		 : null,
			
			width		 : null, 
			
			minWidth	 : null,
			
			minWidthAuto : false,
			
			colratio	 : [],
			
			whiteSpace	 : 'nowrap',
			
			addTitles	 : false,
			
			zebra		 : false,
			
			zebraClass	 : 'ui-state-active',
			
			sortable	 : false, 
			
			sortedColId	 : null,
			
			sortType	 : [],
			
			dateFormat	 : 'd-m-y',
			
			pager		 : false,
			
			rowsPerPage	 : 10,
			
			resizeCol	 : false,
			
			minColWidth	 : 100,
			
			wrapper		 : true
		};  
		
		var options = $.extend(defaults, options); 
		
		function util_getComputedStyle(element, property) {
			
			if (element.currentStyle) {
				
				var y = x.currentStyle[property];
				
			} else if (window.getComputedStyle) {
				
				var y = document.defaultView.getComputedStyle(element, null).getPropertyValue(property);
			}
			
			return y;
		}
		
		function util_getScrollbarWidth () {
						
			var inner = $('<p/>').addClass('t_fixed_header_scroll_inner');
			
			var outer = $('<div/>').addClass('t_fixed_header_scroll_outer');
			
			outer.append(inner);
			
			$(document.body).append(outer);
			
			var w1 = inner[0].offsetWidth;  
			
			outer.css('overflow', 'scroll');
			
			var w2 = inner[0].offsetWidth;  
			
			if (w1 == w2) w2 = outer[0].clientWidth;  
			
			outer.remove();
			
			return (w1 - w2);			
		}
		
		function util_parseDate (format, date) {
                /*
                * Function taken to jqGrid
                * Thanks to jqGrid 
                * Author: Mark Williams
                * Dual licensed under the MIT and GPL licenses:
                * http://www.opensource.org/licenses/mit-license.php
                * http://www.gnu.org/licenses/gpl-2.0.html
                */
			var tsp = {m : 1, d : 1, y : 1970, h : 0, i : 0, s : 0}, k, hl, dM;
			
			if(date && date !== null && date !== undefined){
				
				date = $.trim(date);
				
				date = date.split(/[\\\/:_;.\t\T\s-]/);
				
				format = format.split(/[\\\/:_;.\t\T\s-]/);
				
				var dfmt = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				
				var afmt = ["am", "pm", "AM", "PM"];
				
				var h12to24 = function(ampm, h){
					
					if (ampm === 0){ if (h == 12) { h = 0;} }
					
					else { if (h != 12) { h += 12; } }
					
					return h;
				};
				
				for (k=0, hl=format.length; k < hl; k++){
					
					if(format[k] == 'M') {
						
						dM = $.inArray(date[k],dfmt);
						
						if(dM !== -1 && dM < 12){date[k] = dM+1;}
					}
					
					if(format[k] == 'F') {
						
						dM = $.inArray(date[k],dfmt);
						
						if(dM !== -1 && dM > 11){date[k] = dM+1-12;}
					}
					
					if(format[k] == 'a') {
						
						dM = $.inArray(date[k],afmt);
						
						if(dM !== -1 && dM < 2 && date[k] == afmt[dM]){
							
							date[k] = dM;
							
							tsp.h = h12to24(date[k], tsp.h);
						}
					}
					
					if(format[k] == 'A') {
						
						dM = $.inArray(date[k],afmt);
						
						if(dM !== -1 && dM > 1 && date[k] == afmt[dM]){
							
							date[k] = dM-2;
							
							tsp.h = h12to24(date[k], tsp.h);
						}
					}
					
					if(date[k] !== undefined) {
						
						tsp[format[k].toLowerCase()] = parseInt(date[k],10);
					}
				}
				
				tsp.m = parseInt(tsp.m,10)-1;
				
				var ty = tsp.y;
				
				if (ty >= 70 && ty <= 99) {tsp.y = 1900 + tsp.y;}
				
				else if (ty >=0 && ty <=69) {tsp.y= 2000 + tsp.y;}
			}
			
			return new Date(tsp.y, tsp.m, tsp.d, tsp.h, tsp.i, tsp.s,0);
		}
		
		return this.each(function() {
			
			var _table				= $(this);
			
			var main_wrapper		= null;
			
			var nbcol 				= $('thead th', this).length;
			
			var _initialWidth		= $(this).width();
			
			var _wrapper 			= null;
			
			var _headerscontainer	= null;
			
			var _fillScrollbar 		= null;
			
			var _body 				= null;
			
			var _headers			= null;
			
			var _scrollWidth		= util_getScrollbarWidth();
			
			var _colgroup			= buildColgroup(nbcol);
			
			var _colgroup_body		= null;
			
			var _nbRowsPerPage		= 10;
			
			var _new_nbRowsPerPage  = null;
			
			var _nbpages			= null;
			
			var _nbpagesDiv			= null;
			
			var _currentpage 		= null;
			
			var _pager				= null;
			
			var _objectTable		= null;
			
			var _stripNum 			= /[\$,%]/g;
			
			var _resizeInfo 		= null;
			
			var _resizeGhost		= null;
			
			function buildTop (table) {
				
				_fillScrollbar = $('<div class="headtable ui-state-default" style="margin-right : 0px"></div>');
				
				_headerscontainer = _fillScrollbar;
				
				_headerscontainer.insertBefore(table);
			}
			
			function buildColgroup (nbcol) {
					
				var colgroup = $('<colgroup />');				
				
				if (options.colratio.length == 0) {
				
					var temp = null;
					
					for (var i = 0; i < nbcol; i++) {
						
						temp = $('<col style="width : ' + (100/nbcol) + '%" />');
						
						colgroup.append(temp);

						temp = null;
					}
				
				} else if (options.colratio.length == nbcol) {
					
					var cw = 0;
					
					for (var i = 0; i < nbcol; i++) {
						
						temp = $('<col style="width : ' + options.colratio[i] + 'px" />');
						
						colgroup.append(temp);

						temp = null;
						
						cw += parseInt(options.colratio[i]);
					}
					
					$(_table).css('width', cw + 'px');
				}
				
				return colgroup;
			}
			
			function sortColumn (table, number, sens, th) {
			       /*
                                * Function inspired by jqGrid
                                * Author: Mark Williams
                                */
				if ((options.sortType.length != 0) && (options.sortType.length == nbcol)) {
					
					var type = options.sortType[number];
					
					if (type == 'float') {						
						
						getSortKey = function(cell) {
							
							var key = parseFloat( String(cell).replace(_stripNum, ''));
							
							return isNaN(key) ? 0.00 : key;
						}
						
					} else if (type == 'integer') {
						
						getSortKey = function(cell) {
							
							return cell ? parseFloat(String(cell).replace(_stripNum, '')) : 0;							
						}
						
					} else if (type == 'date') {
						
						getSortKey = function(cell) {
							
							return util_parseDate(options.dateFormat, cell).getTime();
						}
						
					} else {
						
						getSortKey = function(cell) {
							
							if(!cell) { cell =""; }
							
							return $.trim(String(cell).toLowerCase());
						}
					}
					
				} else {
					
					getSortKey = function(cell) {
						
						if(!cell) { cell =""; }
						
						return $.trim(String(cell).toLowerCase());
					}
				}
				
				_objectTable.sort(function(a, b){
										
					var x = getSortKey(a[number]);
					
				    var y = getSortKey(b[number]);
				    
				    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
				})
					
				if(sens == 'DESC'){
					
					_objectTable.reverse();
				}
				
				(options.pager) ? moveToPage(table) : objectToTable(_objectTable, table);
			}
			
			function objectToTable(objectArray, table) {
				
				var body = $('tbody', table);
								
				body.children().remove();
				
				if(options.zebra){
					
					for (var i = 0; i < objectArray.length; i++){
						
						(i%2) ? (tr = $('<tr class="' + options.zebraClass + '"></tr>')) : (tr = $('<tr></tr>'));									
						
						for (var j in objectArray[i]){
							
							tr.append($('<td class="ui-widget-content"></td>').html(objectArray[i][j]));
						}	
						
						body.append(tr);
					}
					
				} else {
				
					for (var i = 0; i < objectArray.length; i++){
							
						tr = $('<tr></tr>');				
						
						for (var j in objectArray[i]){
							
							tr.append($('<td class="ui-widget-content"></td>').html(objectArray[i][j]));
						}	
						
						body.append(tr);
					}
				}
			}
			
			function tableToObject(table) {

				var objectArray = [];
				
				$('tr', table).each(function(i){
					
					var data = {};
					
					$('td', this).each(function(j){
						
						data[j] = $(this).html();
					})
					
					objectArray.push(data);
				});	

				return objectArray;
			}
			
			function buildHeaders(table) {
				
				_headers = $('<table class="head '+table.className+'"/>').append(_colgroup).append($('thead', table));
				
				_headerscontainer.append(_headers);	
				
				_headers.wrap('<div></div>');
				
				var tab_headers = $('th', _headers);
				
				tab_headers.addClass('ui-widget-content ui-state-default');
								
				if(options.sortable){
					
					var th_div_sort = null;
					
					tab_headers.each(function(i){
						
						$(this).contents().wrapAll('<div class="ui-sort"></div>');
						
						th_div_sort = $('div.ui-sort', this);
						
						th_div_sort.click(function(){
							
							tab_headers.removeClass('ui-state-hover');
							
							$(this).parent().removeClass('ui-state-active').addClass('ui-state-hover');
							
							$('span.ui-icon', tab_headers).remove();
							
							if($(this).hasClass('sortedUp')){
								
								sortColumn(table, i, "DESC", this);
								
								$(this).removeClass('sortedUp').addClass('sortedDown');
								
								$(this).append('<span style="display : inline-block; vertical-align : middle" class="ui-icon ui-icon-triangle-1-s"></span>');
								
							} else {
								
								sortColumn(table, i, "ASC", this);
								
								$(this).removeClass('sortedDown').addClass('sortedUp');
								
								$(this).append('<span style="display : inline-block; vertical-align : middle" class="ui-icon ui-icon-triangle-1-n"></span>');
							}
							
							_headerscontainer[0].scrollLeft = _body[0].scrollLeft;
						})
					});
				    
					$('div.ui-sort', tab_headers).addClass('hover');
				}
				
				if(options.resizeCol && (options.colratio.length == nbcol)){
					
					tab_headers.each(function(i){
						
						var resizer = $('<span class="ui-resize"></span>');
						
						$(this).prepend(resizer);
						
						resizer.mousedown(function(e){
							
							dragStart(i, e);
							
							return false;
						})						
					});
					
					_main_wrapper.mousemove(function(e){
						
						if (_resizeInfo){
							
							dragMove(e);
							
							return false;
						}
					}).mouseup(function(){
						
						if (_resizeInfo){
							
							dragEnd();
							
							return false;
						}
						
						return true;
					});
					
					function getOffset(col){
						
						var ret = 0, cell = $('col', _colgroup), handler = $('th > span.ui-resize', _headers)[col], bso = _body[0].scrollLeft;
						
						for(var i = 0; i < col; i++){
							
							ret += parseInt(cell[i].style.width);
						}
						
						return handler.offsetLeft + 5 + ret - bso;
					}
					
					function dragStart(i, x){
						
						_resizeInfo = { id : i, startX : x.clientX , initTableWidth : getColratioWidth(), offset : getOffset(i) };
						
						_resizeGhost.css({ display : 'block', height : _headerscontainer.height() + _body.height() + 2 + 'px', left : _resizeInfo.offset + 'px', cursor : 'col-resize' });
					}
					
					function dragMove(x){
						
						var diff = x.clientX - _resizeInfo.startX;
						
						_resizeInfo.newWidth = parseInt($('col', _colgroup)[_resizeInfo.id].style.width) + diff;
						
						_resizeInfo.newTableWidth = _resizeInfo.initTableWidth + diff;
						
						if(_resizeInfo.newWidth > parseInt(options.minColWidth)){
						
							_resizeGhost.css({ left :  _resizeInfo.offset + diff + 'px' });
							
						} else {
							
							_resizeInfo.newWidth = parseInt(options.minColWidth);
						}
					}
					
					function dragEnd(){
						
						$(_colgroup.children()[_resizeInfo.id]).css({ width : _resizeInfo.newWidth + 'px' });
						
						$(_colgroup_body.children()[_resizeInfo.id]).css({ width : _resizeInfo.newWidth + 'px' });
						
						var wrapper_width = _resizeInfo.newTableWidth;
						
						_headers.css({ 'width' : wrapper_width + 'px' });
						
						$(_table).css({ 'width'	: wrapper_width + 'px' });
							
						_resizeInfo = null;
						
						_resizeGhost.css({ display : 'none' });
						
						_headerscontainer[0].scrollLeft = _body[0].scrollLeft;
					}
				}
			}

			function isIE6_7() {
				
				if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
					
	        		var ieversion = new Number(RegExp.$1);
	        		 
	 				if (ieversion == 7 || ieversion == 6) {
	 					
	        				return true;
	        				
	        		} else {
	        				return false;
	        		}
	        	}
			}
			
			function isIE8() {
				
				if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
					
	        		var ieversion = new Number(RegExp.$1);
	        		 
	 				if (ieversion == 8) {
	 					
	        				return true;
	        				
	        		} else {
	        				return false;
	        		}
	        	}
			}
			
			function buildBody (table) {
				
				_body = $('<div class="body ui-widget-content"></div>').insertBefore(table).append(table);
				
				if(options.height != null &&  !isNaN(parseInt(options.height))) {
				
					_body.css('height', options.height + 'px');
				}
				
				_colgroup_body = _colgroup.clone();
				
				$(table).prepend(_colgroup_body);
				
				$('td', table).addClass('ui-widget-content');
				
				$(table).wrap('<div></div>');
				
				if (options.addTitles == true) {
				
					$('td', table).each(function() {
						
							$(this).attr('title', $(this).text());
					});			
				}
				
				if (options.zebra) {
					
					$('tr:odd', table).addClass(options.zebraClass);
				}
			}
			
			function adaptScroll (table) {
				
				var scrollwidth = _scrollWidth;
	        	
	        	if(isIE6_7()){
	        		
	        		scrollwidth = 0; 
	        	}
	        	
	        	var width = 0;
	        							
				if (parseInt($(table).height()) > parseInt(options.height)) { 
									
					width = scrollwidth;
					
					overflow = 'scroll';
					
				} else { 
									
					width = 0;
						
					overflow = 'auto';
				}
				
				if($.browser.msie && options.height) {
				
					width = scrollwidth;
					
					overflow = 'scroll';
				}
				
				_fillScrollbar.css('margin-right', width);
				
				return overflow;				
			}
			
			function restrictRows(table, nbrows) {
							
				var length = _objectTable.length;
				
				var limit = 0;
				
				if(length < nbrows) {
					
					limit = length;
				
				} else {
					
					limit = nbrows;
				}
				
				var _objectTableSliced = _objectTable.slice(0, limit);
				
				objectToTable(_objectTableSliced, table);	
				
				_nbpages = Math.ceil(length / nbrows);
				
				_currentpage = 1;
				
				_nbpagesDiv.html('Showing page ' + _currentpage + ' of ' + _nbpages);
				
				_body.css('overflow-y', adaptScroll(table));
				
				$('tr:last td', table).css('border-bottom-width', '1px');
			}
			
			function moveToNextPage(table) {
				
				_currentpage++;
				
				if(_currentpage >= (_nbpages)) {
					
					_currentpage = (_nbpages);
				}
					
				moveToPage(table);
			}
			
			function moveToPreviousPage(table) {
				
				_currentpage--;
				
				if(_currentpage <= 1) {
					
					_currentpage = 1;
				}
				
				moveToPage(table);
			}
			
			function moveToPage(table) {
				
				var length = _objectTable.length;
				
				var start, limit = 0;
				
				start = (_currentpage - 1) * _new_nbRowsPerPage;
				
				if(length < (_currentpage * _new_nbRowsPerPage)) {
					
					limit = length;
				
				} else {
					
					limit = (_currentpage * _new_nbRowsPerPage);
				}
				
				var _objectTableSliced = _objectTable.slice(start, limit);
				
				objectToTable(_objectTableSliced, table);
				
				_nbpagesDiv.html('Showing page ' + _currentpage + ' of ' + _nbpages);
				
				_body.css('overflow-y', adaptScroll(table));	
				
				$('tr:last td', table).css('border-bottom-width', '1px');
			}
			
			function buildNavButton(className, callbackClick, buttonClass) {
				
				var button = $('<div class="button ui-state-default ' + buttonClass + '"><span class="ui-icon ' + className + '">&nbsp;</span></div>');
				
				_pager.append(button);
				
				button.mouseover(function(){
						
					$(this).addClass('ui-state-hover');
						
				}).mousedown(function(){
						
					$(this).addClass('ui-state-active');
						
				}).mouseup(function(){
						
					$(this).removeClass('ui-state-active');
						
				}).mouseout(function(){
					
					$(this).removeClass('ui-state-active');
					
					$(this).removeClass('ui-state-hover');
					
				}).click(callbackClick);	
			}
			
			function buildPager(table) {
				
				_pager = $('<div class="pager ui-widget-header ui-corner-bottom ui-widget-content"></div>');
				
				_main_wrapper.append(_pager);
				
				buildNavButton('ui-icon-arrowthickstop-1-e', function(){
					
					_currentpage = _nbpages;
					
					moveToPage(table);
				}, 'ui-corner-right');
				
				buildNavButton('ui-icon ui-icon-arrowthick-1-e', function(){
					
					moveToNextPage(table);
				}, 'noborder');
				
				buildNavButton('ui-icon ui-icon-arrowthick-1-w', function(){
					
					moveToPreviousPage(table);
				}, 'noborder');
				
				buildNavButton('ui-icon-arrowthickstop-1-w', function(){
					
					_currentpage = 1;
					
					moveToPage(table);
				}, 'ui-corner-left noborder');
				
				_button_set = 
				
				$('<div id="' + table.id + '_radio" style="float : left">' + 
				
					'<input type="radio" id="' + table.id + '_show_10_rows" name="' + table.id + '_radio"/><label for="'  + table.id + '_show_10_rows">10</label>' + 
					'<input type="radio" id="' + table.id + '_show_25_rows" name="' + table.id + '_radio"/><label for="'  + table.id + '_show_25_rows">25</label>' + 
					'<input type="radio" id="' + table.id + '_show_50_rows" name="' + table.id + '_radio" /><label for="' + table.id + '_show_50_rows">50</label>' + 
					'<input type="radio" id="' + table.id + '_show_100_rows" name="' + table.id + '_radio"/><label for="' + table.id + '_show_100_rows">100</label>' + 
				
				'</div>');
									
				_pager.append(_button_set);
				
				$('#' + table.id + '_show_10_rows', _pager).click(function(){
						
						_new_nbRowsPerPage = _nbRowsPerPage;
						
						restrictRows(table, _new_nbRowsPerPage);
				});
				
				$('#' + table.id + '_show_25_rows', _pager).click(function(){
						
						_new_nbRowsPerPage = _nbRowsPerPage * 2.5;
						
						restrictRows(table, _new_nbRowsPerPage);
				});
				
				$('#' + table.id + '_show_50_rows', _pager).click(function(){
					
						_new_nbRowsPerPage = _nbRowsPerPage * 5;
					
						restrictRows(table, _new_nbRowsPerPage);
				});
				
				$('#' + table.id + '_show_100_rows', _pager).click(function(){
					
						_new_nbRowsPerPage = _nbRowsPerPage * 10;
					
						restrictRows(table, _new_nbRowsPerPage);
				});
				
				_nbpagesDiv = $('<div class="page_infos"></div>');
				
				_pager.append(_nbpagesDiv);
				
				_new_nbRowsPerPage = _nbRowsPerPage;
				
				$('#' + table.id + '_show_' + options.rowsPerPage + '_rows', _pager).click();
				
				_button_set.buttonset();
			}
			
			function getColratioWidth(){
				
				var tw = 0;
				
				for(var i = 0; i < options.colratio.length; i++){
					
					tw += parseInt(options.colratio[i]);
				}
				
				return tw;
			}

			/***********************/
			/********* MAIN ********/
			/***********************/
			
			_wrapper = $('<div/>').addClass('t_fixed_header ui-state-default default ' + options.theme).insertBefore(this).append(this);
			
			_wrapper.css('border', 'none').css('font-weight', 'normal');
			
			_main_wrapper = $('<div class="t_fixed_header_main_wrapper ui-widget ui-widget-header ' + options.theme + '"></div>');
			
			if (options.whiteSpace == 'normal') {
			
				_wrapper.addClass('t_fixed_header_wrap');
			}		
			
			buildTop(this);
			
			buildHeaders(this);	
			
			buildBody(this);
			
			if(options.wrapper){
			
				var tampon = _wrapper.wrap('<div class="ui-widget ui-widget-content ui-corner-all" style="padding : 5px; font-size : 1em;"></div>').parent();
				
			} else {
				
				var tampon = _wrapper.wrap('<div></div>').parent();
			}
			
			if (options.width != null && !isNaN(parseInt(options.width)) && options.width > 0) {
				
				tampon.css('width', options.width + 'px');	
			}
			
			var res = _wrapper.detach();
			
			var main_wrapper_child = $('<div class="t_fixed_header_main_wrapper_child"></div>');
			
			_main_wrapper.append(main_wrapper_child);
			
			main_wrapper_child.append(res);
			
			tampon.append(_main_wrapper);	
			
			if(isIE6_7()){
			
				_body.css('margin-bottom', 17 + 'px');
			}
			
			if (options.caption != '') {
				
				var caption = $('<div class="t_fixed_header_caption ui-widget-header ui-corner-top">' + options.caption + '</div>');
				
				_main_wrapper.prepend(caption).addClass('ui-corner-all');
				
				if (options.showhide) {
				
					var showhide = $('<div style="cursor : pointer; display : inline-block; vertical-align : middle; background : none; border : none;" class="ui-state-active"><span class="ui-icon ui-icon-triangle-1-n">&nbsp;</span></div>');
					
					caption.append(showhide);
					
					showhide.click(function(){
						
						main_wrapper_child.toggle();
						
						caption.toggleClass('toggle')
						
						if(_pager) _pager.toggle();
						
						$('span', showhide).toggleClass('ui-icon-triangle-1-s');
					});
				
				}
			} 	
						
			if (options.sortable || options.pager) {
				
				_objectTable = tableToObject(this);
			}
			
			if (options.pager) {
				
				buildPager(this);
			}
			
			if(options.sortable && !isNaN(parseInt(options.sortedColId))) {
				
				var cur_th = $('th', _headers)[options.sortedColId];
				
				$(cur_th).addClass('ui-state-hover')
				
				$('div.ui-sort', cur_th).click();
			}
			
			if(options.resizeCol && (options.colratio.length == nbcol)){
			
				_resizeGhost = $('<div class="ui-resize-ghost ui-widget-header" style="height : ' + _main_wrapper.parent().height() + 'px"></div>');
				
				_wrapper.append(_resizeGhost);
			}
			
			_body.css('overflow-y', adaptScroll(this));
			
			if (options.minWidth != null && !isNaN(parseInt(options.minWidth)) && options.minWidth > 0) {
				
				var minWidth = options.minWidth + 'px';
				
			} else if (options.minWidthAuto) {
				
				if (options.colratio.length == nbcol) {
					
					var minWidth =  $(this).width() + 'px';
					
				} else {
					
					var minWidth = (_initialWidth + 150) + 'px';
				}
			}
						
			_headerscontainer.children().first().css('min-width', minWidth);
			
			_body.children().first().css('min-width', minWidth);
			
			_body.scroll(function(){
				
				_headerscontainer[0].scrollLeft = _body[0].scrollLeft;

				if(isIE6_7()) { $(_headerscontainer[0]).css('margin-left', -_body[0].scrollLeft + 'px'); }
			});
			
			if (options.colratio.length == nbcol) {
								
				_wrapper.removeClass('default');
				
				$(_headers).css('width', getColratioWidth() + 'px');
			}
		});
	};

})(jQuery);