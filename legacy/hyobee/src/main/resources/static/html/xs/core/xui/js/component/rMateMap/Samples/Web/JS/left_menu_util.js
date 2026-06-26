var activeListMenu, activeSubMenu, // sample menu
	ani_index = 0, // 실행되는 이펙트 count
	all_ani_dirty = false; // 해당 페이지내에 실행중인 effect의 여부

// change menu - chart type, properties
function changeMenu(tabIndex){
	var role, 
		i = 0, index = 0,
		menu, menus = _$("sample_menus"),
		list, lists = _$("sample_lists");
	
	index = 0;
	do{
		menu = menus.childNodes[i];
		if(menu.nodeType != 3){
			role = (index == tabIndex) ? "add" : "remove";
			modiClass(menu, role, "sample_menus_active");
			index++;
		}
		i++;
	}while(i < menus.childNodes.length);

	i = index = 0;
	do{
		list = lists.childNodes[i];
		if(list.nodeType != 3 && list.className != "SampleScrollBar"){
			if(index == tabIndex){
				list.style.display = "block";
				activeMenuName = list.id;
				scrollBarSetup(activeMenuName);
			}else
				list.style.display = "none";
			
			//list._scrollBar.element.style.display = list.style.display;
			index++;
		}
		i++;
	}while(i < lists.childNodes.length);

	scrollBarUpdate();
}

function getActiveScrollBar(){
	return window[scrollBarNames[activeMenuName]];
}

function scrollBarUpdate(){
	getActiveScrollBar().update();
}

function scrollBarSetup(id){
	var menu = _$(id),
		scrollBar = scrollBarNames[id];

	/*if(!window[scrollBar]){
		window[scrollBar] = new SampleScrollBar(_$("sample_lists"));
	
		scrollBar = window[scrollBar];
		scrollBar.setup(menu);
		activeMenuName = id;

		menu._scrollBar = scrollBar;
	}*/
}

function setupEvent(){
	// menu click handler
	$("#sample_menus").bind("click", function(event){
		var expandItem,
			i = 0, index = 0, 
			target = event.target,
			currentTarget = event.currentTarget;
		
		if(target.className == "expand"){
			expandItem = target;
			target = target.parentNode;
		}

		while(menu = currentTarget.childNodes[i]){
			if(menu.nodeType != 3){
				if(menu === target)
					break;
				index++;
			}
			i++;
		}

		changeMenu(index);
		
//		if(expandItem){
//			expandAllMenu(expandItem.innerText, expandItem.parentNode.className.split(" ")[0].replace(/menu/, "list"));
//			expandItem.innerText = expandItem.innerText == "+" ? "-" : "+";
//		}
	});

	// sample lists menu item click handler
	$("#sample_lists").bind("click", function(event){
		switch(event.target.tagName){
			case "SPAN":
				if ( event.target.parentNode.className != "footer" )
					expandItem(event.target);
				break;
			case "A":
				selectTypeItem(event.target.parentNode);
				break;
			default:
				break;
		}
	});
}

// change sample
function selectTypeItem(item){
	if(activeSubMenu)
		modiClass(activeSubMenu, "remove", "item_active");
	modiClass(item, "add", "item_active");
	activeSubMenu = item;
}
var i = 0;
var subFrameOpened = false;
// expand menu
function expandItem(item){

	var mainFrame = window.parent.document.getElementById("mainFrame");
	if ( !subFrameOpened ){
		var moveFrame = setInterval(function(){
			i = i + 2;
			mainFrame.cols = (i+179)+"px, 100%";
			if ( i == 169 ) {
				subFrameOpened = true;
				clearInterval(moveFrame);
			}
		}, 1);
	}

	if(activeListMenu)
		modiClass(activeListMenu, "remove", "list_active");
	modiClass(item, "add", "list_active");
	activeListMenu = item;
	

	for (var i = 0 ; i < types.length ; i++ ) {
		if ( types[i].n == item.textContent || types[i].n == item ) {
			var heightV = 78 + (i*27);

			if ( i == 1 || i > 5 )	{
				_$("chart_type_subList").childNodes[i].style.top = heightV+"px";
				_$("subListCircle").style.top = heightV+2-55+"px";
			} else {
				_$("chart_type_subList").childNodes[i].style.top = heightV-2+"px";
				_$("subListCircle").style.top = heightV-55+"px";
			}
			_$("chart_type_subList").childNodes[i].style.visibility = "visible";
			_$("subListCircle").style.visibility = "visible";
		} else {
			_$("chart_type_subList").childNodes[i].style.visibility = "hidden";
			_$("chart_type_subList").childNodes[i].style.top = "0px";
		}
	}
}

function scrollBarUpdate(){
	//typeScrollBar.update();
}

// create sample - sample_info
function createSample(){
	createMenuItems(_$("chart_type_list"), types);
}

//
function createMenuItems(target, items){
	var i, n, j, m, div, span, ul, li, item;
	
	for(i = 0, n = items.length ; i < n ; i += 1){
		item = items[i];
		div = _C("div");
		span = _C("span");
		ul = _C("ul");
	
		span.innerHTML = item.n;
		ul.id = item.n + "_sub";
		span.id = item.n;
		div.appendChild(span);

		for(j = 0, m = item.c.length ; j < m ; j += 1){
			child = item.c[j];
			li = document.createElement("li");
			li.innerHTML = '<a href="../' + child.u + '.html" target="sampleFrame">' + child.n + '</a>';
			li._url = child.u;

			ul.appendChild(li);
		}

		if(item.n == "Scroll")
			div.className = "sample_divide";
	
		_$("chart_type_subList").appendChild(ul);

		var mark = document.createElement("img");
		mark.src = "./Images/circle.png";
		mark.id = "subListCircle";
		mark.className = "subListCircle";
		mark.style.left = "175px";
		target.appendChild(div);
	}
	_$("chart_type_subList").parentNode.appendChild(mark);
}

// comp ie 7, 8, quirk
function compIE(){
	var agent = navigator.userAgent;
	if(agent.indexOf("MSIE 7.0") > -1 || agent.indexOf("MSIE 8.0") > - 1 || agent.indexOf("Trident 4.0") > -1 || document.documentMode && document.documentMode <= 5)
		return true;
	return false;
}

function setupSampleListsHeight(){
	$("#sample_lists").height($(".wrapper").outerHeight() - ($(".title").outerHeight() + $("#sample_menus").outerHeight() + $(".manual_menus").outerHeight() + $(".footer").outerHeight()));
}

// effect
// e : 적용 엘리먼트
// fp : from prop value
// tp : to prop value
// d : duration
function playEffect(e, fp, tp, endFunc, d, scroll){
	var o,
		endTime,
		interval,
		offset = 1 / d,
		startTime = new Date().getTime(),
		play = function(){
			endTime = new Date().getTime();
			for(o in tp){
				if(endTime - startTime > d){
					if(scroll)
						e.scrollTo(0, tp[o]);
					else
						e.style[o] = tp[o] + "px";
					clearInterval(interval);
					endFunc(e);
					ani_index--;
					if(ani_index == 0)
						all_ani_dirty = false;
				}else{
					if(scroll)
						e.scrollTo(0, (easingFunc(endTime - startTime, 0, 1, d)  * (tp[o] - fp[o])));
					else
						e.style[o] = fp[o] + (easingFunc(null, endTime - startTime, 0, 1, d)  * (tp[o] - fp[o])) + "px";
				}
			}
		};
	// 이펙트 중이 아닐 경우만
	if(!e._ani_dirty){
		ani_index++; // 이펙트 count 증가
		all_ani_dirty = e._ani_dirty = true;
		interval = setInterval(play, 20);
	}
}

function easingFunc(x, t, b, c, d){
	return c*((t=t/d-1)*t*t + 1) + b;
}